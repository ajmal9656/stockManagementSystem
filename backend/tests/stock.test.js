import request from "supertest";
import app from "../app.js";
import User from "../models/User.js";
import Store from "../models/Store.js";
import Product from "../models/Product.js";
import Stock from "../models/Stock.js";

let adminToken;
let shopperToken;

beforeEach(async () => {
  await request(app).post("/api/auth/register").send({
    name: "Admin",
    email: "admin@gmail.com",
    password: "12345678",
  });

  await User.updateOne({ email: "admin@gmail.com" }, { role: "admin" });

  const adminLogin = await request(app).post("/api/auth/login").send({
    email: "admin@gmail.com",
    password: "12345678",
  });

  adminToken = adminLogin.headers["set-cookie"][0].split(";")[0].split("=")[1];

  await request(app).post("/api/auth/register").send({
    name: "Shopper",
    email: "shopper@gmail.com",
    password: "12345678",
  });

  const shopperLogin = await request(app).post("/api/auth/login").send({
    email: "shopper@gmail.com",
    password: "12345678",
  });

  shopperToken = shopperLogin.headers["set-cookie"][0]
    .split(";")[0]
    .split("=")[1];
});

describe("Stock API", () => {
  test("Admin should get stocks by store", async () => {
    const store = await Store.create({
      name: "Store A",
      description: "Store",
    });

    const product = await Product.create({
      name: "Laptop",
      sku: "SKU001",
      description: "Dell",
    });

    await Stock.create({
      store: store._id,
      product: product._id,
      quantity: 20,
    });

    const response = await request(app)
      .get(`/api/stock/getStocks/${store._id}`)
      .set("Cookie", [`token=${adminToken}`]);

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
  });

  test("Admin should assign product successfully", async () => {
    const store = await Store.create({
      name: "Store A",
      description: "Store",
    });

    const product = await Product.create({
      name: "Laptop",
      sku: "SKU001",
      description: "Dell",
    });

    const response = await request(app)
      .post("/api/stock/assignProduct")
      .set("Cookie", [`token=${adminToken}`])
      .send({
        storeId: store._id,
        productId: product._id,
        quantity: 10,
      });

    expect(response.statusCode).toBe(201);
    expect(response.body.success).toBe(true);
  });

  test("Shopper should not assign product", async () => {
    const store = await Store.create({
      name: "Store A",
      description: "Store",
    });

    const product = await Product.create({
      name: "Laptop",
      sku: "SKU001",
      description: "Dell",
    });

    const response = await request(app)
      .post("/api/stock/assignProduct")
      .set("Cookie", [`token=${shopperToken}`])
      .send({
        storeId: store._id,
        productId: product._id,
        quantity: 10,
      });

    expect(response.statusCode).toBe(403);
    expect(response.body.success).toBe(false);
  });

  test("Admin should adjust stock successfully", async () => {
    const store = await Store.create({
      name: "Store A",
      description: "Store",
    });

    const product = await Product.create({
      name: "Laptop",
      sku: "SKU001",
      description: "Dell",
    });

    const stock = await Stock.create({
      store: store._id,
      product: product._id,
      quantity: 20,
    });

    const response = await request(app)
      .patch("/api/stock/adjustStock")
      .set("Cookie", [`token=${adminToken}`])
      .send({
        stockId: stock._id,
        quantity: 5,
      });

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
  });

  test("Admin should get available stores", async () => {
    const sourceStore = await Store.create({
      name: "Store A",
      description: "Store",
    });

    await Store.create({
      name: "Store B",
      description: "Store",
    });

    const product = await Product.create({
      name: "Laptop",
      sku: "SKU001",
      description: "Dell",
    });

    const stock = await Stock.create({
      store: sourceStore._id,
      product: product._id,
      quantity: 20,
    });

    const response = await request(app)
      .get(`/api/stock/availableStores/${stock._id}`)
      .set("Cookie", [`token=${adminToken}`]);

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
  });

  test("Admin should transfer stock end-to-end", async () => {
    const sourceStore = await Store.create({
      name: "Store A",
      description: "Store",
    });

    const destinationStore = await Store.create({
      name: "Store B",
      description: "Store",
    });

    const product = await Product.create({
      name: "Laptop",
      sku: "SKU001",
      description: "Dell",
    });

    const sourceStock = await Stock.create({
      store: sourceStore._id,
      product: product._id,
      quantity: 20,
    });

    const response = await request(app)
      .patch("/api/stock/transferStock")
      .set("Cookie", [`token=${adminToken}`])
      .send({
        stockId: sourceStock._id,
        toStoreId: destinationStore._id,
        quantity: 5,
      });

    expect(response.statusCode).toBe(200);

    const updatedSource = await Stock.findById(sourceStock._id);

    const destinationStock = await Stock.findOne({
      store: destinationStore._id,
      product: product._id,
    });

    expect(updatedSource.quantity).toBe(15);
    expect(destinationStock.quantity).toBe(5);
  });

  test("Should reject transfer when quantity exceeds available stock", async () => {
    const sourceStore = await Store.create({
      name: "Store A",
      description: "Store",
    });

    const destinationStore = await Store.create({
      name: "Store B",
      description: "Store",
    });

    const product = await Product.create({
      name: "Laptop",
      sku: "SKU001",
      description: "Dell",
    });

    const stock = await Stock.create({
      store: sourceStore._id,
      product: product._id,
      quantity: 10,
    });

    const response = await request(app)
      .patch("/api/stock/transferStock")
      .set("Cookie", [`token=${adminToken}`])
      .send({
        stockId: stock._id,
        toStoreId: destinationStore._id,
        quantity: 20,
      });

    expect(response.statusCode).toBe(400);
    expect(response.body.success).toBe(false);

    const updatedStock = await Stock.findById(stock._id);

    expect(updatedStock.quantity).toBe(10);
  });

  test("Concurrent transfers should never make stock negative", async () => {
    const sourceStore = await Store.create({
      name: "Store A",
      description: "Store",
    });

    const destinationStore = await Store.create({
      name: "Store B",
      description: "Store",
    });

    const product = await Product.create({
      name: "Laptop",
      sku: "SKU001",
      description: "Dell",
    });

    const stock = await Stock.create({
      store: sourceStore._id,
      product: product._id,
      quantity: 10,
    });

    const [res1, res2] = await Promise.all([
      request(app)
        .patch("/api/stock/transferStock")
        .set("Cookie", [`token=${adminToken}`])
        .send({
          stockId: stock._id,
          toStoreId: destinationStore._id,
          quantity: 8,
        }),

      request(app)
        .patch("/api/stock/transferStock")
        .set("Cookie", [`token=${adminToken}`])
        .send({
          stockId: stock._id,
          toStoreId: destinationStore._id,
          quantity: 8,
        }),
    ]);

    const updatedStock = await Stock.findById(stock._id);

    expect(updatedStock.quantity).toBeGreaterThanOrEqual(0);

    const successCount = [res1, res2].filter(
      (res) => res.statusCode === 200,
    ).length;

    expect(successCount).toBe(1);
  });
});

import request from "supertest";
import app from "../app.js";
import User from "../models/User.js";

let adminToken;
let shopperToken;

beforeEach(async () => {
  await request(app)
    .post("/api/auth/register")
    .send({
      name: "Admin",
      email: "admin@gmail.com",
      password: "12345678",
    });

  await User.updateOne(
    { email: "admin@gmail.com" },
    { role: "admin" }
  );

  const adminLogin = await request(app)
    .post("/api/auth/login")
    .send({
      email: "admin@gmail.com",
      password: "12345678",
    });

  adminToken = adminLogin.headers["set-cookie"][0]
    .split(";")[0]
    .split("=")[1];

  await request(app)
    .post("/api/auth/register")
    .send({
      name: "Shopper",
      email: "shopper@gmail.com",
      password: "12345678",
    });

  const shopperLogin = await request(app)
    .post("/api/auth/login")
    .send({
      email: "shopper@gmail.com",
      password: "12345678",
    });

  shopperToken = shopperLogin.headers["set-cookie"][0]
    .split(";")[0]
    .split("=")[1];
});

describe("Product API", () => {

  test("Admin should add product successfully", async () => {

    const response = await request(app)
      .post("/api/product/addProduct")
      .set("Cookie", [`token=${adminToken}`])
      .send({
        name: "Laptop",
        description: "Dell Laptop",
      });

    expect(response.statusCode).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data.name).toBe("Laptop");

  });

  test("Shopper should not add product", async () => {

    const response = await request(app)
      .post("/api/product/addProduct")
      .set("Cookie", [`token=${shopperToken}`])
      .send({
        name: "Laptop",
        description: "Dell Laptop",
      });

    expect(response.statusCode).toBe(403);
    expect(response.body.success).toBe(false);

  });

  test("Admin should get products", async () => {

    const response = await request(app)
      .get("/api/product/getProducts")
      .set("Cookie", [`token=${adminToken}`]);

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);

  });

  test("Shopper should get products", async () => {

    const response = await request(app)
      .get("/api/product/getProducts")
      .set("Cookie", [`token=${shopperToken}`]);

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);

  });

});
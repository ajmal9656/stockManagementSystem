import request from "supertest";
import app from "../app.js";

describe("Auth API", () => {
  test("Register user successfully", async () => {
    const response = await request(app).post("/api/auth/register").send({
      name: "Ajmal",
      email: "ajmal@gmail.com",
      password: "12345678",
    });

    expect(response.statusCode).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data.email).toBe("ajmal@gmail.com");
  });

  test("Should not register with duplicate email", async () => {
    await request(app).post("/api/auth/register").send({
      name: "Ajmal",
      email: "ajmal@gmail.com",
      password: "12345678",
    });

    const response = await request(app).post("/api/auth/register").send({
      name: "Ajmal",
      email: "ajmal@gmail.com",
      password: "12345678",
    });

    expect(response.statusCode).toBe(409);
    expect(response.body.success).toBe(false);
  });

  test("Should not register with invalid email", async () => {
    const response = await request(app).post("/api/auth/register").send({
      name: "Ajmal",
      email: "abc",
      password: "12345678",
    });

    expect(response.statusCode).toBe(400);
  });

  test("Login successfully", async () => {
    await request(app).post("/api/auth/register").send({
      name: "Ajmal",
      email: "ajmal@gmail.com",
      password: "12345678",
    });

    const response = await request(app).post("/api/auth/login").send({
      email: "ajmal@gmail.com",
      password: "12345678",
    });

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
  });

  test("Should not login with wrong password", async () => {
    await request(app).post("/api/auth/register").send({
      name: "Ajmal",
      email: "ajmal@gmail.com",
      password: "12345678",
    });

    const response = await request(app).post("/api/auth/login").send({
      email: "ajmal@gmail.com",
      password: "87654321",
    });

    expect(response.statusCode).toBe(401);
    expect(response.body.success).toBe(false);
  });

  test("Should not login with non-existing email", async () => {
    const response = await request(app).post("/api/auth/login").send({
      email: "test@gmail.com",
      password: "12345678",
    });

    expect(response.statusCode).toBe(401);
    expect(response.body.success).toBe(false);
  });
});

import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import storeRoutes from "./routes/storeRoutes.js";
import stockRoutes from "./routes/stockRoutes.js";
import errorMiddleware from "./middlewares/errorMiddleware.js";

import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

const swaggerDocument = YAML.load("./openapi.yaml");

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument, {
    explorer: true,
    customSiteTitle: "Stock Management System API",
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/product", productRoutes);
app.use("/api/store", storeRoutes);
app.use("/api/stock", stockRoutes);

app.use(errorMiddleware);

export default app;
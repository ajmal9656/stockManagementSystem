import express from "express";
import * as productController from "../controllers/productController.js";
import validationMiddleware from "../middlewares/validationMiddleware.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import adminMiddleware from "../middlewares/adminMiddleware.js";
import { productValidator } from "../validators/productValidator.js";



const router = express.Router();

router.post(
  "/addProduct",
  authMiddleware,
  adminMiddleware,
  productValidator,
  validationMiddleware,
  productController.addProduct
);

router.get(
  "/getProducts",
  authMiddleware,
  productController.getProducts
);

export default router;

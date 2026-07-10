import express from "express";
import * as stockController from "../controllers/stockController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import adminMiddleware from "../middlewares/adminMiddleware.js";
import validationMiddleware from "../middlewares/validationMiddleware.js";
import { adjustStockValidator, assignProductValidator, availableProductsValidator } from "../validators/stockvalidator.js";




const router = express.Router();

router.get(
  "/getStocks/:storeId",
  authMiddleware,
  stockController.getStocksByStore
);

router.get(
  "/availableProducts/:storeId",
  authMiddleware,
  adminMiddleware,
  availableProductsValidator,
  validationMiddleware,
  stockController.getAvailableProducts
);

router.post(
  "/assignProduct",
  authMiddleware,
  adminMiddleware,
  assignProductValidator,
  validationMiddleware,
  stockController.assignProduct
);

router.patch(
  "/adjustStock",
  authMiddleware,
  adminMiddleware,
  adjustStockValidator,
  validationMiddleware,
  stockController.adjustStock
);

export default router;

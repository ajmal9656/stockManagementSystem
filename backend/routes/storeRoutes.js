import express from "express";
import * as storeController from "../controllers/storeController.js";
import validationMiddleware from "../middlewares/validationMiddleware.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import adminMiddleware from "../middlewares/adminMiddleware.js";
import { storeValidator } from "../validators/storeValidator.js";

const router = express.Router();

router.post(
  "/addStore",
  authMiddleware,
  adminMiddleware,
  storeValidator,
  validationMiddleware,
  storeController.addStore,
);

router.get("/getStores", authMiddleware, storeController.getStores);

export default router;

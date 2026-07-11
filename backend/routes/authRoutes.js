import express from "express";
import * as authController from "../controllers/authController.js";
import { loginValidator,registerValidator } from "../validators/authValidator.js";
import validationMiddleware from "../middlewares/validationMiddleware.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post(
  "/register",
  registerValidator,
  validationMiddleware,
  authController.register
);

router.post(
  "/login",
  loginValidator,
  validationMiddleware,
  authController.login
);

router.post(
  "/logout",
  authController.logout
);

export default router;
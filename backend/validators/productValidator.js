import { body } from "express-validator";

export const productValidator = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Product name is required."),

  body("description")
    .trim()
    .notEmpty()
    .withMessage("Description is required.")
    .isLength({ min: 5 })
    .withMessage("Description must be at least 5 characters."),
];
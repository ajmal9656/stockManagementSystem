import { body } from "express-validator";

export const storeValidator = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Store name is required."),

  body("description")
    .trim()
    .notEmpty()
    .withMessage("Description is required.")
    .isLength({ min: 5 })
    .withMessage("Description must be at least 5 characters."),
];
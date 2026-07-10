import { param } from "express-validator";

export const availableProductsValidator = [
  param("storeId")
    .isMongoId()
    .withMessage("Invalid store id."),
];

import { body } from "express-validator";

export const assignProductValidator = [
  body("storeId")
    .isMongoId()
    .withMessage("Invalid store."),

  body("productId")
    .isMongoId()
    .withMessage("Invalid product."),

  body("quantity")
    .isInt({ min: 1 })
    .withMessage("Quantity must be greater than 0."),
];



export const adjustStockValidator = [
  body("stockId")
    .isMongoId()
    .withMessage("Invalid stock."),

  body("quantity")
    .isInt({ min: 1 })
    .withMessage("Quantity must be greater than 0."),
];


export const availableStoresValidator = [
  param("stockId")
    .isMongoId()
    .withMessage("Invalid store."),
];


export const transferStockValidator = [
  body("stockId")
    .isMongoId()
    .withMessage("Invalid stock."),

  body("toStoreId")
    .isMongoId()
    .withMessage("Invalid destination store."),

  body("quantity")
    .isInt({ min: 1 })
    .withMessage("Quantity must be greater than 0."),
];
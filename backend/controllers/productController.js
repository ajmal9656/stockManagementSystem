import { STATUS, USER_ROLES } from "../constants/constants.js";
import * as productService from "../services/productService.js";

export const addProduct = async (req, res, next) => {
  try {
    const product = await productService.addProduct(req.body);

    return res.status(201).json({
      success: true,
      message: "Product added successfully.",
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

export const getProducts = async (req, res, next) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;
    const status =
          req.user.role === USER_ROLES.SHOPPER ? STATUS.ACTIVE : STATUS.INACTIVE;

    const { products, totalProducts } = await productService.getProducts(
      page,
      limit,
      status
    );

    res.status(200).json({
      success: true,
      data: products,
      page,
      totalPages: Math.ceil(totalProducts / limit),
    });
  } catch (error) {
    next(error);
  }
};

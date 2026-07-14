import mongoose from "mongoose";
import Product from "../models/Product.js";
import { STATUS } from "../constants/constants.js";

export const addProduct = async ({ name, description }) => {
  const existingProduct = await Product.findOne({
    name: name.trim(),
  });

  if (existingProduct) {
    const error = new Error("Product already exists.");
    error.statusCode = 409;
    throw error;
  }

  const sku = `SKU-${new mongoose.Types.ObjectId()
    .toString()
    .slice(-6)
    .toUpperCase()}`;

  const product = await Product.create({
    name,
    sku,
    description,
  });

  return product;
};

export const getProducts = async (page, limit,status) => {
  const skip = (page - 1) * limit;
  let filter = {}
  if(status === STATUS.ACTIVE){
    filter.status = status
  }

  const products = await Product.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const totalProducts = await Product.countDocuments(filter);

  return {
    products,
    totalProducts,
  };
};

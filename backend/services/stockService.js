import Stock from "../models/Stock.js";
import Store from "../models/Store.js";
import Product from "../models/Product.js";
import { STATUS } from "../constants/constants.js";


export const getStocksByStore = async (
  storeId,
  query
) => {
    const store = await Store.findById(storeId);
    console.log("store",store);
    

if (!store) {
  const error = new Error("Store not found.");
  error.statusCode = 404;
  throw error;
}

  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 5;
  const threshold = Number(query.threshold);

  const filter = {
    store: storeId,
  };

  if (query.threshold) {
  filter.quantity = {
    $lte: Number(query.threshold),
  };
}

  const totalStocks = await Stock.countDocuments(filter);
  console.log("totalStocks",totalStocks);
  console.log("filter",filter);
  
  

  const stocks = await Stock.find(filter)
    .populate("product", "name sku")
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);
    console.log("stocks",stocks);
    

  return {
    data: {
        storeName: store.name,
        stocks
    },
    page,
    totalPages: Math.ceil(totalStocks / limit),
  };
};



export const getAvailableProducts = async (
  storeId
) => {
  const store = await Store.findById(storeId);

  if (!store) {
    const error = new Error("Store not found.");
    error.statusCode = 404;
    throw error;
  }
  if (store.status !== STATUS.ACTIVE) {
  const error = new Error("Store is inactive.");
  error.statusCode = 400;
  throw error;
}

  const stockedProducts = await Stock.find({
    store: storeId,
  }).select("product");

  const productIds = stockedProducts.map(
    (stock) => stock.product
  );

  const products = await Product.find({
    _id: {
      $nin: productIds,
    },
    status: STATUS.ACTIVE,
  })
    .select("name sku")
    .sort({ name: 1 });

  return products;
};


export const assignProduct = async ({
  storeId,
  productId,
  quantity,
}) => {
  const store = await Store.findById(storeId);

  if (!store) {
    const error = new Error("Store not found.");
    error.statusCode = 404;
    throw error;
  }
 
if (store.status !== STATUS.ACTIVE) {
  const error = new Error("Store is inactive.");
  error.statusCode = 400;
  throw error;
}

  const product = await Product.findById(productId);

  if (!product) {
    const error = new Error("Product not found.");
    error.statusCode = 404;
    throw error;
  }
 
if (product.status !== STATUS.ACTIVE) {
  const error = new Error("Product is inactive.");
  error.statusCode = 400;
  throw error;
}
  

  const existingStock = await Stock.findOne({
    store: storeId,
    product: productId,
  });

  if (existingStock) {
    const error = new Error(
      "Product already assigned to this store."
    );
    error.statusCode = 409;
    throw error;
  }

  const stock = await Stock.create({
    store: storeId,
    product: productId,
    quantity,
  });

  return stock;
};



export const adjustStock = async ({
  stockId,
  quantity,
}) => {
  const stock = await Stock.findById(stockId);

  if (!stock) {
    const error = new Error("Stock not found.");
    error.statusCode = 404;
    throw error;
  }

  stock.quantity += quantity;

  await stock.save();

  return stock;
};
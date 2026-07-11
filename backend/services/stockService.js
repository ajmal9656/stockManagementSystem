import Stock from "../models/Stock.js";
import Store from "../models/Store.js";
import Product from "../models/Product.js";
import { STATUS } from "../constants/constants.js";
import mongoose from "mongoose";


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
  const stock = await Stock.findById(stockId)
    .populate("store")
    .populate("product");

  if (!stock) {
    const error = new Error("Stock not found.");
    error.statusCode = 404;
    throw error;
  }

  if (stock.store.status !== STATUS.ACTIVE) {
    const error = new Error("Store is inactive.");
    error.statusCode = 400;
    throw error;
  }

  if (stock.product.status !== STATUS.ACTIVE) {
    const error = new Error("Product is inactive.");
    error.statusCode = 400;
    throw error;
  }
  if (
    quantity < 0 &&
    Math.abs(quantity) > stock.quantity
  ) {
    const error = new Error(
      "Adjustment quantity cannot be greater than available stock."
    );
    error.statusCode = 400;
    throw error;
  }

  let updatedStock;

  if (quantity >= 0) {
    updatedStock = await Stock.findByIdAndUpdate(
      stockId,
      {
        $inc: {
          quantity,
        },
      },
      {
        new: true,
      }
    );
  } else {
    updatedStock = await Stock.findOneAndUpdate(
      {
        _id: stockId,
        quantity: {
          $gte: Math.abs(quantity),
        },
      },
      {
        $inc: {
          quantity,
        },
      },
      {
        new: true,
      }
    );

    if (!updatedStock) {
      const error = new Error(
        "Insufficient stock for adjustment."
      );
      error.statusCode = 400;
      throw error;
    }
  }

  return updatedStock;
};



export const getAvailableStores = async (
  stockId
) => {
  const stock = await Stock.findById(stockId)
    .populate("store")
    .populate("product");

  if (!stock) {
    const error = new Error("Stock not found.");
    error.statusCode = 404;
    throw error;
  }

  if (stock.store.status !== STATUS.ACTIVE) {
    const error = new Error("Store is inactive.");
    error.statusCode = 400;
    throw error;
  }

  if (stock.product.status !== STATUS.ACTIVE) {
    const error = new Error("Product is inactive.");
    error.statusCode = 400;
    throw error;
  }

  const stores = await Store.find({
    _id: { $ne: stock.store._id },
    status: STATUS.ACTIVE,
  })
    .select("name")
    .sort({ name: 1 });

  return stores;
};



export const transferStock = async ({
  stockId,
  toStoreId,
  quantity,
}) => {
  const session =
    await mongoose.startSession();

  session.startTransaction();

  try {
    const sourceStock = await Stock.findById(
      stockId
    )
      .populate("store")
      .populate("product")
      .session(session);

    if (!sourceStock) {
      const error = new Error("Stock not found.");
      error.statusCode = 404;
      throw error;
    }

    if (!sourceStock.store) {
      const error = new Error("Store not found.");
      error.statusCode = 404;
      throw error;
    }

    if (!sourceStock.product) {
      const error = new Error("Product not found.");
      error.statusCode = 404;
      throw error;
    }

    if (
      sourceStock.store.status !== STATUS.ACTIVE
    ) {
      const error = new Error(
        "Source store is inactive."
      );
      error.statusCode = 400;
      throw error;
    }

    if (
      sourceStock.product.status !== STATUS.ACTIVE
    ) {
      const error = new Error(
        "Product is inactive."
      );
      error.statusCode = 400;
      throw error;
    }

    if (
      sourceStock.store._id.toString() ===
      toStoreId
    ) {
      const error = new Error(
        "Cannot transfer to the same store."
      );
      error.statusCode = 400;
      throw error;
    }

    const destinationStore =
      await Store.findById(toStoreId).session(
        session
      );

    if (!destinationStore) {
      const error = new Error(
        "Destination store not found."
      );
      error.statusCode = 404;
      throw error;
    }

    if (
      destinationStore.status !== STATUS.ACTIVE
    ) {
      const error = new Error(
        "Destination store is inactive."
      );
      error.statusCode = 400;
      throw error;
    }

    const updatedSource =
      await Stock.findOneAndUpdate(
        {
          _id: stockId,
          quantity: { $gte: quantity },
        },
        {
          $inc: {
            quantity: -quantity,
          },
        },
        {
          new: true,
          session,
        }
      );

    if (!updatedSource) {
      const error = new Error(
        "Insufficient stock available."
      );
      error.statusCode = 400;
      throw error;
    }

    const destinationStock =
      await Stock.findOne({
        store: toStoreId,
        product: sourceStock.product._id,
      }).session(session);

    if (destinationStock) {
      destinationStock.quantity += quantity;

      await destinationStock.save({
        session,
      });
    } else {
      await Stock.create(
        [
          {
            store: toStoreId,
            product:
              sourceStock.product._id,
            quantity,
          },
        ],
        { session }
      );
    }

    await session.commitTransaction();

    return updatedSource;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};


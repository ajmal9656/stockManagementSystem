import Store from "../models/Store.js";

export const addStore = async ({ name, description }) => {
  const existingStore = await Store.findOne({
    name: name.trim(),
  });

  if (existingStore) {
    const error = new Error("Store already exists.");
    error.statusCode = 409;
    throw error;
  }

  const store = await Store.create({
    name,
    description,
  });

  return store;
};

export const getStores = async (page, limit) => {
  const skip = (page - 1) * limit;

  const stores = await Store.find()
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const totalStores = await Store.countDocuments();

  return {
    stores,
    totalStores,
  };
};

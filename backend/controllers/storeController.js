import * as storeService from "../services/storeService.js";

export const addStore = async (req, res, next) => {
  try {
    const store = await storeService.addStore(req.body);

    return res.status(201).json({
      success: true,
      message: "Store added successfully.",
      data: store,
    });
  } catch (error) {
    next(error);
  }
};

export const getStores = async (req, res, next) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;

    const { stores, totalStores } = await storeService.getStores(
      page,
      limit,
    );

    res.status(200).json({
      success: true,
      data: stores,
      page,
      totalPages: Math.ceil(totalStores / limit),
    });
  } catch (error) {
    next(error);
  }
};




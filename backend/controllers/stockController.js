import * as stockService from "../services/stockService.js";

export const getStocksByStore = async (req, res, next) => {
  try {
    console.log("fetch stock by store controller");
    
    const result = await stockService.getStocksByStore(
      req.params.storeId,
      req.query
    );
    console.log("fetch stock by store controller resulkt",result);
    


    return res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
};


export const getAvailableProducts = async (
  req,
  res,
  next
) => {
  try {
    const products =
      await stockService.getAvailableProducts(
        req.params.storeId
      );

    return res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    next(error);
  }
};


export const assignProduct = async (
  req,
  res,
  next
) => {
  try {
    const stock = await stockService.assignProduct(
      req.body
    );

    return res.status(201).json({
      success: true,
      message: "Product assigned successfully.",
      data: stock,
    });
  } catch (error) {
    next(error);
  }
};

export const adjustStock = async (
  req,
  res,
  next
) => {
  try {
    const stock = await stockService.adjustStock(
      req.body
    );

    return res.status(200).json({
      success: true,
      message: "Stock updated successfully.",
      data: stock,
    });
  } catch (error) {
    next(error);
  }
};
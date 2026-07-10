import axios from "./axios";

export const getStocksByStore = async (
  storeId,
  page = 1,
  limit = 5,
  threshold = ""
) => {
  const response = await axios.get(
    `/stock/getStocks/${storeId}`,
    {
      params: {
        page,
        limit,
        threshold,
      },
    }
  );

  return response.data;
};

export const getAvailableProducts = async (
  storeId
) => {
  const response = await axios.get(
    `/stock/availableProducts/${storeId}`
  );

  return response.data;
};

export const assignProduct = async (data) => {
  const response = await axios.post(
    "/stock/assignProduct",
    data
  );

  return response.data;
};

export const adjustStock = async (data) => {
  const response = await axios.patch(
    "/stock/adjustStock",
    data
  );

  return response.data;
};

export const getAvailableStores = async (
  stockId
) => {
  console.log("enter");
  
  const response = await axios.get(
    `/stock/availableStores/${stockId}`
  );

  return response.data;
};

export const transferStock = async (data) => {
  const response = await axios.patch(
    "/stock/transferStock",
    data
  );

  return response.data;
};
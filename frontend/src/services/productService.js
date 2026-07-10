import axios from "./axios";

export const addProduct = async (data) => {
  const response = await axios.post(
    "/product/addProduct",
    data
  );

  return response.data;
};

export const getProducts = async (page) => {
  const response = await axios.get(
    `/product/getProducts?page=${page}&limit=5`
  );

  return response.data;
};
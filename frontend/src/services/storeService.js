import axios from "./axios";

export const addStore = async (data) => {
  const response = await axios.post(
    "/store/addStore",
    data
  );

  return response.data;
};

export const getStores = async (page) => {
  const response = await axios.get(
    `/store/getStores?page=${page}&limit=5`
  );

  return response.data;
};
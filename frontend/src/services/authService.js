import axios from "./axios";

export const register = async (data) => {
  const response = await axios.post(
    "/auth/register",
    data
  );

  return response.data;
};

export const login = async (data) => {
  console.log("login servic",data);
  
  const response = await axios.post(
    "/auth/login",
    data
  );

  return response.data;
};
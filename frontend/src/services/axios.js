import axios from "axios";
import { store, persistor } from "../redux/store";
import { logoutUser } from "../redux/slice/authSlice";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const isLoginRequest =
      error.config?.url?.includes("/login");
    if (
      error.response?.status === 401 &&
      !isLoginRequest
    ) {
      store.dispatch(logoutUser());
      await persistor.purge();

      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
import axios, {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from "axios";
import { customLocalStorage } from "../services/utils/localStorage";

interface ErrorResponseData {
  error: string;
}

const getToken = () => customLocalStorage.getData("token");

const createAxiosInstance = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
    headers: {
      "Content-Type": "application/json",
    },
  });

  instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const token = getToken();
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  instance.interceptors.response.use(
    (response) => {
      return response;
    },
    (error: AxiosError<ErrorResponseData>) => {
      if (error.response?.status === 401) {
        error.message = error.response?.data?.error;
        return Promise.reject(error);
      }
      if (error.response) {
        if (error.response?.data && error.response?.data.error) {
          error.message = error.response?.data?.error;
        }
      } else if (error.request) {
        console.error("Request error:", error.request);
      } else {
        console.error("Error:", error.message);
      }
      return Promise.reject(error);
    }
  );

  return instance;
};

const AXIOS = createAxiosInstance();

export default AXIOS;

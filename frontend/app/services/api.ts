import axios from "axios";
import Cookies from "js-cookie";

const apiEndpoint = import.meta.env.VITE_API_URL || "http://localhost:8080";

export const api = axios.create({
  baseURL: apiEndpoint,
});

api.interceptors.request.use((config) => {
  const token = Cookies.get("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (r) => r,
  (err) => {
    if (err.response?.status === 401) {
      Cookies.remove("token");
    }
    return Promise.reject(err);
  }
);

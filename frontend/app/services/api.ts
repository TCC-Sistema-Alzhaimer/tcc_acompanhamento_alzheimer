import axios from "axios";

const apiEndpoint = import.meta.env.VITE_API_URL;

export const api = axios.create({
  baseURL: apiEndpoint,
  withCredentials: true, 
});
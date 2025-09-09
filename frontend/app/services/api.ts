import axios from "axios";

const apiEndpoint = "https://backend-tcc-alzheimer-springboot.azurewebsites.net";

export const api = axios.create({
  baseURL: apiEndpoint,
  withCredentials: true, 
});
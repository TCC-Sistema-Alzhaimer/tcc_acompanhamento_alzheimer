import axios from "axios";

const apiEndpoint = "http://localhost:8080";

export const api = axios.create({
  baseURL: apiEndpoint,
  withCredentials: true, 
});
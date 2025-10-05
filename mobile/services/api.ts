import axios from "axios";

console.log(
  "[TESTE DE DIAGNÓSTICO] Valor da API_URL:",
  process.env.EXPO_PUBLIC_API_BASE_URL
);

const apiEndpoint = process.env.EXPO_PUBLIC_API_BASE_URL;

export const api = axios.create({
  baseURL: apiEndpoint,
  withCredentials: true,
});

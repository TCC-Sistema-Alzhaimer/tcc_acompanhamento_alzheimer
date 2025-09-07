import { api } from "./api";
import type { LoginRequest } from "~/types/api/auth/LoginRequest";
import type { LoginResponse } from "~/types/api/auth/LoginResponse";

export const loginRequest = (body: LoginRequest) => {
  const result = api.post<LoginResponse>("/api/auth/login", body);
  console.log("loginRequest result:", result); //remover depois
  return result;
};

export const refreshRequest = () => {
  return api.post<LoginResponse>("/api/auth/refresh", null, {
    withCredentials: true, // garante envio do cookie HttpOnly
  });
};

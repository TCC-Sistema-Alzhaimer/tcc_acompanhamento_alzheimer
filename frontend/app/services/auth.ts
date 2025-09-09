import { api } from "./api";
import type { LoginRequest } from "~/types/api/auth/LoginRequest";
import type { LoginResponse } from "~/types/api/auth/LoginResponse";

export const loginRequest = (body: LoginRequest) => {
  return api.post<LoginResponse>("/api/auth/login", body);
};

export const refreshRequest = () => {
  return api.post<LoginResponse>("/api/auth/refresh", null, {
    withCredentials: true,
  });
};

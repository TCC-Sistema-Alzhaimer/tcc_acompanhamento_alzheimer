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

export const verifyUserReset = (data: { email: string; cpf: string }) => {
  return api.post<number>("/auth/password/verify", data);
};

export const resetPassword = (data: {
  userId: number;
  newPassword: string;
}) => {
  return api.post("/auth/password/reset", data);
};

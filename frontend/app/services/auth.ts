import { api } from "./api";
import type { LoginRequest } from "~/types/api/auth/LoginRequest";
import type { LoginResponse } from "~/types/api/auth/LoginResponse";

export const loginRequest = (body: LoginRequest) => {
  return api.post<LoginResponse>("/auth/login", body);
};

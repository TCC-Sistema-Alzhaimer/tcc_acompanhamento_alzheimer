import { Roles } from "../enum/roles";

export interface LoginResponse {
  token: string;
  id: number;
  email: string;
  name?: string;
  role: Roles;
}

export interface LoginRequest {
  email: string;
  password: string;
}

import { jwtDecode } from "jwt-decode";

export interface JwtPayload {
  sub?: string;
  role: string;
  exp?: number;
  iat?: number;
}

export const parseJwt = (token: string): JwtPayload | null => {
  try {
    return jwtDecode<JwtPayload>(token);
  } catch (error) {
    console.error("Token inválido:", error);
    return null;
  }
};

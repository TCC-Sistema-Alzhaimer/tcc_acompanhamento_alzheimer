import { isAxiosError } from "axios";
import { api } from "./api";
import {
  ApiError,
  AuthenticationError,
  NetworkError,
  NotFoundError,
} from "./errors";
//TODO: Melhorar tratamento de erros e logica em geral
export const login = async (email: string, password: string) => {
  try {
    const response = await api.post("auth/login", {
      email,
      password,
    });
    console.log("Usuário autenticado:", response.data);
    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      if (error.response) {
        const status = error.response.status;
        const message =
          error.response.data?.message || "Ocorreu um erro no servidor.";

        // Lança erros específicos baseados no status HTTP
        if (status === 401 || status === 403) {
          throw new AuthenticationError(message);
        }
        if (status === 404) {
          throw new NotFoundError(message);
        }
        // Para outros erros 4xx ou 5xx
        throw new ApiError(message);
      } else if (error.request) {
        throw new NetworkError(
          "Não foi possível se conectar ao servidor. Verifique sua conexão."
        );
      }
    }
    throw new Error("Ocorreu um erro inesperado.");
  }
};

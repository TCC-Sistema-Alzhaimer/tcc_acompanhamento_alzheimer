import { isAxiosError } from "axios";
import { api } from "./api";
import {
  ApiError,
  AuthenticationError,
  NetworkError,
  NotFoundError,
} from "./errors";
import * as SecureStore from "expo-secure-store";

export const login = async (email: string, password: string) => {
  try {
    const response = await api.post("auth/login", {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      if (error.response) {
        const status = error.response.status;
        const message =
          error.response.data?.message || "Ocorreu um erro no servidor.";

        if (status === 401 || status === 403) {
          throw new AuthenticationError(message);
        }
        if (status === 404) {
          throw new NotFoundError(message);
        }
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

export const logout = async () => {
  try {
    await SecureStore.deleteItemAsync("userToken");
  } catch (error) {
    console.error("Erro ao remover o token:", error);
    throw new Error("Não foi possível remover a sessão do dispositivo.");
  }
};

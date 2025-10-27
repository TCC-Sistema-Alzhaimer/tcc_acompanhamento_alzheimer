import { LoginRequest } from "@/types/api/login";
import { isAxiosError } from "axios";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";
import { api } from "./api";
import {
  ApiError,
  AuthenticationError,
  NetworkError,
  NotFoundError,
} from "./errors";

export const login = async (credential: LoginRequest) => {
  try {
    const response = await api.post("api/auth/login", {
      email: credential.email,
      password: credential.password,
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
    if (Platform.OS === "web") {
      console.log("Removendo token do localStorage");
      localStorage.removeItem("userToken");
      localStorage.removeItem("user");
      localStorage.removeItem("selected_patient_id");
      return;
    }
    await SecureStore.deleteItemAsync("userToken");
    await SecureStore.deleteItemAsync("user");
    await SecureStore.deleteItemAsync("selected_patient_id");
  } catch (error) {
    console.error("Erro ao remover o token:", error);
    throw new Error("Não foi possível remover a sessão do dispositivo.");
  }
};

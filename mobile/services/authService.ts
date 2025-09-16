import { api } from "./api";
//TODO: Melhorar tratamento de erros e logica em geral
export const login = async (email: string, password: string) => {
  try {
    const response = await api.post("auth/login", {
      email,
      password,
    });
    console.log("Usuário autenticado:", response.data);
    return response.data;
  } catch (error: any) {
    console.error(
      "Falha na autenticação via API:",
      error.response?.data || error.message
    );

    const errorMessage =
      error.response?.data?.message || "E-mail ou senha inválidos.";
    throw new Error(errorMessage);
  }
};

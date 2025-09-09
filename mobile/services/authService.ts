// services/authService.ts

/**
 * Simula uma chamada de API para autenticar um usuário.
 * Em um aplicativo real, aqui você faria uma requisição HTTP para o seu backend.
 *
 * @param email O email do usuário.
 * @param password A senha do usuário.
 * @returns Uma Promise que resolve com um token de autenticação em caso de sucesso.
 * @throws Uma Promise que rejeita com uma mensagem de erro em caso de falha.
 */
export const login = (email: string, password: string) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Lógica de validação simulada
      if (email === "joao.silva123@mail.com" && password === "123456") {
        console.log("Usuário autenticado com sucesso!");
        resolve({
          token: "fake-jwt-token-for-joao-silva",
          user: {
            name: "João da Silva",
            email: "joao.silva123@mail.com",
          },
        });
      } else {
        console.error("Falha na autenticação: Credenciais inválidas.");
        reject(new Error("E-mail ou senha inválidos."));
      }
    }, 1500); // Simula 1.5 segundos de delay da rede
  });
};

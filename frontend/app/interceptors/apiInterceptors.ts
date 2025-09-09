import { api } from "~/services/api";
import Cookies from "js-cookie";
import type { AuthContextType } from "~/hooks/useAuth";

export function setupInterceptors(auth: AuthContextType) {
  api.interceptors.request.use((config) => {
    const token = Cookies.get("token") || localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  api.interceptors.response.use(
  (res) => res,
  async (err) => {
    if (err.response?.status === 401) {
      try {
        const refreshRes = await api.post("/auth/refresh");
        const newToken = refreshRes.data.token;

        Cookies.set("token", newToken);
        localStorage.setItem("token", newToken);

        err.config.headers.Authorization = `Bearer ${newToken}`;
        return api.request(err.config);
      } catch (e) {
        auth.logout();
      }
    }

    // NOVO: se receber 403, redireciona para login
    if (err.response?.status === 403) {
      auth.logout(); // opcional: limpa o estado do usuário
      window.location.href = "/login"; // ou ROUTES.LOGIN se tiver enum
    }

    return Promise.reject(err);
  }
);

}

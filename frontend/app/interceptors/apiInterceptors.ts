// apiInterceptors.ts
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
          // tenta renovar o token
          const refreshRes = await api.post("/auth/refresh");
          const newToken = refreshRes.data.token;

          // atualiza no cookie e localStorage
          Cookies.set("token", newToken);
          localStorage.setItem("token", newToken);

          // repete a requisição original com o novo token
          err.config.headers.Authorization = `Bearer ${newToken}`;
          return api.request(err.config);
        } catch (e) {
          auth.logout();
        }
      }
      return Promise.reject(err);
    }
  );
}

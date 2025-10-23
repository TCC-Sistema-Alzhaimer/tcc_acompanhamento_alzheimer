import { api } from "~/services/api";
import Cookies from "js-cookie";
import type { AuthContextType } from "~/hooks/useAuth";
import { refreshRequest } from "~/services/auth";
import { ROUTES } from "~/routes/EnumRoutes";


export function setupInterceptors(auth: AuthContextType) {

  api.interceptors.request.use((config) => {
    const token = auth.user?.token || Cookies.get("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  api.interceptors.response.use(
    
    (res) => res,
    (err) => {
      // Se receber 401, tenta refresh
      if (err.response?.status === 401) {
        return refreshRequest()
          .then((res) => {
            auth.setUser(res.data);
            err.config.headers.Authorization = `Bearer ${res.data.token}`;
            return api.request(err.config);
          })
          .catch(() => {
            auth.logout();
            return Promise.reject(err);
          });
      }

      //se receber 403, limpa usuário e redireciona para login
      if (err.response?.status === 403) {
        console.log("Acesso negado - 403");
        auth.logout();
        window.location.href = ROUTES.LOGIN;
      }

      return Promise.reject(err);
    }
  );
}


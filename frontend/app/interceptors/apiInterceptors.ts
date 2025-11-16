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
    async (err) => {
      const originalRequest = err.config;

      const refreshUrl = "/auth/refresh";

      if (
        err.response?.status === 401 &&
        !originalRequest._retry &&
        originalRequest.url !== refreshUrl
      ) {
        originalRequest._retry = true;

        try {
          const res = await refreshRequest();
          auth.setUser(res.data);
          originalRequest.headers.Authorization = `Bearer ${res.data.token}`;
          return api.request(originalRequest);
        } catch (refreshError) {
          auth.logout();
          return Promise.reject(refreshError);
        }
      }

      if (err.response?.status === 403) {
        console.log("Acesso negado - 403");
        auth.logout();
        window.location.href = ROUTES.LOGIN;
      }

      return Promise.reject(err);
    }
  );
}

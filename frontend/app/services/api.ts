import axios from "axios";

let baseURL = "https://backend-tcc-alzheimer-springboot.azurewebsites.net";

if (typeof window !== "undefined") {
  const isLocal =
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1";

  if (isLocal) {
    baseURL = "http://localhost:8080";
  }
}

export const api = axios.create({
  baseURL: baseURL,
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      console.log("Erro API:", error.response.status, error.response.data);

      const status = error.response.status;
      const data = error.response.data;

      if (status === 401 || status === 403) {
        handleLogout();
      }

      if (status === 404 && data?.message?.includes("nao encontrado")) {
        handleLogout();
      }
    }

    return Promise.reject(error);
  }
);

function handleLogout() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("user_data");
    localStorage.removeItem("token");

    if (window.location.pathname !== "/") {
      window.location.href = "/";
    }
  }
}

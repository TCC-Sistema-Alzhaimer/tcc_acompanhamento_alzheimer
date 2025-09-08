import Cookies from "js-cookie";
import { createContext, useContext, useState, type ReactNode, useEffect } from "react";
import { api } from "~/services/api";
import { useNavigate } from "react-router";
import { ROUTES } from "~/routes/EnumRoutes";
import { loginRequest, refreshRequest } from "~/services/auth";
import type { LoginResponse } from "~/types/api/auth/LoginResponse";

export interface AuthContextType {
  user: LoginResponse | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<LoginResponse | null>(null);
  const navigate = useNavigate();

  async function login(username: string, password: string) {
    const loginResult = await loginRequest({ email: username, password });
    if (loginResult.status === 200) {
      const foundUser: LoginResponse = loginResult.data;

      setUser(foundUser);
      return Promise.resolve();
    }
    return Promise.reject(new Error("Usuário ou senha inválidos"));
  }

  function logout() {
    //localStorage.removeItem("token"); -> removido para usar cookies HttpOnly
    Cookies.remove("token");
    setUser(null);
    navigate(ROUTES.LOGIN);
  }

  useEffect(() => {
    const loadUser = async () => {
      try {
        console.log("Tentando atualizar o usuário com refresh token...");
        const refreshResult = await refreshRequest();
        if (refreshResult.status === 200) {
          setUser(refreshResult.data);
        }
      } catch (error) {
        console.log("Não foi possível atualizar o usuário:", error);
        setUser(null);
      }
    };

    loadUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth deve ser usado dentro de AuthProvider");
  return ctx;
}

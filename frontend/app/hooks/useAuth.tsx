import Cookies from "js-cookie";
import { createContext, useContext, useState, type ReactNode, useEffect } from "react";
import { useNavigate } from "react-router";
import { loginRequest, refreshRequest } from "~/services/auth";
import type { LoginResponse } from "~/types/api/auth/LoginResponse";
import { ROUTES } from "~/routes/EnumRoutes";

export interface AuthContextType {
  user: LoginResponse | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  setUser: React.Dispatch<React.SetStateAction<LoginResponse | null>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<LoginResponse | null>(null);
  const navigate = useNavigate();

  async function login(username: string, password: string) {
    const loginResult = await loginRequest({ email: username, password });
    if (loginResult.status === 200 && loginResult.data) {
      const foundUser: LoginResponse = loginResult.data;
      setUser(foundUser);
      const redirectTo = sessionStorage.getItem("redirectAfterLogin") || ROUTES.PRIVATE_HOME;
      sessionStorage.removeItem("redirectAfterLogin");
      navigate(redirectTo);
      return Promise.resolve();
    }
    return Promise.reject(new Error("Usuário ou senha inválidos"));
  }

  function logout() {
    Cookies.remove("token");
    setUser(null);
    navigate("/");
  }

  useEffect(() => {
    const loadUser = async () => {
      try {
        const refreshResult = await refreshRequest();
        if (refreshResult.status === 200 && refreshResult.data) {
          setUser(refreshResult.data);
        } else {
          throw new Error("Refresh falhou");
        }
      } catch (error) {
        sessionStorage.setItem("redirectAfterLogin", window.location.pathname);
        window.location.href = ROUTES.LOGIN;
      }
    };

    loadUser();
  }, [setUser]);

  return (
    <AuthContext.Provider value={{ user, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth deve ser usado dentro de AuthProvider");
  return ctx;
}
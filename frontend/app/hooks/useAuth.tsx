// src/hooks/useAuth.tsx
import Cookies from "js-cookie";
import { createContext, useContext, useState, type ReactNode } from "react";
import { useNavigate } from "react-router";
import { doctors, patients, users } from "~/mocks/mock";
import { ROUTES } from "~/routes/EnumRoutes";
import { loginRequest } from "~/services/auth";
import type { LoginResponse } from "~/types/api/auth/LoginResponse";
import type { Patient } from "~/types/Users";

interface AuthContextType {
  user: { user: LoginResponse } | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<{ user: LoginResponse } | null>(null);
  const navigate = useNavigate();

  async function login(username: string, password: string) {
    const loginResult = await loginRequest({ email: username, password });
    if (loginResult.status === 200) {
      const foundUser: LoginResponse = loginResult.data;
      if (foundUser?.token) {
        Cookies.set("token", foundUser.token);
        localStorage.setItem("token", foundUser.token);
      }
      setUser({ user: foundUser });
      navigate(ROUTES.DOCTOR.EXAMINATION);
      return Promise.resolve();
    }
    return Promise.reject(new Error("Usuário ou senha inválidos"));
  }

  function logout() {
    localStorage.removeItem("token");
    Cookies.remove("token");
    setUser(null);
    navigate(ROUTES.LOGIN);
  }

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

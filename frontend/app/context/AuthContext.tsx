// hooks/useAuth.tsx
import { createContext, useContext, useState } from "react";
import { api } from "~/services/api";
import type { LoginResponse } from "~/types/api/auth/LoginResponse";

type AuthContextType = {
  token: string | null;
  setToken: (token: string | null) => void;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType>({
  token: null,
  setToken: () => {},
  login: async () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);

  async function login(email: string, password: string) {
    const res = await api.post<LoginResponse>("/api/auth/login", { email, password });
    setToken(res.data.token);
  }

  function logout() {
    setToken(null);
  }

  return (
    <AuthContext.Provider value={{ token, setToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

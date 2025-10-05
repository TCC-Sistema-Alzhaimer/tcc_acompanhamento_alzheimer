import { login, logout as performLogout } from "@/services/auth-service"; // Ajuste o caminho se necessário
import { LoginRequest, LoginResponse } from "@/types/api/login";
import { User } from "@/types/domain/user";
import { useRouter } from "expo-router";
import React, { createContext, useContext, useState } from "react";

export interface Session {
  user: User;
  accessToken: string;
}

interface AuthContextType {
  logout: () => void;
  useLogin: (credential: LoginRequest) => Promise<LoginResponse>;
  useSession: () => Session | null;
  user: User | null;
  loading?: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  const logout = async () => {
    try {
      await performLogout();
      router.replace("/login");
    } catch (error) {
      console.error("Erro no logout, mas redirecionando mesmo assim:", error);
      router.replace("/login");
    }
  };

  const useLogin = async (credential: LoginRequest): Promise<LoginResponse> => {
    setLoading(true);
    const response = await login(credential);
    if (response) {
      setUser({
        id: response.id,
        email: response.email,
        role: response.role,
      });
    }
    setLoading(false);
    return response;
  };

  const useSession: () => Session | null = () => {
    return user ? { user, accessToken: "" } : null;
  };

  return (
    <AuthContext.Provider value={{ logout, useLogin, useSession, user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
}

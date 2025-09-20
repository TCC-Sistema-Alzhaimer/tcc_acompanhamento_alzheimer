import { logout as performLogout } from "@/services/authService"; // Ajuste o caminho se necessário
import { useRouter } from "expo-router";
import React, { createContext, useContext } from "react";

interface AuthContextType {
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const logout = async () => {
    try {
      await performLogout();
      router.replace("/login");
    } catch (error) {
      console.error(error);
      router.replace("/login");
    }
  };

  return (
    <AuthContext.Provider value={{ logout }}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
}

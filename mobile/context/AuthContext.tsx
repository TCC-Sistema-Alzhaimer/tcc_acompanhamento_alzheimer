import { login, logout as performLogout } from "@/services/auth-service";
import { LoginRequest, LoginResponse } from "@/types/api/login";
import { User } from "@/types/domain/user";
import { isValidToken } from "@/util/valide-token";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { createContext, useContext, useEffect, useState } from "react";
import { Platform } from "react-native";

export interface Session {
  user: User;
  accessToken: string;
}

interface AuthContextType {
  logout: () => void;
  useLogin: (credential: LoginRequest) => Promise<LoginResponse>;
  useSession: () => Session | null;
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState("");
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    const fetchToken = async () => {
      setLoading(true);
      if (Platform.OS === "web") {
        setAccessToken(localStorage.getItem("userToken") || "");
      } else {
        const token = await SecureStore.getItemAsync("userToken");
        setAccessToken(token || "");
      }
    };

    const fetchUser = async () => {
      if (Platform.OS === "web") {
        const userData = localStorage.getItem("user");
        if (userData) {
          setUser(JSON.parse(userData));
        }
      } else {
        const userData = await SecureStore.getItemAsync("user");
        if (userData) {
          setUser(JSON.parse(userData));
        }
      }
      setLoading(false);
    };

    fetchToken();
    fetchUser();
  }, []);

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
        name: response.name,
        email: response.email,
        role: response.role,
      });
      if (response.token) {
        if (Platform.OS === "web") {
          localStorage.setItem("userToken", response.token);
          localStorage.setItem("user", JSON.stringify(response));
        } else {
          await SecureStore.setItemAsync("userToken", response.token);
          await SecureStore.setItemAsync("user", JSON.stringify(response));
        }
      } else {
        throw new Error("Resposta de autenticação inválida");
      }
    }
    setLoading(false);
    return response;
  };

  const useSession = () => {
    return isValidToken(accessToken) && user ? { user, accessToken } : null;
  };

  return (
    <AuthContext.Provider
      value={{ logout, useLogin, useSession, user, loading }}
    >
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

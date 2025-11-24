import { login, logout as performLogout } from "@/services/auth-service";
import { LoginRequest, LoginResponse } from "@/types/api/login";
import { User } from "@/types/domain/user";
import { isValidToken } from "@/util/valide-token";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Platform } from "react-native";

export interface Session {
  user: User;
  accessToken: string;
}

interface AuthContextType {
  logout: () => Promise<void>;
  useLogin: (credential: LoginRequest) => Promise<LoginResponse>;
  getSession: Session | null;
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
    const bootstrapAuth = async () => {
      setLoading(true);
      try {
        if (Platform.OS === "web") {
          const storedToken = localStorage.getItem("userToken") || "";
          const storedUser = localStorage.getItem("user");
          setAccessToken(storedToken);
          if (storedUser) {
            setUser(JSON.parse(storedUser));
          }
        } else {
          const storedToken = await SecureStore.getItemAsync("userToken");
          const storedUser = await SecureStore.getItemAsync("user");
          setAccessToken(storedToken || "");
          if (storedUser) {
            setUser(JSON.parse(storedUser));
          }
        }
      } finally {
        setLoading(false);
      }
    };

    void bootstrapAuth();
  }, []);

  const logout = async () => {
    try {
      await performLogout();
    } catch (error) {
      console.error("Falha ao executar logout remoto:", error);
    } finally {
      setUser(null);
      setAccessToken("");
      if (Platform.OS === "web") {
        localStorage.removeItem("userToken");
        localStorage.removeItem("user");
      } else {
        await SecureStore.deleteItemAsync("userToken");
        await SecureStore.deleteItemAsync("user");
      }
      router.replace("/login");
    }
  };

  const useLogin = async (credential: LoginRequest): Promise<LoginResponse> => {
    setLoading(true);
    try {
      const response = await login(credential);
      if (response) {
        const token = response.token;
        const nextUser: User = {
          id: response.id,
          email: response.email,
          role: response.role,
          name: response.name,
        };
        setUser(nextUser);
        if (token) {
          setAccessToken(token);
          if (Platform.OS === "web") {
            localStorage.setItem("userToken", token);
            localStorage.setItem("user", JSON.stringify(nextUser));
          } else {
            await SecureStore.setItemAsync("userToken", token);
            await SecureStore.setItemAsync("user", JSON.stringify(nextUser));
          }
        } else {
          throw new Error("Resposta de autenticacao invalida");
        }
      }
      return response;
    } finally {
      setLoading(false);
    }
  };

  const getSession = useMemo(() => {
    return isValidToken(accessToken) && user ? { user, accessToken } : null;
  }, [accessToken, user]);

  return (
    <AuthContext.Provider
      value={{ logout, useLogin, getSession, user, loading }}
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

import Cookies from "js-cookie";
import {
  createContext,
  useContext,
  useState,
  type ReactNode,
  useEffect,
} from "react";
import { useNavigate } from "react-router";
import { loginRequest, refreshRequest } from "~/services/auth";
import type { LoginResponse } from "~/types/api/auth/LoginResponse";
import { ROUTES } from "~/routes/EnumRoutes";

export interface AuthContextType {
  user: LoginResponse | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  setUser: React.Dispatch<React.SetStateAction<LoginResponse | null>>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<LoginResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  async function login(username: string, password: string) {
    const loginResult = await loginRequest({ email: username, password });
    if (loginResult.status === 200 && loginResult.data) {
      const foundUser: LoginResponse = loginResult.data;

      Cookies.set("token", foundUser.token, { expires: 1, secure: true });

      setUser(foundUser);

      const redirectTo =
        sessionStorage.getItem("redirectAfterLogin") || ROUTES.PRIVATE_HOME;
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
      setIsLoading(true);
      try {
        const refreshResult = await refreshRequest();
        if (refreshResult.status === 200 && refreshResult.data) {
          setUser(refreshResult.data);
          Cookies.set("token", refreshResult.data.token, {
            expires: 1,
            secure: true,
          });
        } else {
          setUser(null);
          Cookies.remove("token");
        }
      } catch (error) {
        setUser(null);
        Cookies.remove("token");
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center text-gray-700">
        <div
          className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"
          role="status"
        >
          <span className="sr-only">Carregando...</span>
        </div>
        <h2 className="text-xl font-semibold mt-4">Carregando...</h2>
        <p className="text-gray-500">Preparando sua experiência</p>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, setUser, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth deve ser usado dentro de AuthProvider");
  return ctx;
}

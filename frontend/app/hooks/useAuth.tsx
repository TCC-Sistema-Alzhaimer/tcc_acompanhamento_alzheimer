// src/hooks/useAuth.tsx
import { createContext, useContext, useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router';
import { doctors, patients, users } from '~/mocks/mock';
import { ROUTES } from '~/routes/EnumRoutes';
import type { Patient } from '~/types/Users';

interface AuthContextType {
  user: { name: string } | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {

  const [user, setUser] = useState<{ name: string } | null>(null);
  const navigate = useNavigate();

  async function login(username: string, password: string) {
    const foundUser = users.find((u) => u.email === username && u.password === password);
    if (foundUser) {
      if (patients.some((p: Patient) => p.email === username)) {
        localStorage.setItem("token", "patient-token");
      } else if (doctors.some((d) => d.email === username)) {
        localStorage.setItem("token", "doctor-token");
      }
      setUser(foundUser);
      return Promise.resolve();
    }
    return Promise.reject(new Error('Usuário ou senha inválidos'));
  }

  function logout() {
    localStorage.removeItem("token");
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
  if (!ctx) throw new Error('useAuth deve ser usado dentro de AuthProvider');
  return ctx;
}

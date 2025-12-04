import { Session, useAuth } from "@/context/AuthContext";

export function useSession(): Session | null {
  const context = useAuth();
  if (!context) {
    throw new Error("useSession must be used within an AuthProvider");
  }
  return context.getSession;
}

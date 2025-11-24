import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import type { FC, ReactNode } from "react";
import { Navigate, useLocation } from "react-router";
import { ROUTES } from "~/routes/EnumRoutes";
import { SystemRoles } from "~/types/SystemRoles";

interface AuthGuardProps {
  children: ReactNode;
  allowRoles?: SystemRoles[];
}

export const AuthGuard: FC<AuthGuardProps> = ({ children, allowRoles }) => {
  const location = useLocation();
  const token = Cookies.get("token");

  if (!token) {
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  const tokenDecoded = jwtDecode<{ role: string }>(token);

  if (!tokenDecoded.role) {
    Cookies.remove("token");
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  const userRole = tokenDecoded.role as SystemRoles;

  if (allowRoles && !allowRoles.includes(userRole)) {
    return (
      <Navigate to={ROUTES.PRIVATE_HOME} state={{ from: location }} replace />
    );
  }

  return <>{children}</>;
};

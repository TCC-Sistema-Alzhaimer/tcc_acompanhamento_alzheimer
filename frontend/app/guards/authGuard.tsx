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
  const tokenDecoded = token ? jwtDecode<{ role: string }>(token) : null;
  if (!tokenDecoded) {
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  const tokenRole = tokenDecoded?.role;

  if (
    !tokenRole ||
    (allowRoles && !allowRoles.includes(tokenRole as SystemRoles))
  ) {
    if (tokenRole === SystemRoles.DOCTOR || tokenRole === SystemRoles.ADMIN) {
      return (
        <Navigate
          to={ROUTES.DOCTOR.EXAMINATION}
          state={{ from: location }}
          replace
        />
      );
    } else if (
      tokenRole === SystemRoles.ADMIN ||
      tokenRole === SystemRoles.PATIENT
    ) {
      return <Navigate to={ROUTES.HOME} state={{ from: location }} replace />;
    }
  }

  return <>{children}</>;
};

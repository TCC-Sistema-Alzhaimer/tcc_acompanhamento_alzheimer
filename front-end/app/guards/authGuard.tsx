
import type { FC, ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router';
import { ROUTES } from '~/routes/EnumRoutes';


type Role = 'patient' | 'doctor';

interface AuthGuardProps {
  children: ReactNode;
  allowRoles?: Role[];
}

export const AuthGuard: FC<AuthGuardProps> = ({ children, allowRoles }) => {
  return <>{children}</>;

  const location = useLocation();
  const token = localStorage.getItem('token');

  const tokenRole = token === 'patient-token'
    ? 'patient'
    : token === 'doctor-token'
      ? 'doctor'
      : null;

  if(!token) {
    return (
      <Navigate
        to={ROUTES.LOGIN}
        state={{ from: location }}
        replace
      />
    );
  }

  if (!tokenRole || (allowRoles && !allowRoles.includes(tokenRole as Role))) {
    if(tokenRole === 'doctor') {
      return (
        <Navigate
          to={ROUTES.DOCTOR.EXAMINATION}
          state={{ from: location }}
          replace
        />
      );
    }
    else if(tokenRole === 'patient') {
      return (
        <Navigate
          to={ROUTES.HOME}
          state={{ from: location }}
          replace
        />
      );
    }
  }

  return <>{children}</>;
};
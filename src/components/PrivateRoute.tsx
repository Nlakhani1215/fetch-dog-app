import React, { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

const isAuthenticated = (): boolean => {
  // Since fetch.com uses HttpOnly cookies, we can't read them — use a flag
  return !!localStorage.getItem('isLoggedIn');
};

interface PrivateRouteProps {
  children: ReactNode;
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  return isAuthenticated() ? <>{children}</> : <Navigate to="/login" />;
};

export default PrivateRoute;

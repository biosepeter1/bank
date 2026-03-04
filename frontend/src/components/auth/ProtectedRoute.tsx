import React, { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useUserStore } from '@/stores';
import { Spinner } from '@/components/common';

export interface ProtectedRouteProps {
  children: ReactNode;
  redirectTo?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  redirectTo = '/login',
}) => {
  const { user, isLoading } = useUserStore();
  const token = localStorage.getItem('authToken');

  // Still loading
  if (isLoading) {
    return <Spinner fullScreen size="lg" />;
  }

  // Not authenticated
  if (!user || !token) {
    return <Navigate to={redirectTo} replace />;
  }

  // Authenticated
  return <>{children}</>;
};

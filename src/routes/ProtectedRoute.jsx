import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useRole } from '../hooks/useRole';

export const ProtectedRoute = ({ allowedRoles, children }) => {
  const { isAuthenticated } = useAuth();
  const { role } = useRole();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    // Redirect to /dashboard if role not allowed.
    // DashboardPage will handle routing users to their authorized landing page.
    return <Navigate to="/dashboard" replace />;
  }

  return children ? children : <Outlet />;
};

export default ProtectedRoute;

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';

/** Landing page per role */
const ROLE_HOME = {
  student: '/student/setup',
  teacher: '/teacher/dashboard',
  parent:  '/parent/overview',
};

/**
 * ProtectedRoute
 *
 * - Requires a valid JWT token (redirects to /login if missing).
 * - If `allowedRoles` is provided, checks the user's role and redirects
 *   unauthorised users to their own landing page.
 */
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { token, user, hydrateDone } = useAuthStore();
  const location = useLocation();

  // Avoid flicker while auth store hydrates from localStorage
  if (!hydrateDone) return null;

  // Not logged in → send to login
  if (!token) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  // Role gate: if allowedRoles specified, enforce them
  if (allowedRoles && allowedRoles.length > 0) {
    const userRole = user?.role;
    if (!userRole || !allowedRoles.includes(userRole)) {
      // Redirect to user's own landing page instead of showing forbidden content
      const home = ROLE_HOME[userRole] || '/login';
      return <Navigate to={home} replace />;
    }
  }

  return children;
};

export default ProtectedRoute;

export { ROLE_HOME };

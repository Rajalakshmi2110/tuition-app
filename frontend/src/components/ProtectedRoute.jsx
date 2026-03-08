import React from 'react';
import { Navigate } from 'react-router-dom';

const isTokenExpired = (token) => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
};

const ProtectedRoute = ({ allowedRoles, children }) => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  if (!token || isTokenExpired(token)) {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('userId');
    return <Navigate to="/login?error=session_expired" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    const dashboardMap = { admin: '/admin', tutor: '/tutor', student: '/student' };
    return <Navigate to={dashboardMap[role] || '/login'} replace />;
  }

  return children;
};

export default ProtectedRoute;

import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ allowedRoles, children }) => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    // Redirect to their own dashboard instead of showing forbidden
    const dashboardMap = { admin: '/admin', tutor: '/tutor', student: '/student' };
    return <Navigate to={dashboardMap[role] || '/login'} replace />;
  }

  return children;
};

export default ProtectedRoute;

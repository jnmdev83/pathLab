import React from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated } from '../../services/auth';

const ProtectedRoute = ({ children }) => {
  const isLoggedIn = isAuthenticated();

  if (!isLoggedIn) {
    // If not logged in, redirect to login page
    return <Navigate to="/login" replace />;
  }

  // If logged in, show the child components
  return children;
};

export default ProtectedRoute;

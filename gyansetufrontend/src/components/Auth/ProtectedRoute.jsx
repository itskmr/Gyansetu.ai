// src/components/Auth/ProtectedRoute.jsx
import React, { useState, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import authService from "../../services/api/authService";
import LoadingOverlay from "./LoadingOverlay";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 500)); // Add a small delay for loading state
        setIsLoading(false);
      } catch (error) {
        console.error("Auth check error:", error);
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (isLoading) {
    return <LoadingOverlay />;
  }

  const user = authService.getCurrentUser();
  const isAuthenticated = authService.isAuthenticated();

  if (!isAuthenticated || !user) {
    // Redirect to login and save the location they were trying to access
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if user has the required role
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // If user is logged in but doesn't have the right role,
    // redirect them to their appropriate dashboard
    const dashboardPath = `/${user.role}`;
    return <Navigate to={dashboardPath} replace />;
  }

  return children;
};

export default ProtectedRoute;

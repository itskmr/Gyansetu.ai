// src/pages/LoginPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import AuthLayout from "../components/Auth/AuthLayout";
import LoginForm from "../components/Auth/LoginForm";
import authService from "../services/api/authService";

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    // Check if the user is already authenticated
    if (authService.isAuthenticated()) {
      const user = authService.getCurrentUser();
      if (user && user.role) {
        navigate(`/${user.role}`);
      }
    }

    const timer = setTimeout(() => {
      setAnimate(true);
    }, 500);

    return () => clearTimeout(timer);
  }, [navigate]);

  const switchToSignup = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate("/signup");
    }, 1200);
  };

  // This function will be passed to the LoginForm to handle successful login
  const handleSuccessfulLogin = (user) => {
    // Navigate to the appropriate dashboard based on user role
    if (user && user.role) {
      navigate(`/${user.role}`);
    } else {
      // Default fallback
      navigate("/");
    }
  };

  return (
    <AuthLayout animate={animate} loading={loading}>
      <LoginForm
        switchToSignup={switchToSignup}
        onSuccessfulLogin={handleSuccessfulLogin}
      />
    </AuthLayout>
  );
};

export default LoginPage;
// src/pages/ResetPasswordPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../components/Auth/AuthLayout";
import ResetPassword from "../components/Auth/ResetPassword";

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimate(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const switchToLogin = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate("/login");
    }, 1200);
  };

  return (
    <AuthLayout animate={animate} loading={loading}>
      <ResetPassword switchToLogin={switchToLogin} />
    </AuthLayout>
  );
};

export default ResetPasswordPage;
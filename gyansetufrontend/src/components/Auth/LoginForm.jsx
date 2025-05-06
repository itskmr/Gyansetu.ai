// src/components/Auth/LoginForm.jsx
import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { FaGoogle, FaApple, FaEye, FaEyeSlash } from "react-icons/fa";
import { auth } from "../../firebaseConfig";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoginOverlay from "./LoginOverlay";
import SimpleLoader from "./SimpleLoader";
import authService from "../../services/api/authService";
import RoleSelection from "./RoleSelection";

const LoginForm = ({ switchToSignup, onSuccessfulLogin }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "",
  });
  const [loading, setLoading] = useState(false);
  const [quickLoading, setQuickLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [authError, setAuthError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [roleError, setRoleError] = useState(null);
  const [suggestedRole, setSuggestedRole] = useState(null);

  // Violet theme colors
  const themeColors = {
    bgColor: "#F8F5FF",
    cardBg: "#F0E6FF",
    primaryColor: "#8A2BE2",
    borderColor: "#D1C2F0",
    buttonBg: "#9370DB",
    buttonHover: "#7B68EE",
    textPrimary: "#4B0082",
    textSecondary: "#663399",
    errorColor: "#FF3333", // Bright red for errors
    successColor: "#4CAF50", // Green for success
  };

  const togglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleChange = useCallback(
    (e) => {
      setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
      // Clear errors when user starts typing again
      if (authError) setAuthError(null);
      if (roleError) setRoleError(null);
    },
    [authError, roleError]
  );

  // Handle role selection
  const handleRoleSelect = useCallback(
    (role) => {
      setFormData((prev) => ({ ...prev, role }));
      // Clear errors when user changes role
      if (authError) setAuthError(null);
      if (roleError) setRoleError(null);
      setSuggestedRole(null); // Clear suggested role
    },
    [authError, roleError]
  );

  const simulateProgress = () => {
    let percent = 0;
    const interval = setInterval(() => {
      percent += 10;
      setProgress(percent);
      if (percent >= 90) clearInterval(interval);
    }, 300);
    return interval;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.role) {
      toast.error("Please select a role");
      setRoleError("Role selection is required");
      return;
    }

    if (!formData.email.trim()) {
      setAuthError("Email is required");
      return;
    }

    if (!formData.password.trim()) {
      setAuthError("Password is required");
      return;
    }

    setLoading(true);
    setAuthError(null);
    setRoleError(null);
    setSuggestedRole(null);
    setProgress(0);

    const interval = simulateProgress();

    try {
      const response = await authService.login(formData);
      clearInterval(interval);
      setProgress(100);
      toast.success("Login successful! 🎉");

      // Get the user data from the response
      const user = response.user;

      // Navigate to the appropriate dashboard based on user role
      setTimeout(() => {
        navigate(`/${user.role}`);
      }, 500);
    } catch (error) {
      console.error("Login error:", error);
      clearInterval(interval);
      setLoading(false);
      setProgress(100);

      if (error.response?.status === 403 && error.response?.data?.actualRole) {
        const actualRole = error.response.data.actualRole;
        setRoleError(`This account is registered as a ${actualRole}. Please select the correct role.`);
        setSuggestedRole(actualRole);
        toast.error(`This account is registered as a ${actualRole}. Please select the correct role.`, {
          position: "top-center",
          autoClose: 5000
        });
      } else {
        toast.error(error.message || "Invalid email or password");
        setAuthError("Invalid email or password");
      }
    } finally {
      clearInterval(interval);
      setLoading(false);
      setProgress(100);
    }
  };

  const handleGoogleLogin = async () => {
    if (!formData.role) {
      toast.error("Please select a role before signing in with Google");
      setRoleError("Role selection is required");
      return;
    }

    setAuthError(null);
    setRoleError(null);
    setSuggestedRole(null);
    setLoading(true);
    setProgress(0);
    
    const interval = simulateProgress();
    
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();

      const userData = {
        email: result.user.email,
        role: formData.role,
        googleToken: idToken,
        firstName: result.user.displayName?.split(' ')[0] || '',
        lastName: result.user.displayName?.split(' ').slice(1).join(' ') || '',
        phone: result.user.phoneNumber || ''
      };

      const response = await authService.googleLogin(userData);
      clearInterval(interval);
      setProgress(100);
      toast.success("Login successful! 🎉");

      if (onSuccessfulLogin && response.user) {
        setTimeout(() => {
          navigate(`/${response.user.role}`);
        }, 500);
      } else {
        setTimeout(() => {
          navigate("/");
        }, 500);
      }
    } catch (error) {
      console.error("Google login error:", error);
      clearInterval(interval);

      if (error.response?.status === 403 && error.response?.data?.actualRole) {
        const actualRole = error.response.data.actualRole;
        setRoleError(`This account is registered as a ${actualRole}. Please select the correct role.`);
        setSuggestedRole(actualRole);
        toast.error(`This account is registered as a ${actualRole}. Please select the correct role.`, {
          position: "top-center",
          autoClose: 5000
        });
      } else {
        toast.error(error.message || "Login failed");
        setAuthError("Authentication failed");
      }
    } finally {
      clearInterval(interval);
      setLoading(false);
    }
  };

  const handleAppleLogin = async () => {
    if (!formData.role) {
      toast.error("Please select a role before signing in with Apple");
      setRoleError("Role selection is required");
      return;
    }

    setAuthError(null);
    setRoleError(null);
    setSuggestedRole(null);
    
    // Apple Sign In is currently a placeholder
    // In a real implementation, you would use the Apple Sign In SDK
    toast.info("Apple Sign In is coming soon!");
  };

  // Function to navigate to reset password page
  const navigateToResetPassword = () => {
    // Adding a small loading animation for consistent UX
    setQuickLoading(true);
    setTimeout(() => {
      setQuickLoading(false);
      navigate("/reset-password");
    }, 1200);
  };

  return (
    <div className="flex flex-col items-center text-center h-full overflow-y-auto px-6">
      <ToastContainer position="top-right" autoClose={7000} />
      {loading && <LoginOverlay progress={progress} />}
      {quickLoading && <SimpleLoader />}

      {/* Top Badge */}
      <h1
        className="font-primary text-4xl font-thin mt-4"
        style={{ color: themeColors.primaryColor }}
      >
        Sign In
      </h1>
      <p
        className="font-primary text-base mb-4"
        style={{ color: themeColors.textPrimary }}
      >
        Hey, let's sign in to your account
      </p>

      {/* Social Buttons */}
      <div className="flex space-x-4 my-2">
        <button
          className="px-3 py-2 rounded-[15px] border transition-colors cursor-pointer flex items-center justify-center"
          style={{
            backgroundColor: themeColors.cardBg,
            borderColor: themeColors.borderColor,
            color: themeColors.textSecondary,
          }}
          onClick={handleGoogleLogin}
        >
          <FaGoogle size={18} />
        </button>
        <button
          className="px-3 py-0 rounded-[15px] border transition-colors cursor-pointer flex items-center justify-center"
          style={{
            backgroundColor: themeColors.cardBg,
            borderColor: themeColors.borderColor,
            color: themeColors.textSecondary,
          }}
          onClick={handleAppleLogin}
        >
          <FaApple size={18} />
        </button>
      </div>

      {/* OR Separator */}
      <div className="flex items-center justify-center my-3 w-full">
        <div
          className="h-px flex-grow"
          style={{ backgroundColor: themeColors.borderColor }}
        ></div>
        <span className="px-2" style={{ color: themeColors.textSecondary }}>
          or
        </span>
        <div
          className="h-px flex-grow"
          style={{ backgroundColor: themeColors.borderColor }}
        ></div>
      </div>

      <form className="w-full space-y-3" onSubmit={handleSubmit}>
        <div className="w-full">
          <input
            type="email"
            name="email"
            placeholder="Email address"
            className="w-full h-12 border rounded-full px-4 focus:outline-none"
            style={{
              backgroundColor: themeColors.cardBg,
              borderColor:
                authError && authError.includes("Email")
                  ? themeColors.errorColor
                  : themeColors.borderColor,
              color: themeColors.textPrimary,
            }}
            onChange={handleChange}
            value={formData.email}
          />
        </div>

        {/* Integrated Password Input with error space reservation */}
        <div className="w-full">
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              name="password"
              className="w-full h-12 border rounded-full px-4 pr-12 focus:outline-none"
              style={{
                backgroundColor: themeColors.cardBg,
                borderColor: authError
                  ? themeColors.errorColor
                  : themeColors.borderColor,
                color: themeColors.textPrimary,
              }}
              onChange={handleChange}
              value={formData.password}
            />
            <button
              type="button"
              onClick={togglePassword}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer"
              style={{ color: themeColors.textSecondary }}
            >
              {showPassword ? <FaEye size={20} /> : <FaEyeSlash size={20} />}
            </button>
          </div>
          {/* Error message container with red styling */}
          <div style={{ height: "20px", marginTop: "4px" }}>
            {authError && (
              <p
                className="text-sm font-semibold"
                style={{
                  color: themeColors.errorColor,
                }}
              >
                {authError}
              </p>
            )}
          </div>
        </div>

        {/* Role Selection Component */}
        <RoleSelection
          selectedRole={formData.role}
          onRoleSelect={handleRoleSelect}
          errorMessage={roleError}
          suggestedRole={suggestedRole}
          themeColors={themeColors}
        />

        <div className="text-right">
          <button
            type="button"
            onClick={navigateToResetPassword}
            className="text-sm hover:underline"
            style={{ color: themeColors.textSecondary }}
          >
            Forgot password?
          </button>
        </div>

        <button
          type="submit"
          className="w-full h-12 text-white cursor-pointer transition-colors rounded-full border"
          style={{
            backgroundColor: themeColors.buttonBg,
            borderColor: themeColors.borderColor,
          }}
        >
          Sign In →
        </button>
      </form>

      {/* Footer: Link to Signup */}
      <div className="mt-4 mb-2 text-xs flex items-center justify-center">
        <span className="mr-2" style={{ color: themeColors.textSecondary }}>
          Don't have an account?
        </span>
        <button
          onClick={switchToSignup}
          className="text-white px-2 py-1 rounded-md text-xs border"
          style={{
            backgroundColor: themeColors.primaryColor,
            borderColor: themeColors.borderColor,
          }}
        >
          Sign up
        </button>
      </div>
    </div>
  );
};

export default LoginForm;
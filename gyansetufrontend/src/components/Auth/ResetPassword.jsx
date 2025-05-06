// src/components/Auth/ResetPassword.jsx
import React, { useState, useCallback } from "react";
import { FaArrowLeft, FaEnvelope, FaCheck, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoginOverlay from "./LoginOverlay";
import SimpleLoader from "./SimpleLoader";
import OTPInput from "./OTPInput";
import authService from "../../services/api/authService";

const ResetPassword = ({ switchToLogin }) => {
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [quickLoading, setQuickLoading] = useState(false); // For verify/OTP operations
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Violet theme colors (same as LoginForm for consistency)
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
    successColor: "#00C853", // Green for success
  };

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    
    if (name === "email") {
      setEmail(value);
    } else if (name === "newPassword") {
      setNewPassword(value);
    } else if (name === "confirmPassword") {
      setConfirmPassword(value);
    }
    
    // Clear errors when user starts typing again
    if (error) setError(null);
  }, [error]);

  // Toggle password visibility
  const togglePasswordVisibility = (field) => {
    if (field === 'newPassword') {
      setShowNewPassword(!showNewPassword);
    } else if (field === 'confirmPassword') {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

  const simulateProgress = () => {
    let percent = 0;
    const interval = setInterval(() => {
      percent += 10;
      setProgress(percent);
      if (percent >= 90) clearInterval(interval);
    }, 300);
    return interval;
  };

  // Step 1: Request password reset
  const handleEmailSubmit = async (e) => {
    e.preventDefault();

    // Check for empty email
    if (!email.trim()) {
      setError("Email is required");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setLoading(true);
    setError(null);
    setProgress(0);

    const interval = simulateProgress();

    try {
      // Request password reset OTP
      await authService.requestPasswordReset(email);
      clearInterval(interval);
      setProgress(100);
      toast.success("Password reset code sent to your email!");
      
      // Move to OTP verification step
      setStep(2);
      
      // Start resend timer (60 seconds)
      setResendDisabled(true);
      let timer = 60;
      setResendTimer(timer);
      
      const countdown = setInterval(() => {
        timer -= 1;
        setResendTimer(timer);
        
        if (timer <= 0) {
          clearInterval(countdown);
          setResendDisabled(false);
        }
      }, 1000);
    } catch (error) {
      toast.info("If your email is registered, you will receive a password reset code");
      clearInterval(interval);
      
      // Still move to OTP verification step (for security, we don't reveal if email exists)
      setStep(2);
      
      // Start resend timer
      setResendDisabled(true);
      let timer = 60;
      setResendTimer(timer);
      
      const countdown = setInterval(() => {
        timer -= 1;
        setResendTimer(timer);
        
        if (timer <= 0) {
          clearInterval(countdown);
          setResendDisabled(false);
        }
      }, 1000);
    } finally {
      clearInterval(interval);
      setLoading(false);
    }
  };

  // Resend OTP
  const handleResendOTP = async () => {
    if (resendDisabled) return;
    
    setQuickLoading(true);
    setError(null);

    try {
      // Resend password reset OTP
      await authService.requestPasswordReset(email);
      toast.success("New password reset code sent to your email!");
      
      // Start resend timer again
      setResendDisabled(true);
      let timer = 60;
      setResendTimer(timer);
      
      const countdown = setInterval(() => {
        timer -= 1;
        setResendTimer(timer);
        
        if (timer <= 0) {
          clearInterval(countdown);
          setResendDisabled(false);
        }
      }, 1000);
    } catch (error) {
      toast.info("If your email is registered, you will receive a new password reset code");
      
      // Start resend timer again
      setResendDisabled(true);
      let timer = 60;
      setResendTimer(timer);
      
      const countdown = setInterval(() => {
        timer -= 1;
        setResendTimer(timer);
        
        if (timer <= 0) {
          clearInterval(countdown);
          setResendDisabled(false);
        }
      }, 1000);
    } finally {
      setQuickLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleOTPComplete = async (otp) => {
    setQuickLoading(true);
    setError(null);
    
    try {
      // Verify password reset OTP
      const response = await authService.verifyResetOTP(email, otp);
      
      // Store reset token for the final step
      setResetToken(response.reset_token);
      
      // Move to new password step
      setStep(3);
      
      toast.success("OTP verified successfully!");
    } catch (error) {
      toast.error(error.message || "Invalid verification code");
      setError(error.message || "Invalid verification code");
    } finally {
      setQuickLoading(false);
    }
  };

  // Step 3: Set new password
  const handleNewPasswordSubmit = async (e) => {
    e.preventDefault();

    // Password validation
    if (!newPassword) {
      setError("New password is required");
      return;
    }

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    setError(null);
    setProgress(0);

    const interval = simulateProgress();

    try {
      // Reset password
      await authService.resetPassword(email, newPassword, resetToken);
      clearInterval(interval);
      setProgress(100);
      toast.success("Password reset successful! Please login with your new password");
      
      // Redirect to login after a short delay
      setTimeout(() => {
        switchToLogin();
      }, 2000);
    } catch (error) {
      clearInterval(interval);
      toast.error(error.message || "Failed to reset password");
      setError(error.message || "Failed to reset password");
    } finally {
      clearInterval(interval);
      setLoading(false);
    }
  };

  // Go back to previous step
  const goToPreviousStep = () => {
    setStep(step - 1);
    setError(null);
  };

  // Render email input form (Step 1)
  const renderEmailForm = () => {
    return (
      <form className="w-full space-y-5" onSubmit={handleEmailSubmit}>
        <div className="w-full">
          <div className="relative">
            <input
              type="email"
              name="email"
              placeholder="Email address"
              className="w-full h-12 border rounded-full px-4 pl-12 focus:outline-none"
              style={{
                backgroundColor: themeColors.cardBg,
                borderColor: error
                  ? themeColors.errorColor
                  : themeColors.borderColor,
                color: themeColors.textPrimary,
              }}
              onChange={handleChange}
              value={email}
            />
            <div
              className="absolute left-4 top-1/2 transform -translate-y-1/2"
              style={{ color: themeColors.textSecondary }}
            >
              <FaEnvelope size={18} />
            </div>
          </div>

          {/* Error message container with red styling */}
          <div style={{ height: "20px", marginTop: "4px" }}>
            {error && (
              <p
                className="text-sm font-semibold text-left"
                style={{
                  color: themeColors.errorColor,
                }}
              >
                {error}
              </p>
            )}
          </div>
        </div>

        <button
          type="submit"
          className="w-full h-12 text-white cursor-pointer transition-colors rounded-full border"
          style={{
            backgroundColor: themeColors.buttonBg,
            borderColor: themeColors.borderColor,
          }}
        >
          Send Reset Code →
        </button>
      </form>
    );
  };

  // Render OTP verification form (Step 2)
  const renderOTPForm = () => {
    return (
      <div className="w-full space-y-4">
        <button
          onClick={goToPreviousStep}
          className="flex items-center space-x-2 text-sm mb-4"
          style={{ color: themeColors.textSecondary }}
        >
          <FaArrowLeft /> <span>Back</span>
        </button>

        <div className="text-center mb-4">
          <h2 className="text-xl font-semibold mb-2" style={{ color: themeColors.textPrimary }}>
            Password Reset Verification
          </h2>
          <p className="text-sm" style={{ color: themeColors.textSecondary }}>
            We've sent a verification code to:
          </p>
          <p className="font-medium" style={{ color: themeColors.textPrimary }}>
            {email}
          </p>
        </div>

        <OTPInput 
          length={6}
          onComplete={handleOTPComplete}
          themeColors={themeColors}
        />

        <div className="flex justify-center mt-4">
          <button
            onClick={handleResendOTP}
            disabled={resendDisabled}
            className={`text-sm ${resendDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:underline cursor-pointer'}`}
            style={{ color: themeColors.textSecondary }}
          >
            {resendDisabled 
              ? `Resend code in ${resendTimer}s` 
              : "Didn't receive the code? Resend"}
          </button>
        </div>

        {/* Error message container */}
        <div style={{ height: "20px", marginTop: "4px" }}>
          {error && (
            <p
              className="text-sm font-semibold text-center"
              style={{
                color: themeColors.errorColor,
              }}
            >
              {error}
            </p>
          )}
        </div>
      </div>
    );
  };

  // Render new password form (Step 3)
  const renderNewPasswordForm = () => {
    return (
      <form className="w-full space-y-4" onSubmit={handleNewPasswordSubmit}>
        <button
          onClick={goToPreviousStep}
          className="flex items-center space-x-2 text-sm mb-4"
          style={{ color: themeColors.textSecondary }}
        >
          <FaArrowLeft /> <span>Back</span>
        </button>

        <div className="text-center mb-4">
          <h2 className="text-xl font-semibold mb-2" style={{ color: themeColors.textPrimary }}>
            Create New Password
          </h2>
          <p className="text-sm" style={{ color: themeColors.textSecondary }}>
            Your identity has been verified. Set your new password.
          </p>
        </div>

        <div className="w-full">
          <div className="relative">
            <input
              type={showNewPassword ? "text" : "password"}
              name="newPassword"
              placeholder="New password"
              className="w-full h-12 border rounded-full px-4 pl-12 pr-12 focus:outline-none"
              style={{
                backgroundColor: themeColors.cardBg,
                borderColor: error && error.includes("Password")
                  ? themeColors.errorColor
                  : themeColors.borderColor,
                color: themeColors.textPrimary,
              }}
              onChange={handleChange}
              value={newPassword}
            />
            <div
              className="absolute left-4 top-1/2 transform -translate-y-1/2"
              style={{ color: themeColors.textSecondary }}
            >
              <FaLock size={18} />
            </div>
            <button
              type="button"
              className="absolute right-4 top-1/2 transform -translate-y-1/2"
              style={{ color: themeColors.textSecondary }}
              onClick={() => togglePasswordVisibility('newPassword')}
              aria-label={showNewPassword ? "Hide password" : "Show password"}
            >
              {showNewPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
            </button>
          </div>
        </div>

        <div className="w-full">
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm new password"
              className="w-full h-12 border rounded-full px-4 pl-12 pr-12 focus:outline-none"
              style={{
                backgroundColor: themeColors.cardBg,
                borderColor: error && error.includes("match")
                  ? themeColors.errorColor
                  : themeColors.borderColor,
                color: themeColors.textPrimary,
              }}
              onChange={handleChange}
              value={confirmPassword}
            />
            <div
              className="absolute left-4 top-1/2 transform -translate-y-1/2"
              style={{ color: themeColors.textSecondary }}
            >
              <FaLock size={18} />
            </div>
            <button
              type="button"
              className="absolute right-4 top-1/2 transform -translate-y-1/2"
              style={{ color: themeColors.textSecondary }}
              onClick={() => togglePasswordVisibility('confirmPassword')}
              aria-label={showConfirmPassword ? "Hide password" : "Show password"}
            >
              {showConfirmPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
            </button>
          </div>
        </div>

        {/* Error message container */}
        <div style={{ height: "20px", marginTop: "4px" }}>
          {error && (
            <p
              className="text-sm font-semibold text-center"
              style={{
                color: themeColors.errorColor,
              }}
            >
              {error}
            </p>
          )}
        </div>

        <button
          type="submit"
          className="w-full h-12 text-white cursor-pointer transition-colors rounded-full border mt-4"
          style={{
            backgroundColor: themeColors.buttonBg,
            borderColor: themeColors.borderColor,
          }}
        >
          Reset Password
        </button>
      </form>
    );
  };

  // Render content based on current step
  const renderStepContent = () => {
    switch (step) {
      case 1:
        return renderEmailForm();
      case 2:
        return renderOTPForm();
      case 3:
        return renderNewPasswordForm();
      default:
        return renderEmailForm();
    }
  };

  return (
    <div className="flex flex-col items-center text-center h-full overflow-y-auto px-6">
      <ToastContainer position="top-right" autoClose={7000} />
      {loading && <LoginOverlay progress={progress} />}
      {quickLoading && <SimpleLoader />}

      {/* Back button (only on first step) */}
      {step === 1 && (
        <div className="self-start mt-4">
          <button
            onClick={switchToLogin}
            className="flex items-center space-x-2 text-sm"
            style={{ color: themeColors.textSecondary }}
          >
            <FaArrowLeft /> <span>Back to Login</span>
          </button>
        </div>
      )}

      {/* Top Badge */}
      <h1
        className="font-primary text-4xl font-thin mt-6"
        style={{ color: themeColors.primaryColor }}
      >
        {step === 1 
          ? "Forgot Password" 
          : step === 2 
          ? "Verify Your Identity" 
          : "Reset Password"}
      </h1>

      <p
        className="font-primary text-base mb-6"
        style={{ color: themeColors.textPrimary }}
      >
        {step === 1 
          ? "Enter your email to receive a reset code" 
          : step === 2 
          ? "Enter the verification code sent to your email" 
          : "Create a new secure password"}
      </p>

      {renderStepContent()}

      {/* Back to login button (shown on all steps) */}
      <button
        onClick={switchToLogin}
        className="mt-8 text-sm hover:underline"
        style={{ color: themeColors.textSecondary }}
      >
        Remember your password? Sign in
      </button>
    </div>
  );
};

export default ResetPassword;
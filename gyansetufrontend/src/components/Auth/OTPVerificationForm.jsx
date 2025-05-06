// src/components/Auth/OTPVerificationForm.jsx
import React from "react";
import { FaArrowLeft, FaLock } from "react-icons/fa";
import OTPInput from "./OTPInput";

const OTPVerificationForm = ({
  email,
  onBack,
  onVerify,
  onResend,
  resendDisabled,
  resendTimer,
  error,
  themeColors,
  title = "Verify Your Email",
  description = "Enter the verification code sent to your email"
}) => {
  // Default theme colors if not provided
  const defaultThemeColors = {
    bgColor: "#F8F5FF",
    cardBg: "#F0E6FF",
    primaryColor: "#8A2BE2",
    borderColor: "#D1C2F0",
    buttonBg: "#9370DB",
    buttonHover: "#7B68EE",
    textPrimary: "#4B0082",
    textSecondary: "#663399",
    errorColor: "#FF3333",
    successColor: "#4CAF50",
  };

  // Use provided theme colors or defaults
  const colors = themeColors || defaultThemeColors;

  return (
    <div className="flex flex-col items-center w-full max-w-md px-6 py-4">
      <button
        onClick={onBack}
        className="self-start flex items-center space-x-2 text-sm mb-6"
        style={{ color: colors.textSecondary }}
      >
        <FaArrowLeft /> <span>Back</span>
      </button>

      <div 
        className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
        style={{ backgroundColor: colors.cardBg }}
      >
        <FaLock size={32} style={{ color: colors.primaryColor }} />
      </div>

      <h2 
        className="text-2xl font-semibold mb-2 text-center"
        style={{ color: colors.textPrimary }}
      >
        {title}
      </h2>

      <p 
        className="text-center mb-2"
        style={{ color: colors.textSecondary }}
      >
        {description}
      </p>
      
      <p 
        className="text-md font-medium mb-6 text-center"
        style={{ color: colors.primaryColor }}
      >
        {email}
      </p>

      <OTPInput 
        length={6}
        onComplete={onVerify}
        themeColors={colors}
      />

      {error && (
        <p 
          className="text-sm font-medium mt-4"
          style={{ color: colors.errorColor }}
        >
          {error}
        </p>
      )}

      <button
        onClick={onResend}
        disabled={resendDisabled}
        className={`text-sm mt-6 ${resendDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:underline cursor-pointer'}`}
        style={{ color: colors.textSecondary }}
      >
        {resendDisabled 
          ? `Resend code in ${resendTimer}s` 
          : "Didn't receive the code? Resend"}
      </button>

      <p 
        className="text-xs text-center mt-4"
        style={{ color: colors.textSecondary }}
      >
        Please enter the 6-digit code we sent to your email address.
        <br />
        If you don't see it, check your spam folder.
      </p>
    </div>
  );
};

export default OTPVerificationForm;
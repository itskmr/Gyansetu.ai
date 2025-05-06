// src/components/Auth/EmailVerificationSent.jsx
import React from "react";
import { FaEnvelope, FaArrowLeft } from "react-icons/fa";

const EmailVerificationSent = ({ email, onBack, onResend, resendDisabled, resendTimer, themeColors }) => {
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
    <div className="flex flex-col items-center w-full max-w-md px-6 py-8">
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
        <FaEnvelope size={36} style={{ color: colors.primaryColor }} />
      </div>

      <h2 
        className="text-2xl font-semibold mb-4 text-center"
        style={{ color: colors.textPrimary }}
      >
        Verification Email Sent
      </h2>

      <p 
        className="text-center mb-3"
        style={{ color: colors.textSecondary }}
      >
        We've sent a verification code to:
      </p>
      
      <p 
        className="text-lg font-medium mb-6 text-center"
        style={{ color: colors.primaryColor }}
      >
        {email}
      </p>

      <p 
        className="text-center mb-8 text-sm"
        style={{ color: colors.textSecondary }}
      >
        Please check your inbox (and spam folder) for the verification code and enter it on the next screen.
      </p>

      <button
        onClick={onResend}
        disabled={resendDisabled}
        className={`text-sm mb-4 ${resendDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:underline cursor-pointer'}`}
        style={{ color: colors.textSecondary }}
      >
        {resendDisabled 
          ? `Resend code in ${resendTimer}s` 
          : "Didn't receive the code? Resend"}
      </button>

      <p 
        className="text-xs text-center"
        style={{ color: colors.textSecondary }}
      >
        Having trouble? Contact our support team for assistance.
      </p>
    </div>
  );
};

export default EmailVerificationSent;
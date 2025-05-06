import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";

const OTPInput = ({ length = 6, onComplete, themeColors }) => {
  const [otp, setOtp] = useState(Array(length).fill(""));
  const inputRefs = useRef([]);

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

  useEffect(() => {
    // Focus first input on mount
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (isNaN(value)) return; // Allow only numbers

    // Update OTP array
    const newOtp = [...otp];
    
    // Take only the last char if multiple chars are pasted
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    // Check if all digits are filled
    const filledOtp = newOtp.join("");
    if (filledOtp.length === length) {
      onComplete(filledOtp);
    }

    // Move to next input if current one is filled
    if (value && index < length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    // Move to previous input on backspace if current is empty
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }

    // Move to next input on right arrow key
    if (e.key === "ArrowRight" && index < length - 1) {
      inputRefs.current[index + 1].focus();
    }

    // Move to previous input on left arrow key
    if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text/plain").trim();
    
    // Ensure pasted text contains only numbers
    if (!/^\d+$/.test(pastedData)) return;
    
    // Fill OTP inputs with pasted data
    const newOtp = [...otp];
    for (let i = 0; i < Math.min(length, pastedData.length); i++) {
      newOtp[i] = pastedData[i];
    }
    
    setOtp(newOtp);
    
    // Focus the next empty input or the last one
    const lastFilledIndex = Math.min(length - 1, pastedData.length - 1);
    if (inputRefs.current[lastFilledIndex + 1]) {
      inputRefs.current[lastFilledIndex + 1].focus();
    } else {
      inputRefs.current[lastFilledIndex].focus();
    }
    
    // Check if all digits are filled
    const filledOtp = newOtp.join("");
    if (filledOtp.length === length) {
      onComplete(filledOtp);
    }
  };

  return (
    <div className="flex flex-col items-center w-full">
      <div className="flex justify-center gap-2 my-4 w-full">
        {Array.from({ length }, (_, index) => (
          <input
            key={index}
            ref={(ref) => (inputRefs.current[index] = ref)}
            type="text"
            maxLength={1}
            value={otp[index]}
            onChange={(e) => handleChange(e, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            onPaste={index === 0 ? handlePaste : undefined}
            className="w-12 h-14 text-center text-xl font-bold border rounded-lg focus:outline-none"
            style={{
              backgroundColor: colors.cardBg,
              borderColor: colors.borderColor,
              color: colors.textPrimary,
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
              transition: "all 0.2s ease-in-out",
            }}
          />
        ))}
      </div>
      <p className="text-sm" style={{ color: colors.textSecondary }}>
        Enter the 6-digit code sent to your email
      </p>
    </div>
  );
};

OTPInput.propTypes = {
  length: PropTypes.number,
  onComplete: PropTypes.func.isRequired,
  themeColors: PropTypes.object,
};

export default OTPInput;
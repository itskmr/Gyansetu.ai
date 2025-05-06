import { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

const PasswordInput = ({ handleChange, themeColors }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  // Default theme colors if not provided
  const defaultThemeColors = {
    bgColor: "#F8F5FF",
    cardBg: "#EDE5FF",
    primaryColor: "#9C7BDE",
    borderColor: "#D4C6F8",
    buttonBg: "#8B6ED6",
    buttonHover: "#7854D1",
    textPrimary: "#4E3A78",
    textSecondary: "#6F5BA7",
  };

  // Use provided theme colors or defaults
  const colors = themeColors || defaultThemeColors;

  const togglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  const validatePassword = (e) => {
    const password = e.target.value;
    const passwordRegex =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[#@$!%*?&])[A-Za-z\d#@$!%*?&]{8,}$/;

    if (password.length === 0) {
      setError(""); // ✅ Clear error if input is empty
    } else if (!passwordRegex.test(password)) {
      setError(
        "Password must be at least 8 characters, include 1 uppercase letter, 1 number, and 1 special character (#@$!%*?&)."
      );
    } else {
      setError(""); // ✅ Remove error when valid
    }

    handleChange(e);
  };

  return (
    <div className="relative w-full">
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Enter your password"
          name="password"
          className="w-full h-12 border rounded-[24px] px-4 pr-12 focus:outline-none"
          style={{
            backgroundColor: colors.cardBg,
            borderColor: colors.borderColor,
            color: colors.textPrimary,
            lineHeight: "normal",
            height: "48px",
          }}
          onChange={validatePassword}
        />
        <span
          onClick={togglePassword}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer flex items-center justify-center"
          style={{
            height: "48px",
            width: "24px",
            display: "flex",
            alignItems: "center",
            color: colors.textSecondary,
          }}
        >
          {showPassword ? (
            <AiOutlineEye size={22} />
          ) : (
            <AiOutlineEyeInvisible size={22} />
          )}
        </span>
      </div>
      {error && (
        <p
          className="text-sm mt-2"
          style={{
            color: "#E57373", // A softer red that works with the purple theme
          }}
        >
          {error}
        </p>
      )}
    </div>
  );
};

export default PasswordInput;

import React, { useState, useCallback } from "react";
import { FaGoogle, FaApple, FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import SignupOverlay from "./SignupOverlay";
import SimpleLoader from "./SimpleLoader";
import { auth } from "../../firebaseConfig";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import authService from "../../services/api/authService";

const SignupForm = ({ switchToLogin }) => {
  const [countryCode, setCountryCode] = useState("+91");
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    role: "student",
    email: "",
    password: "",
    phone: "",
    firstName: "",
    lastName: "",
    otp: ""
  });
  const [loading, setLoading] = useState(false);
  const [quickLoading, setQuickLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [verifiedToken, setVerifiedToken] = useState(null);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    if (name === 'phone') {
      const phoneNumberOnly = value.replace(countryCode, "");
      setFormData((prev) => ({ ...prev, phone: phoneNumberOnly }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
      // Clear errors when user starts typing again
      if (error) setError(null);
    }
  }, [countryCode, error]);

  const togglePassword = () => {
    setShowPassword((prev) => !prev);
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

  // Send OTP to the user's email
  const handleSendOTP = async (e) => {
    e.preventDefault();

    // Validate email
    if (!formData.email.trim()) {
      setError("Email is required");
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address");
      return;
    }

    setQuickLoading(true);
    setError(null);

    try {
      // Send verification OTP
      await authService.preSignup(formData.email, formData.role);
      toast.success("Verification code sent to your email!");
      
      // Show OTP field
      setOtpSent(true);
      
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
      toast.error(error.message || "Failed to send verification code fill all fields first");
      setError(error.message || "Failed to send verification code fill all fields first");
    } finally {
      setQuickLoading(false);
    }
  };

  // Resend OTP
  const handleResendOTP = async () => {
    if (resendDisabled) return;
    
    setQuickLoading(true);
    setError(null);

    try {
      // Resend verification OTP
      await authService.preSignup(formData.email, formData.role);
      toast.success("New verification code sent to your email!");
      
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
      toast.error(error.message || "Failed to resend verification code");
      setError(error.message || "Failed to resend verification code");
    } finally {
      setQuickLoading(false);
    }
  };

  // Verify OTP
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    
    if (!formData.otp || formData.otp.length !== 6) {
      setError("Please enter a valid 6-digit verification code");
      return;
    }
    
    setQuickLoading(true);
    setError(null);
    
    try {
      // Verify OTP
      const response = await authService.verifyEmailOTP(formData.email, formData.otp);
      
      // Store verification token for signup
      setVerifiedToken(response.verified_token);
      
      // Mark as verified
      setOtpVerified(true);
      
      toast.success("Email verified successfully!");
    } catch (error) {
      toast.error(error.message || "Invalid verification code");
      setError(error.message || "Invalid verification code");
    } finally {
      setQuickLoading(false);
    }
  };

  // Handle final signup
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.firstName.trim()) {
      setError("First name is required");
      return;
    }

    if (!formData.lastName.trim()) {
      setError("Last name is required");
      return;
    }

    if (!formData.email.trim()) {
      setError("Email is required");
      return;
    }

    if (!formData.phone.trim()) {
      setError("Phone number is required");
      return;
    }

    if (!formData.password.trim()) {
      setError("Password is required");
      return;
    }

    // Verify that email is verified
    if (!otpVerified || !verifiedToken) {
      setError("Please verify your email before signup");
      return;
    }

    setLoading(true);
    setError(null);
    setProgress(0);

    const interval = simulateProgress();

    try {
      // Prepare data for API
      const signupData = {
        ...formData,
        phone: `${countryCode}${formData.phone}`,
      };

      // Complete registration
      const response = await authService.completeSignup(signupData, verifiedToken);
      clearInterval(interval);
      setProgress(100);
      toast.success("Signup successful! Please login to continue 🎉");
      
      // Clear form data
      setFormData({
        role: "student",
        email: "",
        password: "",
        phone: "",
        firstName: "",
        lastName: "",
        otp: ""
      });

      // Navigate to login page after a short delay
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error) {
      clearInterval(interval);
      toast.error(error.message || "Signup failed ❌");
      setError(error.message || "Signup failed");
    } finally {
      clearInterval(interval);
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    if (!formData.role) {
      toast.error("Please select a role before signing up with Google");
      return;
    }

    setLoading(true);
    
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();
      
      // Create user data from Google profile
      const userData = {
        email: result.user.email,
        role: formData.role,
        googleToken: idToken,
        firstName: result.user.displayName?.split(' ')[0] || '',
        lastName: result.user.displayName?.split(' ').slice(1).join(' ') || '',
        phone: result.user.phoneNumber || ''
      };

      const response = await authService.googleLogin(userData);
      toast.success("Signup successful! 🎉");
      setTimeout(() => {
        navigate(`/${response.user.role}`);
      }, 500);
    } catch (error) {
      // Handle role mismatch
      if (error.response?.status === 403 && error.response?.data?.actualRole) {
        const actualRole = error.response.data.actualRole;
        toast.error(
          `This email is already registered as a ${actualRole}. Please select the correct role.`,
          { position: "top-center", autoClose: 5000 }
        );
      } else {
        toast.error(error.message || "Signup failed ❌");
        setError(error.message || "Signup failed");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAppleLogin = async () => {
    toast.info("Apple login is coming soon");
  };

  return (
    <div className="flex flex-col items-center text-center space-y-0 mt-0">
      <ToastContainer position="top-right" autoClose={7000} />
      {loading && <SignupOverlay progress={progress} />}
      {quickLoading && <SimpleLoader />}

      <h1 className="font-primary font-secondary text-lg md:text-4xl font-thin mt-2 text-purple-900">
        Sign up account
      </h1>
      <p className="hidden md:block md:mt-3 font-primary font-secondary text-purple-700 md:text-xs font-montserrat mb-2">
        Enter your personal data to create your account
      </p>

      <div className="h-6 mb-2">
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </div>

      <div className="flex space-x-2 md:space-x-4 my-3 mb-1 md:my-0">
        <button
          className="text-white px-3 md:px-4 py-1 md:py-2 rounded-[15px] border border-purple-300 transition-colors cursor-pointer flex items-center justify-center"
          style={{ backgroundColor: "#9f7aea" }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = "#805ad5";
            e.target.style.cursor = "pointer";
          }}
          onMouseLeave={(e) => (e.target.style.backgroundColor = "#9f7aea")}
          onClick={handleGoogleLogin}
        >
          <FaGoogle className="text-xs md:text-lg bg-transparent" />
        </button>
        <button
          className="text-white px-3 md:px-4 py-1 md:py-2 rounded-[15px] border border-purple-300 transition-colors cursor-pointer flex items-center justify-center"
          style={{ backgroundColor: "#9f7aea" }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = "#805ad5";
            e.target.style.cursor = "pointer";
          }}
          onMouseLeave={(e) => (e.target.style.backgroundColor = "#9f7aea")}
          onClick={handleAppleLogin}
        >
          <FaApple className="text-xs md:text-lg bg-transparent" />
        </button>
      </div>

      <div className="flex items-center justify-center my-2 md:my-4 w-full">
        <div className="h-px bg-purple-300 w-48"></div>
        <span className="px-2 text-purple-600">or</span>
        <div className="h-px bg-purple-300 w-48"></div>
      </div>

      <form className="w-80 space-y-4" onSubmit={handleSubmit}>
        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="w-full h-12 bg-purple-50 text-purple-900 border border-purple-300 rounded-[24px] px-4 focus:outline-none focus:border-purple-500 appearance-none cursor-pointer"
          style={{
            backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20' stroke='%236b46c1'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E\")",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "right 1rem center",
            backgroundSize: "1.5rem",
          }}
        >
          <option value="student">Student</option>
          <option value="teacher">Teacher</option>
          <option value="institute">Institution</option>
          <option value="parent">Parent</option>
        </select>

        <input
          type="text"
          name="firstName"
          placeholder="First Name"
          className="w-full h-12 bg-purple-50 text-purple-900 border border-purple-300 rounded-[24px] px-4 focus:outline-none focus:border-purple-500"
          value={formData.firstName}
          onChange={handleChange}
        />

        <input
          type="text"
          name="lastName"
          placeholder="Last Name"
          className="w-full h-12 bg-purple-50 text-purple-900 border border-purple-300 rounded-[24px] px-4 focus:outline-none focus:border-purple-500"
          value={formData.lastName}
          onChange={handleChange}
        />

        <div className="relative">
          <input
            type="email"
            name="email"
            placeholder="Email address"
            className="w-full h-12 bg-purple-50 text-purple-900 border border-purple-300 rounded-[24px] px-4 focus:outline-none focus:border-purple-500"
            value={formData.email}
            onChange={handleChange}
            disabled={otpVerified}
          />
          {otpVerified ? (
            <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-green-500 text-sm bg-green-100 px-2 py-1 rounded-full">
              Verified ✓
            </span>
          ) : (
            <button
              type="button"
              onClick={handleSendOTP}
              disabled={resendDisabled}
              className={`absolute right-3 top-1/2 transform -translate-y-1/2 px-2 py-1 rounded-full text-xs ${
                resendDisabled
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-purple-200 text-purple-700 hover:bg-purple-300"
              }`}
            >
              {resendDisabled
                ? `Resend in ${resendTimer}s`
                : otpSent
                ? "Resend OTP"
                : "Send OTP"}
            </button>
          )}
        </div>

        {/* OTP input field, only shown after OTP is sent */}
        {otpSent && !otpVerified && (
          <div className="relative">
            <input
              type="text"
              name="otp"
              placeholder="Enter 6-digit verification code"
              className="w-full h-12 bg-purple-50 text-purple-900 border border-purple-300 rounded-[24px] px-4 focus:outline-none focus:border-purple-500"
              value={formData.otp}
              onChange={handleChange}
              maxLength={6}
            />
            <button
              type="button"
              onClick={handleVerifyOTP}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 px-2 py-1 bg-green-200 text-green-700 hover:bg-green-300 rounded-full text-xs"
            >
              Verify
            </button>
          </div>
        )}

        <div className="flex items-center w-full h-12 bg-purple-50 text-purple-900 border border-purple-300 rounded-[24px] px-4 focus-within:border-purple-500">
          <select
            value={countryCode}
            onChange={(e) => setCountryCode(e.target.value)}
            className="bg-purple-50 text-purple-900 border-none focus:outline-none cursor-pointer mr-2"
          >
            <option value="+1">🇺🇸 +1</option>
            <option value="+44">🇬🇧 +44</option>
            <option value="+91">🇮🇳 +91</option>
            <option value="+61">🇦🇺 +61</option>
            <option value="+81">🇯🇵 +81</option>
          </select>

          <input
            type="text"
            name="phone"
            placeholder="Phone number"
            className="w-full bg-purple-50 text-purple-900 focus:outline-none"
            value={formData.phone}
            onChange={handleChange}
          />
        </div>

        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Enter your password"
            className="w-full h-12 bg-purple-50 text-purple-900 border border-purple-300 rounded-[24px] px-4 pr-12 focus:outline-none focus:border-purple-500"
            value={formData.password}
            onChange={handleChange}
          />
          <button
            type="button"
            onClick={togglePassword}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-purple-700"
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>

        <button
          type="submit"
          className={`font-primary font-secondary w-full h-12 text-white transition-colors mt-6 rounded-[24px] ${
            otpVerified
              ? "bg-purple-800 hover:bg-purple-600 cursor-pointer"
              : "bg-purple-400 cursor-not-allowed"
          }`}
          disabled={!otpVerified}
        >
          {loading ? "Signing up..." : "Sign up →"}
        </button>
      </form>

      <div className="login-foot mt-8 text-xs text-purple-700">
        <span className="mr-2 font-primary font-secondary">
          Already have an account?
        </span>
        <button
          onClick={switchToLogin}
          className="text-white mt-3 md:mt-0 font-primary font-secondary cursor-pointer px-2 py-1 rounded-[8px] text-[0.85rem] border border-purple-300 transition-colors cursor-pointer bg-purple-600"
          style={{
            backgroundColor: "#8a70d6",
            transition: "background-color 0.2s ease",
          }}
          onMouseEnter={(e) => (e.target.style.backgroundColor = "#7c3aed")}
          onMouseLeave={(e) => (e.target.style.backgroundColor = "#8a70d6")}
        >
          Sign in
        </button>
      </div>
    </div>
  );
};

export default SignupForm;
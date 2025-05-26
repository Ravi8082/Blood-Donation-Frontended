import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock, FaKey, FaArrowLeft, FaRedo } from 'react-icons/fa';
import "./ForgotPassword.css";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const isLoggedIn = sessionStorage.getItem('userEmail');
  const userRole = sessionStorage.getItem('role');

  // Redirect if user is already logged in
  useEffect(() => {
    if (isLoggedIn) {
      // Redirect based on user role
      userRole?.toUpperCase() === 'ADMIN' ? navigate('/admin-dashboard') : navigate('/dashboard');
    }
  }, [isLoggedIn, userRole, navigate]);

  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [inputFocus, setInputFocus] = useState({
    email: false,
    otp: false,
    password: false
  });

  // Load countdown from localStorage on component mount
  useEffect(() => {
    const savedCountdown = localStorage.getItem('otpCountdown');
    const savedEmail = localStorage.getItem('resetEmail');
    const savedTimestamp = localStorage.getItem('countdownTimestamp');
    
    if (savedCountdown && savedEmail && savedEmail === email && savedTimestamp) {
      const elapsedTime = Math.floor((Date.now() - parseInt(savedTimestamp)) / 1000);
      const remainingTime = Math.max(0, parseInt(savedCountdown) - elapsedTime);
      
      if (remainingTime > 0) {
        setCountdown(remainingTime);
      }
    }
  }, [email]);

  // Countdown timer effect
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      // Save countdown to localStorage
      localStorage.setItem('otpCountdown', countdown.toString());
      localStorage.setItem('resetEmail', email);
      localStorage.setItem('countdownTimestamp', Date.now().toString());
      
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (countdown === 0) {
      // Clear localStorage when countdown reaches zero
      localStorage.removeItem('otpCountdown');
      localStorage.removeItem('resetEmail');
      localStorage.removeItem('countdownTimestamp');
    }
    
    return () => clearTimeout(timer);
  }, [countdown, email]);

  // Format countdown time as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@(gmail\.com|yahoo\.com|outlook\.com)$/;
    if (!email) {
      setEmailError("Email is required");
      return false;
    }
    if (!emailRegex.test(email)) {
      setEmailError("Please use Gmail, Yahoo, or Outlook email address");
      return false;
    }
    setEmailError("");
    return true;
  };

  const validateOtp = (otp) => {
    if (!otp) {
      setOtpError("OTP is required");
      return false;
    }
    if (!/^\d{6}$/.test(otp)) {
      setOtpError("OTP must be 6 digits");
      return false;
    }
    setOtpError("");
    return true;
  };

  const validatePassword = (password) => {
    if (!password) {
      setPasswordError("Password is required");
      return false;
    }
    if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      return false;
    }
    if (!/[A-Z]/.test(password)) {
      setPasswordError("Password must contain at least one uppercase letter");
      return false;
    }
    if (!/[a-z]/.test(password)) {
      setPasswordError("Password must contain at least one lowercase letter");
      return false;
    }
    if (!/[0-9]/.test(password)) {
      setPasswordError("Password must contain at least one number");
      return false;
    }
    if (!/[!@#$%^&*]/.test(password)) {
      setPasswordError("Password must contain at least one special character (!@#$%^&*)");
      return false;
    }
    setPasswordError("");
    return true;
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!validateEmail(email)) {
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post("http://localhost:8082/forgot-password", { email });
      setMessage(response.data);
      setStep(2);
      setCountdown(120); // Start 2-minute countdown
    } catch (error) {
      setError(error.response?.data || "Error sending OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (countdown > 0) return;

    setResendLoading(true);
    setMessage("");
    setError("");

    try {
      const response = await axios.post("http://localhost:8082/resend-forgot-password", { email });
      setMessage(response.data);
      
      const expiryTime = Date.now() + 120 * 1000; // 2 minutes
      localStorage.setItem("otpExpiry", expiryTime); // Store expiry in localStorage

      setCountdown(120);
    } catch (error) {
      if (error.response?.status === 400) {
        setError(error.response.data);
      } else {
        setError("Error resending OTP. Please try again.");
      }
    } finally {
      setResendLoading(false);
    }
  };

  // Auto resume countdown when user returns to the page
  useEffect(() => {
    const savedExpiry = localStorage.getItem("otpExpiry");
    if (savedExpiry) {
      const remainingTime = Math.floor((savedExpiry - Date.now()) / 1000);
      if (remainingTime > 0) {
        setCountdown(remainingTime);
      }
    }
  }, []);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!validateOtp(otp) || !validatePassword(newPassword)) {
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post("http://localhost:8082/reset-password", {
        email,
        otp: parseInt(otp),
        newPassword
      });
      setMessage(response.data);
      
      // Clear localStorage when password is reset
      localStorage.removeItem('otpCountdown');
      localStorage.removeItem('resetEmail');
      localStorage.removeItem('countdownTimestamp');
      
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      setError(error.response?.data || "Error resetting password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleFocus = (field) => {
    setInputFocus(prev => ({ ...prev, [field]: true }));
  };

  const handleBlur = (field) => {
    setInputFocus(prev => ({ ...prev, [field]: false }));
  };

  return (
    <div className="forgot-password-container8">
      <div className="forgot-password-card8">
        <div className="card-header8">
          <h2>{step === 1 ? "Forgot Password" : "Reset Password"}</h2>
          <p className="header-description8">
            {step === 1 
              ? "Enter your email to receive OTP" 
              : "Enter OTP and new password"}
          </p>
        </div>

        {message && <div className="success-message8">{message}</div>}
        {error && <div className="error-message8">{error}</div>}

        {step === 1 ? (
          <form onSubmit={handleForgotPassword} className="forgot-password-form8">
            <div className="form-group8">
              {!inputFocus.email && !email && <FaEnvelope className="input-icon8" />}
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setEmailError("");
                }}
                onFocus={() => handleFocus('email')}
                onBlur={() => {
                  handleBlur('email');
                  validateEmail(email);
                }}
                className={`form-input8 ${emailError ? 'error-input' : ''} ${inputFocus.email || email ? 'no-icon' : ''}`}
                required
                disabled={loading}
              />
              {emailError && <div className="input-error8">{emailError}</div>}
            </div>
            <button 
              type="submit" 
              className={`submit-button8 ${loading ? 'loading' : ''}`}
              disabled={loading}
            >
              {loading ? 'Sending OTP...' : 'Send OTP'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className="reset-password-form8">
            <div className="form-group8">
              {!inputFocus.otp && !otp && <FaKey className="input-icon8" />}
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => {
                  setOtp(e.target.value.replace(/\D/g, '').slice(0, 6));
                  setOtpError("");
                }}
                onFocus={() => handleFocus('otp')}
                onBlur={() => {
                  handleBlur('otp');
                  validateOtp(otp);
                }}
                className={`form-input8 ${otpError ? 'error-input' : ''} ${inputFocus.otp || otp ? 'no-icon' : ''}`}
                maxLength={6}
                required
                disabled={loading}
              />
              {otpError && <div className="input-error8">{otpError}</div>}
            </div>
            <div className="form-group8">
              {!inputFocus.password && !newPassword && <FaLock className="input-icon8" />}
              <input
                type="password"
                placeholder="Enter New Password"
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  setPasswordError("");
                }}
                onFocus={() => handleFocus('password')}
                onBlur={() => {
                  handleBlur('password');
                  validatePassword(newPassword);
                }}
                className={`form-input8 ${passwordError ? 'error-input' : ''} ${inputFocus.password || newPassword ? 'no-icon' : ''}`}
                required
                disabled={loading}
              />
              {passwordError && <div className="input-error8">{passwordError}</div>}
            </div>
            
            <div className="resend-container8">
              {countdown > 0 ? (
                <div className="countdown-timer8">Resend OTP in {formatTime(countdown)}</div>
              ) : (
                <button 
                  type="button"
                  className={`resend-btn8 ${resendLoading ? 'loading' : ''}`} 
                  onClick={handleResendOtp}
                  disabled={resendLoading}
                >
                  <FaRedo className="resend-icon8" /> 
                  {resendLoading ? 'Sending...' : 'Resend OTP'}
                </button>
              )}
            </div>
            
            <button 
              type="submit" 
              className={`submit-button8 ${loading ? 'loading' : ''}`}
              disabled={loading}
            >
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;

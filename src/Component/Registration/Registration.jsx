import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaUser, FaEnvelope, FaTint, FaVenusMars, FaCalendar, FaPhone, FaMapMarkerAlt, FaLock, FaRedo } from 'react-icons/fa';
import "./Registration.css";

const Registration = () => {
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

  const [user, setUser] = useState({
    email: "",
    name: "",
    bloodgroup: "",
    gender: "Male",
    age: "",
    mobile: "",
    password: "",
    confirmPassword: "",
    emailOtp: "",
    address: "",
  });
  const [errors, setErrors] = useState({});
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [inputFocus, setInputFocus] = useState({
    email: false,
    name: false,
    bloodgroup: false,
    age: false,
    mobile: false,
    address: false,
    password: false,
    confirmPassword: false
  });

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => navigate("/login"), 5000);
      return () => clearTimeout(timer);
    }
  }, [success, navigate]);

  // Countdown timer effect
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  // Format countdown time as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const validateField = (name, value) => {
    switch (name) {
      case 'email':
        const emailRegex = /^[a-zA-Z0-9._-]+@(gmail\.com|yahoo\.com|outlook\.com)$/i;
        return emailRegex.test(value) ? '' : 'Please use a valid Gmail, Yahoo, or Outlook email';

      case 'name':
        const nameRegex = /^[a-zA-Z\s]{3,30}$/;
        return nameRegex.test(value) ? '' : 'Name should be 3-30 characters long and contain only letters';

      case 'bloodgroup':
        const validBloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
        return validBloodGroups.includes(value.toUpperCase()) ? '' : 'Please enter a valid blood group';

      case 'age':
        const age = parseInt(value);
        return (age >= 18 && age <= 65) ? '' : 'Age must be between 18 and 65';

      case 'mobile':
        const mobileRegex = /^[6-9]\d{9}$/;
        return mobileRegex.test(value) ? '' : 'Please enter a valid 10-digit Indian mobile number';

      case 'address':
        return value.trim().length >= 10 ? '' : 'Please enter a complete address (minimum 10 characters)';

      case 'password':
        // const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        // return passwordRegex.test(value) ? '' : 'Password must be 8+ characters with uppercase, lowercase, number & special character';

      case 'confirmPassword':
        return value === user.password ? '' : 'Passwords do not match';

      default:
        return '';
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let updatedValue = value;

    switch (name) {
      case 'email':
        updatedValue = value.toLowerCase();
        break;
      case 'name':
        updatedValue = value.replace(/[^a-zA-Z\s]/g, '');
        break;
      case 'bloodgroup':
        updatedValue = value.toUpperCase();
        break;
      case 'age':
        updatedValue = value.replace(/\D/g, '').slice(0, 2);
        break;
      case 'mobile':
        updatedValue = value.replace(/\D/g, '').slice(0, 10);
        break;
      default:
        break;
    }

    setUser(prev => ({ ...prev, [name]: updatedValue }));
    const fieldError = validateField(name, updatedValue);
    setErrors(prev => ({ ...prev, [name]: fieldError }));
    setError("");
  };

  const handleFocus = (field) => {
    setInputFocus(prev => ({ ...prev, [field]: true }));
  };

  const handleBlur = (field) => {
    setInputFocus(prev => ({ ...prev, [field]: false }));
    validateField(field, user[field]);
  };

  const validateForm = () => {
    const newErrors = {};
    Object.keys(user).forEach(key => {
      if (key !== 'emailOtp') {
        const fieldError = validateField(key, user[key]);
        if (fieldError) newErrors[key] = fieldError;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await axios.post("http://localhost:8082"/register", user);
      if (response.data) {
        setOtpSent(true);
        setError("");
        setSuccessMessage("OTP sent successfully!");
        setCountdown(120); // Start 2-minute countdown
      }
    } catch (error) {
      const errorMessage = error.response?.data || "Registration failed. Please try again!";
      setError(errorMessage);
      console.error("Registration Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const resendOtp = async () => {
    if (countdown > 0) return; // Prevent resending if countdown is active

    setResendLoading(true);
    try {
        const response = await axios.post("http://localhost:8082"/resend-registration", {
            email: user.email,
        });

        console.log("Resend OTP Response:", response);

        if (response.status === 200 && response.data) {
            const message = response.data.message || "OTP sent successfully!";
            setSuccessMessage(message);
            setError(""); // Clear previous errors

            // Store the OTP request time in localStorage
            const requestTime = new Date().getTime(); // Get current timestamp
            localStorage.setItem("otpRequestTime", requestTime);

            setCountdown(120); // Set countdown to 2 minutes (120 seconds)
        } else {
            setError("Failed to resend OTP. Please try again!");
        }
    } catch (error) {
        console.error("Resend OTP Error:", error);
        setError(error.response?.data?.message || "Failed to resend OTP. Please try again!");
    } finally {
        setResendLoading(false);
    }
  };

  // Check countdown when the page loads and adjust if user was away
  useEffect(() => {
      const requestTime = localStorage.getItem("otpRequestTime");

      if (requestTime) {
          const currentTime = new Date().getTime();
          const elapsedSeconds = Math.floor((currentTime - requestTime) / 1000);
          const remainingTime = Math.max(0, 120 - elapsedSeconds); // Ensure it doesn't go negative

          setCountdown(remainingTime); // Update countdown with adjusted time
      }
  }, []);

  useEffect(() => {
      if (countdown > 0) {
          const timer = setInterval(() => {
              setCountdown((prev) => prev - 1);
          }, 1000); 

          return () => clearInterval(timer); 
      }
  }, [countdown]);

  const verifyOtp = async () => {
    if (!/^\d{6}$/.test(user.emailOtp)) {
      setError("Please enter a valid 6-digit OTP!");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post("http://localhost:8082"/verify", {
        email: user.email,
        emailOtp: user.emailOtp
      });
      if (response.data) {
        setSuccess(true);
        setSuccessMessage("Registration successful! Redirecting to login...");
        setUser({
          email: "", name: "", bloodgroup: "", gender: "Male",
          age: "", mobile: "", password: "", confirmPassword: "",
          emailOtp: "", address: ""
        });
        setOtpSent(false);
      }
    } catch (error) {
      const errorMessage = error.response?.data || "Invalid OTP! Please try again.";
      setError(errorMessage);
      console.error("OTP Verification Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderInput = (name, placeholder, icon, type = "text") => (
    <div className="form-group9">
      {!inputFocus[name] && !user[name] && icon}
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={user[name]}
        onChange={handleChange}
        onFocus={() => handleFocus(name)}
        onBlur={() => handleBlur(name)}
        className={`${errors[name] ? 'error' : ''} ${inputFocus[name] || user[name] ? 'no-icon' : ''}`}
        required
        disabled={loading}
        autoComplete="off"
      />
      {errors[name] && <div className="field-error9">{errors[name]}</div>}
    </div>
  );

  return (
    <div className="registration-container9">
      <div className="registration-form-wrapper9">
        {!success ? (
          <>
            <h2 className="form-title9">
              <FaUser className="title-icon9" /> New User Registration
            </h2>
            {error && <div className="error-message9">{error}</div>}
            {!otpSent ? (
              <form onSubmit={handleRegister} className="registration-form9">
                {renderInput("email", "Email Address", <FaEnvelope className="input-icon9" />, "email")}
                {renderInput("name", "Full Name", <FaUser className="input-icon9" />)}
                <div className="form-row9">
                  {renderInput("bloodgroup", "Blood Group (e.g., A+)", <FaTint className="input-icon9" />)}
                  <div className="form-group9">
                    {!inputFocus.gender && !user.gender && <FaVenusMars className="input-icon9" />}
                    <select 
                      name="gender" 
                      value={user.gender} 
                      onChange={handleChange}
                      onFocus={() => handleFocus('gender')}
                      onBlur={() => handleBlur('gender')}
                      className={inputFocus.gender || user.gender ? 'no-icon' : ''}
                      disabled={loading}
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Others">Others</option>
                    </select>
                  </div>
                </div>
                <div className="form-row9">
                  {renderInput("age", "Age", <FaCalendar className="input-icon" />, "number")}
                  {renderInput("mobile", "Mobile Number", <FaPhone className="input-icon9" />, "tel")}
                </div>
                <div className="form-group9">
                  {!inputFocus.address && !user.address && <FaMapMarkerAlt className="input-icon9" />}
                  <textarea
                    name="address"
                    placeholder="Full Address"
                    value={user.address}
                    onChange={handleChange}
                    onFocus={() => handleFocus('address')}
                    onBlur={() => handleBlur('address')}
                    className={`${errors.address ? 'error' : ''} ${inputFocus.address || user.address ? 'no-icon' : ''}`}
                    required
                    disabled={loading}
                  />
                  {errors.address && <div className="field-error9">{errors.address}</div>}
                </div>
                <div className="form-row9">
                  {renderInput("password", "Password", <FaLock className="input-icon9" />, "password")}
                  {renderInput("confirmPassword", "Confirm Password", <FaLock className="input-icon9" />, "password")}
                </div>
                <button 
                  type="submit" 
                  className={`submit-btn9 ${loading ? 'loading' : ''}`}
                  disabled={loading}
                >
                  {loading ? 'Processing...' : 'Register'}
                </button>
              </form>
            ) : (
              <div className="otp-section9">
                <h3>Verify Your Email</h3>
                <p>Please enter the 6-digit OTP sent to your email</p>
                <div className="form-group9">
                  <input
                    type="text"
                    name="emailOtp"
                    placeholder="Enter OTP"
                    value={user.emailOtp}
                    onChange={handleChange}
                    maxLength="6"
                    pattern="\d{6}"
                    disabled={loading}
                    autoComplete="off"
                  />
                </div>
                <div className="otp-actions9">
                  <button 
                    className={`submit-btn9 ${loading ? 'loading' : ''}`} 
                    onClick={verifyOtp}
                    disabled={loading}
                  >
                    {loading ? 'Verifying...' : 'Verify OTP'}
                  </button>
                  
                  <div className="resend-container9">
                    {countdown > 0 ? (
                      <div className="countdown-timer9">Resend OTP in {formatTime(countdown)}</div>
                    ) : (
                      <button 
                      className={`resend-btn9 ${resendLoading ? 'loading' : ''}`} 
                      onClick={resendOtp}
                      disabled={resendLoading}
                    >
                      {resendLoading ? 'Sending...' : (
                        <>
                          <FaRedo className="resend-icon9" /> Resend OTP
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
              {successMessage && <div className="success-message9">{successMessage}</div>}
            </div>
          )}
        </>
      ) : (
        <div className="success-container9">
          <div className="success-icon9">✓</div>
          <h3>Registration Successful!</h3>
          <p>{successMessage}</p>
          <div className="redirect-message9">Redirecting to login page...</div>
        </div>
      )}
      <div className="login-link9">
        Already have an account? <span onClick={() => navigate('/login')}>Login here</span>
      </div>
    </div>
  </div>
);
};

export default Registration;

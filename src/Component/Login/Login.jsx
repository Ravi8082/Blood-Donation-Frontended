import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock } from 'lucide-react';
import axios from 'axios';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRememberMe, setIsRememberMe] = useState(false);
  const [rememberError, setRememberError] = useState('');
  const [inputFocus, setInputFocus] = useState({
    email: false,
    password: false
  });
  const navigate = useNavigate();

  // Redirect if the user is already logged in
  useEffect(() => {
    const role = sessionStorage.getItem('role');
    const userEmail = sessionStorage.getItem('userEmail');

    if (role && userEmail) {
      if (role === 'ADMIN' && userEmail === 'palravi1093@gmail.com') {
        navigate('/admin-dashboard');
      } else if (role === 'USER') {
        navigate('/dashboard');
      }
    }
  }, [navigate]);

  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@(gmail\.com|yahoo\.com|outlook\.com)$/;
    if (!email) {
      setEmailError('Email is required');
      return false;
    }
    if (!emailRegex.test(email)) {
      setEmailError('Please use Gmail, Yahoo, or Outlook email address');
      return false;
    }
    setEmailError('');
    return true;
  };

  const validatePassword = (password) => {
    if (!password) {
      setPasswordError('Password is required');
      return false;
    }
    if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return false;
    }
    setPasswordError('');
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setEmailError('');
    setPasswordError('');
    setRememberError('');

    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);

    if (!isRememberMe) {
      setRememberError('Please accept the Remember Me checkbox to continue');
      return;
    }

    if (!isEmailValid || !isPasswordValid) {
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post('http://localhost:8082/login', { 
        email, 
        password 
      });

      const { role, name, message, userId, email: userEmail, token } = response.data;

      if (!token || !role || !userEmail) {
        throw new Error('Invalid server response');
      }

      if (isRememberMe) {
        sessionStorage.setItem('token', token);
        sessionStorage.setItem('role', role);
        sessionStorage.setItem('name', name);
        sessionStorage.setItem('userId', userId.toString());
        sessionStorage.setItem('userEmail', userEmail);
      }

      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      if (role === 'ADMIN' && userEmail === 'palravi1093@gmail.com') {
        navigate('/admin-dashboard');
      } else if (role === 'USER') {
        navigate('/dashboard');
      } else {
        throw new Error('Unauthorized access');
      }

      alert(message || 'Login successful');

    } catch (error) {
      let errorMessage = 'Login failed';
      
      if (error.response?.status === 401) {
        errorMessage = 'Invalid email or password';
      } else if (error.response?.status === 403) {
        errorMessage = 'Access denied';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
      sessionStorage.clear();
      delete axios.defaults.headers.common['Authorization'];
    } finally {
      setLoading(false);
    }
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setEmailError('');
    setError('');
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setPasswordError('');
    setError('');
  };

  const handleRememberMeChange = (e) => {
    setIsRememberMe(e.target.checked);
    setRememberError('');
  };

  const handleFocus = (field) => {
    setInputFocus(prev => ({ ...prev, [field]: true }));
  };

  const handleBlur = (field) => {
    setInputFocus(prev => ({ ...prev, [field]: false }));
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h2 className="login-title">Welcome to Blood Bank</h2>
          <p className="login-subtitle">Please sign in to continue</p>
        </div>

        {error && (
          <div className="error-message">
            <i className="fas fa-exclamation-circle"></i> {error}
          </div>
        )}

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            {!inputFocus.email && !email && <Mail className="input-icon" />}
            <input
              type="email"
              id="email"
              className={`form-input ${emailError ? 'error-input' : ''} ${inputFocus.email || email ? 'no-icon' : ''}`}
              placeholder="Enter your email"
              value={email}
              onChange={handleEmailChange}
              onFocus={() => handleFocus('email')}
              onBlur={() => {
                handleBlur('email');
                validateEmail(email);
              }}
              disabled={loading}
              required
              autoComplete="off"
            />
            {emailError && <div className="input-error">{emailError}</div>}
          </div>

          <div className="form-group">
            {!inputFocus.password && !password && <Lock className="input-icon" />}
            <input
              type="password"
              id="password"
              className={`form-input ${passwordError ? 'error-input' : ''} ${inputFocus.password || password ? 'no-icon' : ''}`}
              placeholder="Enter your password"
              value={password}
              onChange={handlePasswordChange}
              onFocus={() => handleFocus('password')}
              onBlur={() => {
                handleBlur('password');
                validatePassword(password);
              }}
              disabled={loading}
              required
              autoComplete="off"
            />
            {passwordError && <div className="input-error">{passwordError}</div>}
          </div>

          <div className="remember-forgot">
            <div className="remember-me">
              <input 
                type="checkbox" 
                id="remember-me" 
                className={`remember-checkbox ${rememberError ? 'checkbox-error' : ''}`}
                checked={isRememberMe}
                onChange={handleRememberMeChange}
                disabled={loading}
              />
              <label htmlFor="remember-me" className="remember-label">
                Remember me
              </label>
            </div>
            {rememberError && <div className="checkbox-error-message">{rememberError}</div>}
            <Link to="/forgot-password" className="forgot-link">
              Forgot password?
            </Link>
          </div>

          <button 
            type="submit" 
            className={`login-button ${loading ? 'loading' : ''}`}
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>

          <div className="register-prompt">
            New to Blood Bank? 
            <Link to="/signup" className="register-link">
              Create an account
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
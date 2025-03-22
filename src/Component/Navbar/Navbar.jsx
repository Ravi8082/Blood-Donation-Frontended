import React, { useState, useEffect } from 'react';
import { Droplet } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isLoggedIn = sessionStorage.getItem('userEmail');
  const userRole = sessionStorage.getItem('role'); // Ensure correct key
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    sessionStorage.clear();
    navigate('/');
    window.location.reload();
  };

  // Determine brand link destination
  const brandLink = isLoggedIn
    ? userRole?.toUpperCase() === 'ADMIN'
      ? '/admin-dashboard'
      : '/dashboard'
    : '/';

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        <div className="navbar-content">
          <Link to={brandLink} className="navbar-brand">
            <div className="logo-container">
              <Droplet className="logo-icon" />
              <div className="brand-text">
                <span className="logo-text">LifeDrop</span>
                <span className="logo-subtitle">Blood Bank</span>
              </div>
            </div>
          </Link>

          <div className="navbar-links">
            {/* Show Home link only if user is not logged in */}
            {!isLoggedIn && (
              <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>
                Home
              </Link>
            )}

            {/* Dashboard link based on user role */}
            {isLoggedIn && (
              userRole?.toUpperCase() === 'ADMIN' ? (
                <Link to="/admin-dashboard" className={`nav-link ${location.pathname === '/admin-dashboard' ? 'active' : ''}`}>
                  Admin Dashboard
                </Link>
              ) : (
                <Link to="/dashboard" className={`nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`}>
                  Dashboard
                </Link>
              )
            )}

            {/* Logout button if user is logged in */}
            {isLoggedIn ? (
              <button onClick={handleLogout} className="auth-button logout">
                <span>Logout</span>
                <Droplet className="button-icon" />
              </button>
            ) : (
              <Link to="/login" className="auth-button login">
                <span>Login</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

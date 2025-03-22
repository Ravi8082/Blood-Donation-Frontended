import React from 'react';
import { Heart, Users, Clock, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();
  const isLoggedIn = sessionStorage.getItem('userEmail');

  const handleDonateClick = () => {
    if (isLoggedIn) {
      navigate('/userasdonor'); // Logged-in users ko donation form pe le jao
    } else {
      navigate('/login'); // Agar logged-in nahi hai to login page pe le jao
    }
  };

  return (
    <div className="home-container">
      {/* Hero Section */}
      <div 
        className="hero-section"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1615461066841-6116e61058f4?auto=format&fit=crop&q=80')",
          backgroundColor: "rgba(0, 0, 0, 0.5)"
        }}
      >
        <div className="hero-overlay">
          <div className="hero-content">
            <h1 className="hero-title">Every Drop Counts</h1>
            <p className="hero-subtitle">Your donation can save up to three lives</p>
            <button className="donate-button" onClick={handleDonateClick}>
              Donate Now
            </button>
          </div>
        </div>
      </div>

      {/* Why Donate Section */}
      <div className="why-donate-section">
        <div className="section-container">
          <h2 className="section-title">Why Donate Blood?</h2>
          <div className="features-grid">
            <div className="feature-item">
              <Heart className="feature-icon" />
              <h3 className="feature-title">Save Lives</h3>
              <p className="feature-description">One donation can save up to three lives</p>
            </div>
            <div className="feature-item">
              <Users className="feature-icon" />
              <h3 className="feature-title">Help Community</h3>
              <p className="feature-description">Support your local community's health needs</p>
            </div>
            <div className="feature-item">
              <Clock className="feature-icon" />
              <h3 className="feature-title">Quick Process</h3>
              <p className="feature-description">The donation process takes only 30-45 minutes</p>
            </div>
            <div className="feature-item">
              <Award className="feature-icon" />
              <h3 className="feature-title">Health Benefits</h3>
              <p className="feature-description">Regular donations promote good health</p>
            </div>
          </div>
        </div>
      </div>

      {/* Impact Statistics */}
      <div className="impact-section">
        <div className="section-container">
          <div className="stats-grid">
            <div>
              <h3 className="stat-number">38,000</h3>
              <p className="stat-label">Blood donations needed daily</p>
            </div>
            <div>
              <h3 className="stat-number">4.5M</h3>
              <p className="stat-label">Indian need blood yearly</p>
            </div>
            <div>
              <h3 className="stat-number">43,000</h3>
              <p className="stat-label">Pints donated daily</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

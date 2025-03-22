import React from 'react';
import { Droplet, Phone, Mail, MapPin, Heart, Users, Calendar, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <div className="footer-wrapper">
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-content">
            <div className="footer-section main-section">
              <div className="footer-logo">
                <Droplet className="footer-logo-icon" />
                <div className="logo-text-container">
                  <span className="footer-logo-text">LifeDrop</span>
                  <span className="footer-tagline">Saving Lives Together</span>
                </div>
              </div>
              <p className="footer-description">
                Dedicated to saving lives through voluntary blood donation, connecting donors with those in need.
              </p>
              <div className="footer-stats">
                <div className="stat-item">
                  <Users className="stat-icon" />
                  <div className="stat-text">
                    <span className="stat-number">1000+</span>
                    <span className="stat-label">Donors</span>
                  </div>
                </div>
                <div className="stat-item">
                  <Heart className="stat-icon" />
                  <div className="stat-text">
                    <span className="stat-number">500+</span>
                    <span className="stat-label">Lives Saved</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="footer-section">
              <h3 className="footer-heading">Quick Links</h3>
              <ul className="footer-list">
                <li><Link to="/about" className="footer-link">About Us</Link></li>
                <li><Link to="/eligibility" className="footer-link">Donation Eligibility</Link></li>
                <li><Link to="/locations" className="footer-link">Donation Centers</Link></li>
                <li><Link to="/faq" className="footer-link">FAQs</Link></li>
              </ul>
            </div>

            <div className="footer-section">
              <h3 className="footer-heading">Resources</h3>
              <ul className="footer-list">
                <li><Link to="/blog" className="footer-link">Blog</Link></li>
                <li><Link to="/stories" className="footer-link">Donor Stories</Link></li>
                <li><Link to="/privacy" className="footer-link">Privacy Policy</Link></li>
                <li><Link to="/terms" className="footer-link">Terms of Service</Link></li>
              </ul>
            </div>

            <div className="footer-section contact-section">
              <h3 className="footer-heading">Contact Us</h3>
              <ul className="footer-list contact-list">
                <li className="contact-item">
                  <MapPin className="contact-icon" />
                  <span>Mewar University Chhitorgarh Rajasthan 3129001</span>
                </li>
                <li className="contact-item">
                  <Phone className="contact-icon" />
                  <span>8052696360</span>
                </li>
                <li className="contact-item">
                  <Mail className="contact-icon" />
                  <span>Palravi1093@gmail.com</span>
                </li>
                <li className="contact-item">
                  <Clock className="contact-icon" />
                  <span>24/7 Emergency Service</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom">
            <div className="footer-bottom-content">
              <p className="copyright">
                © {new Date().getFullYear()} LifeDrop. Made with <Heart className="heart-icon" /> for humanity
              </p>
              <div className="bottom-links">
                <Link to="/privacy" className="footer-link">Privacy</Link>
                <Link to="/terms" className="footer-link">Terms</Link>
                <Link to="/contact" className="footer-link">Contact</Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaTint, FaUsers, FaPaperPlane, FaHeart, FaList, FaUser, FaCartPlus, FaInfoCircle, FaBars, FaPlus, FaClock, FaBolt } from 'react-icons/fa';
import "./UserDashboard.css";

const UserDashboard = () => {
  const navigate = useNavigate();
  const [loggedUser, setLoggedUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [totalDonors, setTotalDonors] = useState(0);
  const [totalRequests, setTotalRequests] = useState(0);
  const [donationCount, setDonationCount] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalBloodGroups, setTotalBloodGroups] = useState(0);
  const [totalUnits, setTotalUnits] = useState(0);
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [showDonationInfo, setShowDonationInfo] = useState(false);

  useEffect(() => {
    const user = sessionStorage.getItem("userEmail");
    if (user) {
      setLoggedUser(user);
      fetchDashboardData(user);
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const fetchDashboardData = async (user) => {
    try {
      setLoading(true);
      const { data: donorsCount } = await axios.get("http://localhost:8082"/getTotalDonors");
      setTotalDonors(donorsCount);

      const { data: requestsCount } = await axios.get(`http://localhost:8082"/requestHistory/${user}`);
      setTotalRequests(requestsCount.length);

      const { data: donationsCount } = await axios.get(`http://localhost:8082"/donationsCount/${user}`);
      setDonationCount(donationsCount);

      const { data: usersCount } = await axios.get("http://localhost:8082"/getTotalUsers");
      setTotalUsers(usersCount);

      const { data: bloodGroupsCount } = await axios.get("http://localhost:8082"/bloodDetails");
      setTotalBloodGroups(bloodGroupsCount.length);

      let totalBloodUnits = bloodGroupsCount.reduce((acc, group) => acc + group.units, 0);
      setTotalUnits(totalBloodUnits);
    } catch (error) {
      console.error("Error fetching dashboard data", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="blood-drop-container">
          <div className="pulse-ring"></div>
          <FaTint className="loading-icon" />
        </div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <button className="toggle-sidebar" onClick={() => setSidebarOpen(!isSidebarOpen)}>
        <FaBars />
      </button>

      <div className={`sidebar ${!isSidebarOpen ? "collapsed" : ""}`}>
        <div className="sidebar-header">
          <h3><FaTint className="header-icon" /> </h3>
          <p>Welcome, {loggedUser}</p>
        </div>
        <ul className="sidebar-menu">
          <li onClick={() => navigate("/requestblood")}><FaPlus /> Make Request</li>
          <li onClick={() => navigate("/requesthistoryfromuser")}><FaPaperPlane /> Request History</li>
          <li onClick={() => navigate("/userasdonor")}><FaHeart /> Donate Blood</li>
          <li onClick={() => navigate("/donorlist")}><FaList /> Available Donors</li>
          <li onClick={() => navigate("/userprofile")}><FaUser /> Edit Profile</li>
          <li onClick={() => navigate("/bloodStock")}><FaCartPlus /> Blood Stock</li>
        </ul>
        <button className="why-donate-btn" onClick={() => setShowDonationInfo(!showDonationInfo)}>
          <FaInfoCircle /> Learn About Blood Donation
        </button>
      </div>

      <div className={`dashboard-content ${!isSidebarOpen ? "expanded" : ""}`}>
        {!showDonationInfo ? (
          <div className="stats-container">
            <h2><FaTint className="title-icon" /> Welcome to Blood Bank Management</h2>
            <div className="dashboard-stats">
              <div className="stat-card">
                <FaUsers className="stat-icon" />
                <div className="stat-info">
                  <h3>Total Donors</h3>
                  <span>{totalDonors}</span>
                </div>
              </div>
              <div className="stat-card">
                <FaPaperPlane className="stat-icon" />
                <div className="stat-info">
                  <h3>Your Requests</h3>
                  <span>{totalRequests}</span>
                </div>
              </div>
              <div className="stat-card">
                <FaHeart className="stat-icon" />
                <div className="stat-info">
                  <h3>Your Donations</h3>
                  <span>{donationCount}</span>
                </div>
              </div>
              <div className="stat-card">
                <FaUsers className="stat-icon" />
                <div className="stat-info">
                  <h3>Total Users</h3>
                  <span>{totalUsers}</span>
                </div>
              </div>
              <div className="stat-card">
                <FaTint className="stat-icon" />
                <div className="stat-info">
                  <h3>Blood Groups</h3>
                  <span>{totalBloodGroups}</span>
                </div>
              </div>
              <div className="stat-card">
                <FaCartPlus className="stat-icon" />
                <div className="stat-info">
                  <h3>Available Units</h3>
                  <span>{totalUnits} ml</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="donation-info">
            <h2><FaHeart className="title-icon" /> Why Should You Donate Blood?</h2>
            
            <div className="blood-donation-hero">
              <div className="hero-content">
                <h3>Your Donation Can Save Lives</h3>
                <p>Every 2 seconds, someone in the world needs blood. A single donation can save up to 3 lives.</p>
                <div className="blood-drop-animation"></div>
              </div>
            </div>
            
            <div className="info-grid">
              <div className="info-card">
                <div className="card-icon-container">
                  <FaHeart className="card-icon" />
                </div>
                <h3>Save Lives</h3>
                <p>One donation can save up to three lives. Your blood donation can help accident victims, surgery patients, and those fighting serious illnesses.</p>
              </div>
              <div className="info-card">
                <div className="card-icon-container">
                  <FaUser className="card-icon" />
                </div>
                <h3>Health Benefits</h3>
                <p>Regular blood donation can reduce the risk of heart disease and help maintain healthy iron levels in your body.</p>
              </div>
              <div className="info-card">
                <div className="card-icon-container">
                  <FaClock className="card-icon" />
                </div>
                <h3>Quick & Easy Process</h3>
                <p>The donation process takes only about 10-15 minutes, while the entire visit takes about an hour.</p>
              </div>
            </div>
            
            <div className="donation-steps">
              <h3><FaList className="steps-icon" /> Blood Donation Process</h3>
              <div className="steps-container">
                <div className="step">
                  <div className="step-number">1</div>
                  <div className="step-content">Registration and basic health check</div>
                </div>
                <div className="step">
                  <div className="step-number">2</div>
                  <div className="step-content">Medical history review</div>
                </div>
                <div className="step">
                  <div className="step-number">3</div>
                  <div className="step-content">Quick physical examination</div>
                </div>
                <div className="step">
                  <div className="step-number">4</div>
                  <div className="step-content">Blood donation (8-10 minutes)</div>
                </div>
                <div className="step">
                  <div className="step-number">5</div>
                  <div className="step-content">Rest and refreshments</div>
                </div>
              </div>
            </div>
            
            <div className="donation-facts">
              <h4>Did You Know?</h4>
              <ul>
                <li>Blood cannot be manufactured – it can only come from generous donors.</li>
                <li>The average adult has about 10 pints of blood in their body.</li>
                <li>A healthy donor may donate red blood cells every 56 days.</li>
                <li>The most common blood type is O+, while AB- is the rarest.</li>
                <li>After donating blood, your body replaces the fluid within 24 hours.</li>
              </ul>
            </div>
            
            <div className="quick-actions">
              <h3><FaBolt /> Ready to Make a Difference?</h3>
              <div className="action-buttons">
                <button className="action-btn donate-btn" onClick={() => navigate("/userasdonor")}>
                  <FaHeart /> Donate Now
                </button>
                <button className="action-btn request-btn" onClick={() => navigate("/requestblood")}>
                  <FaPlus /> Request Blood
                </button>
                <button className="action-btn stock-btn" onClick={() => navigate("/bloodStock")}>
                  <FaCartPlus /> Check Stock
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;

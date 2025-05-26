import React, { useEffect, useState } from "react";
import { FaTint, FaExclamationCircle, FaRedoAlt, FaHeart } from 'react-icons/fa';
import "./Bloodstock.css";

const Bloodstock = () => {
  const [bloodDetails, setBloodDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBloodDetails();
  }, []);

  const fetchBloodDetails = async () => {
    try {
      const response = await fetch("http://localhost:8082"/bloodDetails");
      if (!response.ok) throw new Error("Failed to fetch blood stock data");
      const data = await response.json();
      setBloodDetails(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getStockStatus = (units) => {
    if (units <= 0) return 'critical';
    if (units <= 5) return 'low';
    if (units <= 10) return 'moderate';
    return 'good';
  };

  if (loading) {
    return (
      <div className="loading-container4">
        <div className="heart-beat-loader4">
          <FaHeart />
        </div>
        <p>Loading blood stock information...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container4">
        <FaExclamationCircle className="error-icon4" />
        <h2>Oops! Something went wrong</h2>
        <p>{error}</p>
        <button onClick={fetchBloodDetails} className="retry-btn4">
          <FaRedoAlt /> Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="bloodstock-container4">
      <div className="bloodstock-header4">
        <FaTint className="header-icon4" />
        <h1>Blood Bank Inventory</h1>
      </div>
      
      <div className="blood-grid4">
        {bloodDetails.map((blood, index) => (
          <div key={index} className={`blood-card4 ${getStockStatus(blood.units)}`}>
            <div className="blood-type-badge4">
              <span>{blood.bloodgroup}</span>
            </div>
            
            <div className="stock-level4">
              <div className="level-indicator4">
                <div 
                  className="level-fill4" 
                  style={{ height: `${Math.min((blood.units / 20) * 100, 100)}%` }}
                ></div>
              </div>
              <div className="units-info4">
                <span className="units-number4">{blood.units}</span>
                <span className="units-label4">Units Available</span>
              </div>
            </div>

            <div className="stock-status4">
              <span className={`status-indicator4 ${getStockStatus(blood.units)}`}>
                {getStockStatus(blood.units) === 'critical' && 'Critical Level'}
                {getStockStatus(blood.units) === 'low' && 'Low Stock'}
                {getStockStatus(blood.units) === 'moderate' && 'Moderate'}
                {getStockStatus(blood.units) === 'good' && 'Well Stocked'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Bloodstock;

import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaUser, FaCheckCircle, FaTimesCircle, FaClock, FaTint, FaSearch, FaSync } from 'react-icons/fa';
import maleAvatar from '../../assets/img/male.png';
import femaleAvatar from '../../assets/img/female.png';
import "./RequestHistory.css";

const RequestHistory = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    reloadData();
  }, []);

  const reloadData = async () => {
    try {
      setLoading(true);
      setIsRefreshing(true);
      const response = await axios.get("http://localhost:8082/requestHistory");
      setRequests(response.data);
    } catch (error) {
      console.error("Error fetching data", error);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  const updateRequestStatus = async (email, status) => {
    try {
      const endpoint = status === "approve" ? `/acceptstatus/${email}` : `/rejectstatus/${email}`;
      await axios.get(`http://localhost:8082${endpoint}`);

      setRequests(prevRequests =>
        prevRequests.map(request =>
          request.email === email
            ? { ...request, status: status === "approve" ? "Approved" : "Rejected" }
            : request
        )
      );
    } catch (error) {
      console.error("Error updating status", error);
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case "Approved": return <FaCheckCircle className="status-icon approved" />;
      case "Rejected": return <FaTimesCircle className="status-icon rejected" />;
      default: return <FaClock className="status-icon pending" />;
    }
  };

  const getProfileImage = (gender) => {
    const genderLower = gender?.toLowerCase();
    return {
      src: genderLower === "male" ? maleAvatar : femaleAvatar,
      alt: `${genderLower === "male" ? "Male" : "Female"} Donor Profile`
    };
  };

  const filteredRequests = requests.filter(request =>
    request.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.bloodgroup?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="request-history-page">
      <div className="page-header">
        <div className="header-content">
          <FaTint className="header-icon" />
          <h1>Blood Request History</h1>
        </div>
        <div className="header-actions">
          <div className="search-box2">
            <FaSearch className="search-icon2" />
            <input
              type="text"
              placeholder="Search by name, email or blood group..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button 
            className={`refresh-btn ${isRefreshing ? 'refreshing' : ''}`} 
            onClick={reloadData}
            disabled={isRefreshing}
          >
            <FaSync className={`refresh-icon ${isRefreshing ? 'spinning' : ''}`} />
            <span>{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
          </button>
        </div>
      </div>

      <div className="requests-container">
        {loading ? (
          <div className="loading-state">
            <div className="loader"></div>
            <p>Loading requests...</p>
          </div>
        ) : filteredRequests.length > 0 ? (
          <div className="requests-grid">
            {filteredRequests.map((request, index) => (
              <div key={index} className="request-card">
                <div className="card-header">
                  <div className="profile-section">
                    <div className="profile-image-wrapper">
                      <img
                        {...getProfileImage(request.gender)}
                        className="profile-image"
                      />
                      <span className="blood-group-badge">
                        {request.bloodgroup || "?"}
                      </span>
                    </div>
                    <div className="profile-info">
                      <h3>{request.name || "N/A"}</h3>
                      <p>{request.mobile || "N/A"}</p>
                    </div>
                  </div>
                  <div className={`status-badge ${request.status?.toLowerCase() || 'pending'}`}>
                    {getStatusIcon(request.status)}
                    <span>{request.status || "Pending"}</span>
                  </div>
                </div>

                <div className="card-body">
                  <div className="info-grid">
                    <div className="info-item">
                      <span className="label">Age</span>
                      <span className="value">{request.age ? `${request.age} years` : "N/A"}</span>
                    </div>
                    <div className="info-item">
                      <span className="label">Gender</span>
                      <span className="value">{request.gender || "N/A"}</span>
                    </div>
                    <div className="info-item">
                      <span className="label">Units Required</span>
                      <span className="value">{request.units ? `${request.units} units` : "N/A"}</span>
                    </div>
                    <div className="info-item">
                      <span className="label">Email</span>
                      <span className="value email">{request.email || "N/A"}</span>
                    </div>
                  </div>

                  <div className="disease-info">
                    <span className="label">Medical Condition:</span>
                    <span className="value">{request.disease || "N/A"}</span>
                  </div>

                  {(!request.status || request.status === "Pending") && (
                    <div className="action-buttons">
                      <button
                        className="approve-btn"
                        onClick={() => updateRequestStatus(request.email, "approve")}
                      >
                        <FaCheckCircle /> Approve
                      </button>
                      <button
                        className="reject-btn"
                        onClick={() => updateRequestStatus(request.email, "reject")}
                      >
                        <FaTimesCircle /> Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-requests">
            <FaTint className="empty-icon" />
            <h3>No Requests Found</h3>
            <p>There are currently no blood requests in the system.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RequestHistory;
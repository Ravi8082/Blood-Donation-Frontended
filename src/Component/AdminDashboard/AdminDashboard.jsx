import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const [bloodDetails, setBloodDetails] = useState([]);
  const [donors, setDonors] = useState([]);
  const [requests, setRequests] = useState([]);
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({
    totalDonors: 0,
    totalRequests: 0,
    totalUsers: 0,
    totalBloodUnits: 0,
    totalBloodGroups: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [showInventoryInfo, setShowInventoryInfo] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = () => {
      const role = sessionStorage.getItem("role");
      const token = sessionStorage.getItem("token");

      if (role !== "ADMIN" || !token) {
        alert("Unauthorized Access! Redirecting to login.");
        navigate("/login");
        return false;
      }
      return true;
    };

    if (checkAuth()) {
      fetchDashboardData();
    }
  }, [navigate]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch all required data
      const [donorRes, requestRes, userRes, bloodRes] = await Promise.all([
        axios.get("http://localhost:8082/donorlist"),
        axios.get("http://localhost:8082/requestHistory"),
        axios.get("http://localhost:8082/userlist"),
        axios.get("http://localhost:8082/bloodDetails"),
      ]);

      // Set state for lists
      setDonors(donorRes.data);
      setRequests(requestRes.data);
      setUsers(userRes.data);
      setBloodDetails(bloodRes.data);

      // Calculate statistics manually
      const totalBloodGroups = bloodRes.data.length;
      const totalBloodUnits = bloodRes.data.reduce((acc, item) => acc + item.units, 0);

      setStats({
        totalDonors: donorRes.data.length,
        totalRequests: requestRes.data.length,
        totalUsers: userRes.data.length,
        totalBloodGroups,
        totalBloodUnits,
      });

    } catch (err) {
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const handleMenuClick = (path) => {
    setActiveTab(path);
    navigate(`/${path}`);
  };
  
  const handleLogout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("role");
    sessionStorage.removeItem("name");
    navigate("/login");
  };

  if (loading) return (
    <div className="loading-container999">
      <div className="blood-drop-loader999">
        <div className="drop999"></div>
        <div className="wave999"></div>
      </div>
      <p>Loading dashboard data...</p>
    </div>
  );

  return (
    <div className="dashboard-container999">
      <button className="toggle-sidebar999" onClick={() => setSidebarOpen(!isSidebarOpen)}>
        <i className="fa fa-bars999"></i>
      </button>

      <div className={`sidebar999 ${!isSidebarOpen ? 'collapsed' : ''}`}>
        <div className="sidebar-toggle-btn" onClick={() => setSidebarOpen(!isSidebarOpen)}>
          <i className={`fas fa-chevron-${isSidebarOpen ? 'left' : 'right'}`}></i>
        </div>
        
        <div className="sidebar-header999">
          <div className="logo-container999">
            <i className="fas fa-heartbeat pulse999"></i>
            <div className="logo-text999">
              <h3>Blood Bank</h3>
            </div>
          </div>
          <div className="admin-info999">
            <div className="admin-avatar999">
              <i className="fas fa-user-circle"></i>
            </div>
            <p>Welcome, {sessionStorage.getItem("name")}</p>
          </div>
        </div>
        
        <ul className="sidebar-menu999">
          <li className={activeTab === 'addDonor' ? 'active' : ''} onClick={() => handleMenuClick("addDonor")}>
            <i className="fas fa-user-plus"></i> 
            <span>Add Donor</span>
          </li>
          <li className={activeTab === 'donorlist' ? 'active' : ''} onClick={() => handleMenuClick("donorlist")}>
            <i className="fas fa-users"></i> 
            <span>Donor List</span>
          </li>
          <li className={activeTab === 'bloodStock' ? 'active' : ''} onClick={() => handleMenuClick("bloodStock")}>
            <i className="fa fa-tint"></i> 
            <span>Blood Stock</span>
          </li>
          <li className={activeTab === 'requesthistory' ? 'active' : ''} onClick={() => handleMenuClick("requesthistory")}>
            <i className="fa fa-history"></i> 
            <span>Request History</span>
          </li>
          <li className={activeTab === 'userlist' ? 'active' : ''} onClick={() => handleMenuClick("userlist")}>
            <i className="fa fa-user-cog"></i> 
            <span>Manage Users</span>
          </li>
        </ul>
        
        <div className="sidebar-footer999">
          <button className="info-btn999" onClick={() => setShowInventoryInfo(!showInventoryInfo)}>
            <i className="fa fa-info-circle"></i> 
            <span>{showInventoryInfo ? 'Show Dashboard' : 'Blood Bank Info'}</span>
          </button>
        </div>
      </div>

      <div className={`dashboard-content999 ${!isSidebarOpen ? 'expanded' : ''}`}>
        {!showInventoryInfo ? (
          <div className="stats-container999">
            <div className="welcome-banner999">
              <h2>Blood Bank Management System</h2>
              <p>Monitor and manage blood donation activities</p>
            </div>
            
            <div className="dashboard-stats999">
              <div className="stat-card999">
                <div className="stat-icon-container999">
                  <i className="fa fa-users stat-icon999"></i>
                </div>
                <div className="stat-info999">
                  <h3>Total Donors</h3>
                  <span>{stats.totalDonors}</span>
                </div>
              </div>
              <div className="stat-card999">
                <div className="stat-icon-container999">
                  <i className="fa fa-paper-plane stat-icon999"></i>
                </div>
                <div className="stat-info999">
                  <h3>Total Requests</h3>
                  <span>{stats.totalRequests}</span>
                </div>
              </div>
              <div className="stat-card999">
                <div className="stat-icon-container999">
                  <i className="fa fa-users stat-icon999"></i>
                </div>
                <div className="stat-info999">
                  <h3>Total Users</h3>
                  <span>{stats.totalUsers}</span>
                </div>
              </div>
              <div className="stat-card999">
                <div className="stat-icon-container999">
                  <i className="fa fa-tint stat-icon999"></i>
                </div>
                <div className="stat-info999">
                  <h3>Blood Groups</h3>
                  <span>{stats.totalBloodGroups}</span>
                </div>
              </div>
              <div className="stat-card999">
                <div className="stat-icon-container999">
                  <i className="fa fa-flask stat-icon999"></i>
                </div>
                <div className="stat-info999">
                  <h3>Total Units</h3>
                  <span>{stats.totalBloodUnits} ml</span>
                </div>
              </div>
            </div>
            
            <div className="recent-activity999">
              <h3>Recent Activity</h3>
              <div className="activity-list999">
                {requests.slice(0, 5).map((request, index) => (
                  <div key={index} className="activity-item999">
                    <div className="activity-icon999">
                      <i className="fa fa-bell"></i>
                    </div>
                    <div className="activity-details999">
                      <p>Blood request for {request.bloodGroup || 'Unknown'} group</p>
                      <span className="activity-time999">
                        {new Date(request.date || Date.now()).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="inventory-info999">
            <h2>Blood Bank Inventory Status</h2>
            <div className="blood-chart-container999">
              <div className="blood-levels999">
                {bloodDetails.map((blood) => (
                  <div key={blood.bloodGroup} className="blood-level-item999">
                    <div className="blood-tube999">
                      <div 
                        className="blood-fill999" 
                        style={{ height: `${Math.min(100, (blood.units / 100) * 100)}%` }}
                      ></div>
                    </div>
                    <div className="blood-label999">{blood.bloodGroup}</div>
                    <div className="blood-amount999">{blood.units} units</div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="blood-grid999">
              {bloodDetails.map((blood) => (
                <div 
                  key={blood.bloodGroup} 
                  className={`blood-info-card999 ${blood.units < 10 ? 'critical' : blood.units < 20 ? 'warning' : 'healthy'}`}
                >
                  <div className="blood-card-header999">
                    <h3>{blood.bloodGroup}</h3>
                    <i className="fa fa-tint"></i>
                  </div>
                  <div className="blood-card-body999">
                    <div className="units-display999">
                      <span className="units-number999">{blood.units}</span>
                      <span className="units-label999">Units Available</span>
                    </div>
                    <div className="progress-bar999">
                      <div 
                        className="progress-fill999" 
                        style={{ width: `${Math.min(100, (blood.units / 100) * 100)}%` }}
                      ></div>
                    </div>
                    <div className="stock-status999">
                      Status: 
                      {blood.units < 10 ? (
                        <span className="status-critical999"> Critical</span>
                      ) : blood.units < 20 ? (
                        <span className="status-warning999"> Warning</span>
                      ) : (
                        <span className="status-healthy999"> Sufficient</span>
                      )}
                    </div>
                    <div className="blood-card-footer999">
                      <p>Can save up to {blood.units * 3} lives</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;

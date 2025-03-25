import React, { useEffect, useState } from "react";
import axios from "axios";
import { Droplet, Search, Filter, RefreshCw } from "lucide-react";
import "./RequestHistoryUser.css";

const RequestHistoryUser = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const userEmail = "palravi1093@gmail.com";
      const response = await axios.get(`https://blood-donation-backend-19.onrender.com/requestHistory?email=${userEmail}`);
      // If status is empty/null, default to "Pending"
      const updatedRequests = response.data.map((request) => ({
        ...request,
        status: request.status ? request.status : "Pending",
      }));
      setRequests(updatedRequests);
    } catch (error) {
      console.error("Error fetching request history:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredRequests = requests.filter((request) => {
    const matchesSearch = Object.values(request).some((value) =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );
    const matchesFilter = filter === "all" || request.status.toLowerCase() === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="request-history-container12">
      <div className="header-section12">
        <div className="header-left12">
          <Droplet className="header-icon12" />
          <h1 className="page-title12">Blood Request History</h1>
        </div>

        <div className="controls-section12">
          <div className="search-box12">
            <Search className="search-icon12" />
            <input
              type="text"
              placeholder="Search requests..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="filter-box12">
            <Filter className="filter-icon12" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Status</option>
              <option value="accept">Approved</option>
              <option value="pending">Pending</option>
              <option value="reject">Rejected</option>
            </select>
          </div>

          <button className="refresh-btn12" onClick={fetchData}>
            <RefreshCw size={18} />
          </button>
        </div>
      </div>

      <div className="request-table-container12">
        {loading ? (
          <div className="loading-state12">
            <div className="loader12"></div>
            <p>Loading request history...</p>
          </div>
        ) : filteredRequests.length > 0 ? (
          <div className="table-responsive">
            <table className="request-table">
              <thead>
                <tr>
                  <th>Request ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Blood Group</th>
                  <th>Units</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredRequests.map((request) => (
                  <tr key={request.id} className="table-row12">
                    <td>#{request.id}</td>
                    <td>{request.name}</td>
                    <td>{request.email}</td>
                    <td>
                      <span className="blood-group12">
                        <Droplet size={14} />
                        {request.bloodgroup}
                      </span>
                    </td>
                    <td>{request.units} units</td>
                    <td>
                      <span className={`status-badge12 ${request.status.toLowerCase()}`}>
                        {request.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="no-requests12">
            <Droplet size={48} className="empty-icon12" />
            <h3>No Requests Found</h3>
            <p>There are no blood requests matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RequestHistoryUser;

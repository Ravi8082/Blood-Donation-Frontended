import React, { useState, useEffect } from "react";
import axios from "axios";
import "./DonorList.css";
import { FaSearch, FaUser, FaMapMarkerAlt, FaPhone } from 'react-icons/fa';

const DonorList = () => {
  const [bloodgroup, setBloodgroup] = useState("");
  const [donors, setDonors] = useState([]);
  const [filteredDonors, setFilteredDonors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDonors();
  }, []);

  const fetchDonors = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:8082"/donorlist");
      if (Array.isArray(response.data)) {
        setDonors(response.data);
        setFilteredDonors(response.data);
      } else {
        setDonors([]);
        setFilteredDonors([]);
      }
    } catch (error) {
      console.error("Error fetching donors:", error);
      setDonors([]);
      setFilteredDonors([]);
    } finally {
      setLoading(false);
    }
  };

  const search = (e) => {
    const searchValue = e.target.value.toLowerCase();
    setBloodgroup(searchValue);

    if (searchValue === "") {
      setFilteredDonors(donors);
    } else {
      const filtered = donors.filter(
        (donor) => donor.bloodgroup?.toLowerCase().includes(searchValue)
      );
      setFilteredDonors(filtered);
    }
  };

  return (
    <div className="donor-list-container1">
      <div className="donor-list-header1">
        <h1>Blood Donors Directory</h1>
        <div className="search-box1">
          <FaSearch className="search-icon1" />
          <input
            type="text"
            placeholder="Search by blood group..."
            value={bloodgroup}
            onChange={search}
          />
        </div>
      </div>

      <div className="donors-grid1">
        {loading ? (
          <div className="loading-spinner1">
            <div className="spinner"></div>
            <p>Loading donors...</p>
          </div>
        ) : filteredDonors.length > 0 ? (
          filteredDonors.map((donor, index) => (
            <div key={index} className="donor-card1">
              <div className="blood-group-badge1">{donor.bloodgroup || "N/A"}</div>
              <div className="donor-info1">
                <h3><FaUser className="info-icon1" /> {donor.name || "Unknown Name"}</h3>
                <p><FaPhone className="info-icon1" /> {donor.mobile || "N/A"}</p>
                {donor.city && (
                  <p><FaMapMarkerAlt className="info-icon1" /> {donor.city}</p>
                )}
                {donor.age && (
                  <p className="age">Age: {donor.age} years</p>
                )}
                {donor.date && (
                  <p className="donation-date1">Last Donation: {new Date(donor.date).toLocaleDateString()}</p>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="no-donors1">
            <p>No donors found matching your search.</p>
            <small>Try searching for a different blood group</small>
          </div>
        )}
      </div>
    </div>
  );
};

export default DonorList;

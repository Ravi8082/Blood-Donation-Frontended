import React, { useState } from "react";
import axios from "axios";
import { FaUser, FaPhone, FaTint, FaCalendar, FaMapMarkerAlt, FaCheck, FaTimes, FaVenusMars } from 'react-icons/fa';
import "./AddDonor.css";

const AddDonor = () => {
  const [donor, setDonor] = useState({
    name: "",
    mobile: "",
    age: "",
    bloodgroup: "",
    gender: "",
    address: "",
    city: "",
    date: "",
    units: "",
  });

  const [touched, setTouched] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleBlur = (field) => {
    setTouched({ ...touched, [field]: true });
  };

  const getFieldError = (field) => {
    if (!touched[field] && !submitted) return "";

    switch (field) {
      case "name":
        if (!donor.name.trim()) return "Name is required";
        if (donor.name.length < 3) return "Name must be at least 3 characters";
        if (!/^[a-zA-Z\s]+$/.test(donor.name)) return "Name should only contain letters";
        break;
      case "mobile":
        if (!donor.mobile) return "Mobile number is required";
        if (!/^\d{10}$/.test(donor.mobile)) return "Enter valid 10-digit mobile number";
        break;
      case "age":
        if (!donor.age) return "Age is required";
        if (donor.age < 18 || donor.age > 65) return "Age must be between 18 and 65";
        break;
      case "bloodgroup":
        if (!donor.bloodgroup) return "Blood group is required";
        break;
      case "gender":
        if (!donor.gender) return "Gender is required";
        break;
      case "date":
        if (!donor.date) return "Please select when you would like to donate blood";
        const selectedDate = new Date(donor.date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (selectedDate <= today) return "Please select a future date for donation";
        break;
      case "units":
        if (!donor.units) return "Units is required";
        if (donor.units < 1) return "Units must be at least 1";
        if (donor.units > 5) return "Maximum 5 units allowed";
        break;
      case "address":
        if (!donor.address.trim()) return "Address is required";
        if (donor.address.length < 10) return "Please enter complete address";
        break;
      case "city":
        if (!donor.city.trim()) return "City is required";
        if (!/^[a-zA-Z\s]+$/.test(donor.city)) return "City should only contain letters";
        break;
      default:
        return "";
    }
    return "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDonor({ ...donor, [name]: value });
    setError(null);
    setSuccess(false);
  };

  const isFormValid = () => {
    const errors = [
      "name", "mobile", "age", "bloodgroup", "gender", "date", "units", "address", "city"
    ].map(field => getFieldError(field));
    return errors.every(error => !error);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    
    if (!isFormValid()) {
      setError("Please correct all errors before submitting");
      return;
    }

    try {
      const formattedDate = new Date(donor.date).toISOString().split("T")[0];
      const response = await axios.post(
        "https://blood-donation-backend-19.onrender.com/addDonor",
        {
          ...donor,
          age: parseInt(donor.age),
          units: parseInt(donor.units),
          date: formattedDate,
        },
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.status === 201 || response.status === 200) {
        setSuccess(true);
        setDonor({
          name: "",
          mobile: "",
          age: "",
          bloodgroup: "",
          gender: "",
          address: "",
          city: "",
          date: "",
          units: "",
        });
        setSubmitted(false);
        setTouched({});
        setError(null);
      }
    } catch (error) {
      setError(error.response?.data?.message || "Error adding donor. Please try again.");
      console.error("Error:", error);
    }
  };

  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  return (
    <div className="add-donor-container6">
      <div className="form-header6">
        <div className="blood-drop6">
          <FaTint />
        </div>
        <h2>Blood Donation Registration</h2>
        <p>Every drop counts, be a hero today</p>
      </div>

      <div className="add-donor-form6">
        {error && (
          <div className="error-banner6">
            <FaTimes className="banner-icon6" />
            {error}
          </div>
        )}
        
        {success && (
          <div className="success-banner6">
            <FaCheck className="banner-icon6" />
            Donor added successfully!
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-section6">
            <h3>Personal Details</h3>
            
            <div className="form-field6">
              <div className="input-group6">
                <FaUser className="field-icon6" />
                <input
                  type="text"
                  name="name"
                  value={donor.name}
                  onChange={handleChange}
                  onBlur={() => handleBlur("name")}
                  placeholder="Full Name *"
                  className={getFieldError("name") ? "error" : ""}
                />
              </div>
              {getFieldError("name") && (
                <span className="error-text6">{getFieldError("name")}</span>
              )}
            </div>

            <div className="form-field6">
              <div className="input-group6">
                <FaPhone className="field-icon6" />
                <input
                  type="tel"
                  name="mobile"
                  value={donor.mobile}
                  onChange={handleChange}
                  onBlur={() => handleBlur("mobile")}
                  placeholder="Mobile Number *"
                  maxLength="10"
                  className={getFieldError("mobile") ? "error" : ""}
                />
              </div>
              {getFieldError("mobile") && (
                <span className="error-text6">{getFieldError("mobile")}</span>
              )}
            </div>

            <div className="form-field6">
              <div className="input-group6">
                <FaUser className="field-icon6" />
                <input
                  type="number"
                  name="age"
                  value={donor.age}
                  onChange={handleChange}
                  onBlur={() => handleBlur("age")}
                  placeholder="Age (18-65) *"
                  min="18"
                  max="65"
                  className={getFieldError("age") ? "error" : ""}
                />
              </div>
              {getFieldError("age") && (
                <span className="error-text6">{getFieldError("age")}</span>
              )}
            </div>

            <div className="form-field6">
              <div className="input-group6">
                <FaTint className="field-icon6" />
                <select
                  name="bloodgroup"
                  value={donor.bloodgroup}
                  onChange={handleChange}
                  onBlur={() => handleBlur("bloodgroup")}
                  className={getFieldError("bloodgroup") ? "error" : ""}
                >
                  <option value="">Select Blood Group *</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                </select>
              </div>
              {getFieldError("bloodgroup") && (
                <span className="error-text6">{getFieldError("bloodgroup")}</span>
              )}
            </div>

            <div className="form-field6">
              <div className="gender-group6">
                <FaVenusMars className="field-icon6" />
                <div className="gender-options6">
                  <label className="gender-option6">
                    <input
                      type="radio"
                      name="gender"
                      value="Male"
                      checked={donor.gender === "Male"}
                      onChange={handleChange}
                      onBlur={() => handleBlur("gender")}
                    />
                    <span>Male</span>
                  </label>
                  <label className="gender-option6">
                    <input
                      type="radio"
                      name="gender"
                      value="Female"
                      checked={donor.gender === "Female"}
                      onChange={handleChange}
                      onBlur={() => handleBlur("gender")}
                    />
                    <span>Female</span>
                  </label>
                </div>
              </div>
              {getFieldError("gender") && (
                <span className="error-text6">{getFieldError("gender")}</span>
              )}
            </div>
          </div>

          <div className="form-section6">
            <h3>Donation Details</h3>

            <div className="form-field6">
              <div className="input-group6">
                <FaCalendar className="field-icon6" />
                <input
                  type="date"
                  name="date"
                  value={donor.date}
                  onChange={handleChange}
                  onBlur={() => handleBlur("date")}
                  min={getTomorrowDate()}
                  className={getFieldError("date") ? "error" : ""}
                />
              </div>
              <div className="date-label6">
                When would you like to donate blood?
              </div>
              {getFieldError("date") && (
                <span className="error-text6">{getFieldError("date")}</span>
              )}
            </div>

            <div className="form-field6">
              <div className="input-group6">
                <FaTint className="field-icon6" />
                <input
                  type="number"
                  name="units"
                  value={donor.units}
                  onChange={handleChange}
                  onBlur={() => handleBlur("units")}
                  placeholder="Units (1-5) *"
                  min="1"
                  max="5"
                  className={getFieldError("units") ? "error" : ""}
                />
              </div>
              {getFieldError("units") && (
                <span className="error-text6">{getFieldError("units")}</span>
              )}
            </div>
          </div>

          <div className="form-section6">
            <h3>Contact Information</h3>

            <div className="form-field6">
              <div className="input-group6">
                <FaMapMarkerAlt className="field-icon6" />
                <textarea
                  name="address"
                  value={donor.address}
                  onChange={handleChange}
                  onBlur={() => handleBlur("address")}
                  placeholder="Full Address *"
                  rows="3"
                  className={getFieldError("address") ? "error" : ""}
                />
              </div>
              {getFieldError("address") && (
                <span className="error-text6">{getFieldError("address")}</span>
              )}
            </div>

            <div className="form-field6">
              <div className="input-group6">
                <FaMapMarkerAlt className="field-icon6" />
                <input
                  type="text"
                  name="city"
                  value={donor.city}
                  onChange={handleChange}
                  onBlur={() => handleBlur("city")}
                  placeholder="City *"
                  className={getFieldError("city") ? "error" : ""}
                />
              </div>
              {getFieldError("city") && (
                <span className="error-text6">{getFieldError("city")}</span>
              )}
            </div>
          </div>

          <button type="submit" className="submit-button">
            <FaTint className="button-icon6" />
            Register Donation
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddDonor;

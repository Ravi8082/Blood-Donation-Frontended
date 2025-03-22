import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaUser, FaTint, FaPhone, FaCalendar, FaCity, FaMapMarkerAlt, FaVenusMars } from 'react-icons/fa';
import "./UserAsDonor.css";

const UserAsDonor = () => {
  const navigate = useNavigate();
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [failed, setFailed] = useState(false);
  const [inputFocus, setInputFocus] = useState({});
  const [donor, setDonor] = useState({
    name: "",
    bloodgroup: "",
    units: "1",
    mobile: "",
    gender: "Male",
    age: "",
    city: "",
    address: "",
    date: new Date().toISOString().split("T")[0],
  });

  const validateField = (name, value) => {
    switch (name) {
      case 'name':
        return value.length < 3 ? 'Name must be at least 3 characters' : 
               !/^[a-zA-Z\s]+$/.test(value) ? 'Name can only contain letters and spaces' : '';
      case 'bloodgroup':
        return !/^(A|B|AB|O)[+-]$/.test(value) ? 'Invalid blood group format (e.g., A+, B-, AB+, O-)' : '';
      case 'mobile':
        return !/^\d{10}$/.test(value) ? 'Mobile number must be 10 digits' : '';
      case 'age':
        const age = parseInt(value);
        return !age || age < 18 || age > 65 ? 'Age must be between 18 and 65' : '';
      case 'city':
        return value.length < 2 ? 'Please enter a valid city name' : '';
      case 'address':
        return value.length < 10 ? 'Please enter a complete address' : '';
      default:
        return '';
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let updatedValue = value;

    switch (name) {
      case 'name':
        updatedValue = value.replace(/[^a-zA-Z\s]/g, '');
        break;
      case 'bloodgroup':
        updatedValue = value.toUpperCase();
        break;
      case 'mobile':
        updatedValue = value.replace(/\D/g, '').slice(0, 10);
        break;
      case 'age':
        updatedValue = value.replace(/\D/g, '').slice(0, 2);
        break;
      default:
        break;
    }

    setDonor(prev => ({ ...prev, [name]: updatedValue }));
    const error = validateField(name, updatedValue);
    setError(prev => ({ ...prev, [name]: error }));
  };

  const handleFocus = (field) => {
    setInputFocus(prev => ({ ...prev, [field]: true }));
  };

  const handleBlur = (field) => {
    setInputFocus(prev => ({ ...prev, [field]: false }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let hasErrors = false;
    const newErrors = {};

    Object.keys(donor).forEach(key => {
      const error = validateField(key, donor[key]);
      if (error) {
        newErrors[key] = error;
        hasErrors = true;
      }
    });

    if (hasErrors) {
      setError(newErrors);
      return;
    }

    try {
      await axios.post("http://localhost:8082/addAsDonor", donor);
      setSuccess(true);
      setFailed(false);
      setMsg("Thank you for volunteering as a donor!");
      setTimeout(() => navigate("/dashboard"), 3000);
    } catch (error) {
      setSuccess(false);
      setFailed(true);
      setMsg("Failed to register as donor. Please try again.");
    }
  };

  if (success) {
    return (
      <div className="donor-container13">
        <div className="success-state13">
          <img src="/src/assets/img/success.gif" alt="Success" className="result-icon" />
          <h2>Registration Successful!</h2>
          <p>{msg}</p>
          <p>Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  if (failed) {
    return (
      <div className="donor-container13">
        <div className="failed-state13">
          <img src="/src/assets/img/fail.gif" alt="Failed" className="result-icon13" />
          <h2>Registration Failed</h2>
          <p>{msg}</p>
        </div>
      </div>
    );
  }

  const renderInput = (name, placeholder, icon, type = "text") => (
    <div className="form-group13">
      {!inputFocus[name] && !donor[name] && icon}
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={donor[name]}
        onChange={handleChange}
        onFocus={() => handleFocus(name)}
        onBlur={() => handleBlur(name)}
        className={`${error[name] ? 'error' : ''} ${inputFocus[name] || donor[name] ? 'no-icon' : ''}`}
        required
      />
      {error[name] && <div className="field-error13">{error[name]}</div>}
    </div>
  );

  return (
    <div className="donor-container13">
      <div className="donor-form-wrapper13">
        <h2 className="form-title13">
          <FaTint className="title-icon13" /> Volunteer as Blood Donor
        </h2>

        <form onSubmit={handleSubmit} className="donor-form13">
          <div className="form-row13">
            {renderInput("name", "Full Name", <FaUser className="input-icon" />)}
            {renderInput("bloodgroup", "Blood Group (e.g., A+)", <FaTint className="input-icon13" />)}
          </div>

          <div className="form-row13">
            <div className="form-group13">
              {!inputFocus.units && !donor.units && <FaTint className="input-icon13" />}
              <select 
                name="units" 
                value={donor.units} 
                onChange={handleChange}
                onFocus={() => handleFocus('units')}
                onBlur={() => handleBlur('units')}
                className={inputFocus.units || donor.units ? 'no-icon' : ''}
              >
                <option value="1">1 Unit</option>
                <option value="2">2 Units</option>
                <option value="3">3 Units</option>
              </select>
            </div>
            <div className="form-group13">
              {!inputFocus.gender && !donor.gender && <FaVenusMars className="input-icon13" />}
              <select 
                name="gender" 
                value={donor.gender} 
                onChange={handleChange}
                onFocus={() => handleFocus('gender')}
                onBlur={() => handleBlur('gender')}
                className={inputFocus.gender || donor.gender ? 'no-icon' : ''}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Others">Others</option>
              </select>
            </div>
          </div>

          <div className="form-row13">
            {renderInput("mobile", "Mobile Number", <FaPhone className="input-icon13" />, "tel")}
            {renderInput("age", "Age", <FaCalendar className="input-icon13" />, "number")}
          </div>

          {renderInput("city", "City", <FaCity className="input-icon13" />)}
          
          <div className="form-group13">
            {!inputFocus.address && !donor.address && <FaMapMarkerAlt className="input-icon13" />}
            <textarea
              name="address"
              placeholder="Full Address"
              value={donor.address}
              onChange={handleChange}
              onFocus={() => handleFocus('address')}
              onBlur={() => handleBlur('address')}
              className={inputFocus.address || donor.address ? 'no-icon' : ''}
              required
            />
            {error.address && <div className="field-error13">{error.address}</div>}
          </div>

          {renderInput("date", "", <FaCalendar className="input-icon13" />, "date")}

          <div className="form-checkbox13">
            <input type="checkbox" id="agreement" required />
            <label htmlFor="agreement">
              I hereby agree to donate blood and confirm that I am medically fit to do so.
            </label>
          </div>

          <button type="submit" className="submit-btn13">
            Register as Donor
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserAsDonor;
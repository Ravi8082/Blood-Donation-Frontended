import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './RequestBlood.css';
import { FaUser, FaEnvelope, FaTint, FaHeartbeat, FaPhone, FaCalendar, FaVenusMars } from 'react-icons/fa';

const RequestBlood = () => {
    const navigate = useNavigate();
    const [loggedUser, setLoggedUser] = useState('');
    const [msg, setMsg] = useState('');
    const [inputFocus, setInputFocus] = useState({});
    const [errors, setErrors] = useState({});
    const [success, setSuccess] = useState(false);
    const [failed, setFailed] = useState(false);
    const [request, setRequest] = useState({
        name: '',
        email: '',
        bloodgroup: '',
        units: '1',
        disease: '',
        mobile: '',
        gender: 'Male',
        age: ''
    });
    
    useEffect(() => {
        const user = sessionStorage.getItem('userEmail');
        if (user) {
            setLoggedUser(user);
            setRequest(prev => ({...prev, email: user}));
        }
    }, []);

    const validateField = (name, value) => {
        switch (name) {
            case 'name':
                return value.length < 3 ? 'Name must be at least 3 characters' : 
                       !/^[a-zA-Z\s]+$/.test(value) ? 'Name can only contain letters and spaces' : '';
            case 'email':
                return !/^[^\s@]+@(gmail\.com|yahoo\.com)$/.test(value) ? 
                       'Please enter a valid Gmail or Yahoo email' : '';
            case 'bloodgroup':
                return !/^(A|B|AB|O)[+-]$/.test(value) ? 'Invalid blood group format (e.g., A+, B-, AB+, O-)' : '';
            case 'mobile':
                return !/^\d{10}$/.test(value) ? 'Mobile number must be 10 digits' : '';
            case 'age':
                const age = parseInt(value);
                return !age || age < 1 || age > 100 ? 'Age must be between 1 and 100' : '';
            case 'disease':
                return !value.trim() ? 'Please specify the reason for blood request' : '';
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

        setRequest(prev => ({ ...prev, [name]: updatedValue }));
        const error = validateField(name, updatedValue);
        setErrors(prev => ({ ...prev, [name]: error }));
    };

    const handleFocus = (field) => {
        setInputFocus(prev => ({ ...prev, [field]: true }));
    };

    const handleBlur = (field) => {
        setInputFocus(prev => ({ ...prev, [field]: false }));
        const error = validateField(field, request[field]);
        setErrors(prev => ({ ...prev, [field]: error }));
    };

    const validateForm = () => {
        const newErrors = {};
        Object.keys(request).forEach(key => {
            const error = validateField(key, request[key]);
            if (error) newErrors[key] = error;
        });
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const requestBlood = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            await axios.post('http://localhost:8082/requestblood', request);
            setSuccess(true);
            setFailed(false);
            setMsg('Blood Request Sent Successfully!');
            setTimeout(() => {
                navigate('/dashboard');
            }, 3000);
        } catch (error) {
            setSuccess(false);
            setFailed(true);
            setMsg('Failed to send request. Please try again.');
            setTimeout(() => {
                setFailed(false);
                setMsg('');
            }, 3000);
        }
    };

    const renderInput = (name, placeholder, icon, type = "text") => (
        <div className="form-group11">
            {!inputFocus[name] && !request[name] && icon}
            <input
                type={type}
                placeholder={placeholder}
                value={request[name]}
                onChange={handleChange}
                onFocus={() => handleFocus(name)}
                onBlur={() => handleBlur(name)}
                name={name}
                className={`${errors[name] ? 'error' : ''} ${inputFocus[name] || request[name] ? 'no-icon' : ''}`}
                required
            />
            {errors[name] && <div className="field-error11">{errors[name]}</div>}
        </div>
    );

    if (success) {
        return (
            <div className="request-blood-container11">
                <div className="request-form-wrapper11">
                    <div className="success-message11">
                        <div className="success-content11">
                            <img 
                                src="/src/assets/img/success.png" 
                                alt="Success" 
                                className="result-icon"
                            />
                            <h2>Request Sent Successfully!</h2>
                            <p>Redirecting to dashboard...</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (failed) {
        return (
            <div className="request-blood-container11">
                <div className="request-form-wrapper11">
                    <div className="error-message11">
                        <div className="error-content11">
                            <img 
                                src="/src/assets/img/fail.png" 
                                alt="Failed" 
                                className="result-icon"
                            />
                            <h2>Request Failed!</h2>
                            <p>{msg}</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="request-blood-container11">
            <div className="request-form-wrapper11">
                <h2 className="form-title11">
                    <FaTint className="title-icon11" /> Request Blood
                </h2>
                {msg && <div className={`message ${msg.includes('Successfully') ? 'success' : 'error'}`}>{msg}</div>}
                <form onSubmit={requestBlood} className="request-form11">
                    {renderInput("name", "Patient Name", <FaUser className="input-icon11" />)}
                    {renderInput("email", "Email (Gmail or Yahoo only)", <FaEnvelope className="input-icon11" />, "email")}
                    <div className="form-row11">
                        {renderInput("bloodgroup", "Blood Group (e.g., A+)", <FaTint className="input-icon11" />)}
                        <div className="form-group11">
                            {!inputFocus.units && !request.units && <FaTint className="input-icon11" />}
                            <select 
                                value={request.units}
                                onChange={handleChange}
                                onFocus={() => handleFocus('units')}
                                onBlur={() => handleBlur('units')}
                                name="units"
                                className={inputFocus.units || request.units ? 'no-icon' : ''}
                            >
                                {[1, 2, 3, 4].map(num => (
                                    <option key={num} value={num}>{num} Units</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    {renderInput("disease", "Disease/Reason", <FaHeartbeat className="input-icon11" />)}
                    <div className="form-row11">
                        {renderInput("mobile", "Mobile Number", <FaPhone className="input-icon11" />, "tel")}
                        {renderInput("age", "Age", <FaCalendar className="input-icon11" />, "number")}
                    </div>
                    <div className="form-group11">
                        {!inputFocus.gender && !request.gender && <FaVenusMars className="input-icon11" />}
                        <select 
                            value={request.gender}
                            onChange={handleChange}
                            onFocus={() => handleFocus('gender')}
                            onBlur={() => handleBlur('gender')}
                            name="gender"
                            className={inputFocus.gender || request.gender ? 'no-icon' : ''}
                        >
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Others">Others</option>
                        </select>
                    </div>
                    <button type="submit" className="submit-btn11">Send Request</button>
                </form>
            </div>
        </div>
    );
};

export default RequestBlood;

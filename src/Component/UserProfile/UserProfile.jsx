import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaTint, FaCalendar, FaVenusMars, FaPen, FaSave, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import './UserProfile.css';

const UserProfile = () => {
    const navigate = useNavigate();
    const [userProfile, setUserProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [updatedProfile, setUpdatedProfile] = useState({});
    const [success, setSuccess] = useState(false);
    const [failed, setFailed] = useState(false);

    useEffect(() => {
        fetchUserProfile();
    }, []);

    const fetchUserProfile = async () => {
        setLoading(true);
        setError('');

        try {
            const userEmail = sessionStorage.getItem('userEmail');
            if (!userEmail) {
                throw new Error('User email not found in session storage');
            }

            const response = await axios.get(`https://blood-donation-backend-19.onrender.com/getUserProfile/${userEmail}`);
            setUserProfile(response.data);
            setUpdatedProfile(response.data);
        } catch (error) {
            setError(error.response?.status === 404 ? 'Profile not found' : 'Error loading profile');
            setFailed(true);
            setTimeout(() => navigate('/dashboard'), 3000);
        } finally {
            setLoading(false);
        }
    };

    const validateField = (name, value) => {
        switch (name) {
            case 'name':
                return value.length < 3 ? 'Name must be at least 3 characters' : '';
            case 'mobile':
                return !/^[6-9]\d{9}$/.test(value) ? 'Enter valid 10-digit number' : '';
            case 'age':
                return value < 18 || value > 65 ? 'Age must be between 18 and 65' : '';
            case 'bloodgroup':
                return !/^(A|B|AB|O)[+-]$/.test(value) ? 'Invalid blood group format' : '';
            case 'address':
                return value.length < 10 ? 'Address too short' : '';
            default:
                return '';
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUpdatedProfile(prev => ({ ...prev, [name]: value }));
    };

    const handleSaveClick = async () => {
        let hasErrors = false;
        const errors = {};

        // Only validate fields that are editable and have values
        const fieldsToValidate = ['name', 'mobile', 'age', 'address'];
        
        fieldsToValidate.forEach(key => {
            if (updatedProfile[key]) {
                const error = validateField(key, updatedProfile[key]);
                if (error) {
                    errors[key] = error;
                    hasErrors = true;
                }
            }
        });

        if (hasErrors) {
            setError('Please correct the highlighted fields');
            setFailed(true);
            setTimeout(() => setFailed(false), 3000);
            return;
        }

        try {
            // Prepare data for update - match the format expected by your backend
            const dataToSend = {
                id: userProfile.id,
                name: updatedProfile.name,
                email: userProfile.email,
                password: userProfile.password,
                mobile: updatedProfile.mobile,
                age: updatedProfile.age.toString(),
                gender: userProfile.gender,
                address: updatedProfile.address,
                bloodgroup: userProfile.bloodgroup,
                active: true
            };
            
            console.log("Sending update data:", dataToSend);
            
            // Use the correct endpoint that matches your backend controller
            const response = await axios.put(
                `http://localhost:8082/updateuser/${id}`,
                dataToSend
            );
            
            console.log("Update response:", response.data);
            setUserProfile(response.data);
            setIsEditing(false);
            setSuccess(true);
            setTimeout(() => {
                setSuccess(false);
                navigate('/dashboard');
            }, 2000);
        } catch (error) {
            console.error("Update error:", error.response?.data || error.message);
            setError(error.response?.data || 'Failed to update profile. Please try again.');
            setFailed(true);
            setTimeout(() => {
                setFailed(false);
            }, 3000);
        }
    };

    if (loading) {
        return (
            <div className="loading-container55">
                <div className="loader55"></div>
                <p>Loading your profile...</p>
            </div>
        );
    }

    if (success) {
        return (
            <div className="result-container55">
                <div className="result-message success55">
                    <FaCheckCircle className="success-icon55" />
                    <h2>Profile Updated Successfully!</h2>
                    <p>Redirecting to dashboard...</p>
                </div>
            </div>
        );
    }

    if (failed) {
        return (
            <div className="result-container55">
                <div className="result-message error55">
                    <FaTimesCircle className="error-icon55" />
                    <h2>Update Failed</h2>
                    <p>{error}</p>
                    <button 
                        onClick={() => setFailed(false)} 
                        className="try-again-btn"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="profile-container55">
            <div className="profile-card55">
                <div className="profile-header55">
                    <div className="profile-avatar55">
                        <FaUser />
                    </div>
                    <p className="blood-group55"><FaTint /> {userProfile.bloodgroup}</p>
                </div>

                <div className="profile-content55">
                    <div className="profile-fields55">
                        <div className="field-group55">
                            <FaUser className="field-icon55" />
                            <div className="field-content55">
                                <label>Name</label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        name="name"
                                        value={updatedProfile.name || ''}
                                        onChange={handleInputChange}
                                    />
                                ) : (
                                    <p>{userProfile.name}</p>
                                )}
                            </div>
                        </div>

                        <div className="field-group55">
                            <FaEnvelope className="field-icon55" />
                            <div className="field-content55">
                                <label>Email</label>
                                <p>{userProfile.email}</p>
                            </div>
                        </div>

                        <div className="field-group55">
                            <FaPhone className="field-icon55" />
                            <div className="field-content55">
                                <label>Mobile</label>
                                {isEditing ? (
                                    <input
                                        type="tel"
                                        name="mobile"
                                        value={updatedProfile.mobile || ''}
                                        onChange={handleInputChange}
                                    />
                                ) : (
                                    <p>{userProfile.mobile}</p>
                                )}
                            </div>
                        </div>

                        <div className="field-group55">
                            <FaCalendar className="field-icon55" />
                            <div className="field-content55">
                                <label>Age</label>
                                {isEditing ? (
                                    <input
                                        type="number"
                                        name="age"
                                        value={updatedProfile.age || ''}
                                        onChange={handleInputChange}
                                    />
                                ) : (
                                    <p>{userProfile.age}</p>
                                )}
                            </div>
                        </div>

                        <div className="field-group55">
                            <FaVenusMars className="field-icon55" />
                            <div className="field-content55">
                                <label>Gender</label>
                                <p>{userProfile.gender}</p>
                            </div>
                        </div>

                        <div className="field-group55">
                            <FaMapMarkerAlt className="field-icon55" />
                            <div className="field-content55">
                                <label>Address</label>
                                {isEditing ? (
                                    <textarea
                                        name="address"
                                        value={updatedProfile.address || ''}
                                        onChange={handleInputChange}
                                    />
                                ) : (
                                    <p>{userProfile.address}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="profile-actions55">
                        {!isEditing ? (
                            <button onClick={() => setIsEditing(true)} className="edit-btn55">
                                <FaPen /> Edit Profile
                            </button>
                        ) : (
                            <div className="edit-actions55">
                                <button onClick={() => {
                                    setIsEditing(false);
                                    setUpdatedProfile(userProfile);
                                }} className="cancel-btn55">
                                    Cancel
                                </button>
                                <button onClick={handleSaveClick} className="save-btn55">
                                    <FaSave /> Save Changes
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;

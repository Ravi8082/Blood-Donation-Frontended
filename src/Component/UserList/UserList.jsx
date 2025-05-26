import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaUser, FaTint, FaPhone, FaEnvelope, FaBirthdayCake, FaSearch } from 'react-icons/fa';
import './UserList.css';  


const UserList = () => {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await axios.get('http://localhost:8082"/userlist');
            if (response.data) {
                setUsers(response.data);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
            setError('Failed to load users. Please try again later.');
            setUsers([]);
        } finally {
            setLoading(false);
        }
    };

    const filteredUsers = users.filter(user =>
        user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user?.bloodgroup?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    return (
        <div className="user-list-container3">
            <div className="user-list-header3">
                <div className="header-content3">
                    <h1>Blood Donors Directory</h1>
                    <p>Connect with our amazing blood donors</p>
                </div>
                <div className="search-box3">
                    <FaSearch className="search-icon3" />
                    <input
                        type="text"
                        placeholder="Search by name or blood group..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {loading ? (
                <div className="loading-container3">
                    <div className="loading-spinner3"></div>
                    <p>Loading donors...</p>
                </div>
            ) : filteredUsers.length === 0 ? (
                <div className="no-results">
                    <FaUser className="no-results-icon3" />
                    <p>No donors found</p>
                </div>
            ) : (
                <div className="users-grid3">
                    {filteredUsers.map((user, index) => (
                        <div key={index} className="user-card3">
                            <div className="user-card-header3">
                                <div className="user-avatar3">
                                    <img 
                                        src={user.gender?.toLowerCase() === 'male' 
                                            ? '/src/assets/img/male.png' 
                                            : '/src/assets/img/female.png'
                                        }
                                        alt={`${user.gender || 'Unknown'} donor`}
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = '/src/assets/img/default.png';
                                        }}
                                    />
                                </div>
                                <div className="blood-group-badge3">
                                    <FaTint /> {user.bloodgroup || 'N/A'}
                                </div>
                            </div>
                            
                            <div className="user-info3">
                                <h2>{user.name || 'Unknown Donor'}</h2>
                                
                                <div className="info-item3">
                                    <FaPhone className="info-icon" />
                                    <span>{user.mobile || 'No contact number'}</span>
                                </div>
                                
                                <div className="info-item3">
                                    <FaEnvelope className="info-icon" />
                                    <span>{user.email || 'No email provided'}</span>
                                </div>
                                
                                <div className="info-grid3">
                                    <div className="info-item3">
                                        <FaUser className="info-icon3" />
                                        <span>{user.gender || 'Not specified'}</span>
                                    </div>
                                    
                                    <div className="info-item3">
                                        <FaBirthdayCake className="info-icon" />
                                        <span>{user.age ? `${user.age} years` : 'Age not provided'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default UserList;

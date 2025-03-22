import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import Home from './Component/Home/Home';
import Login from './Component/Login/Login';
import ForgotPassword from './Component/ForgotPassword/ForgotPassword';
import Registration from './Component/Registration/Registration';
import UserDashboard from './Component/UserDashboard/UserDashboard';

import RequestHistoryUser from './Component/RequestHistoryUser/RequestHistoryUser';
import RequestBlood from './Component/RequestBlood/RequestBlood';
import UserAsDonor from './Component/UserAsDonor/UserAsDonor';
import UserProfile from './Component/UserProfile/UserProfile';
import AdminUserProtectedRoute from './Component/Protector/AdminUserProtectedRoute';
import AddDonor from './Component/AddDonor/AddDonor';
import UserList from './Component/UserList/UserList';
import RequestHistory from './Component/RequestHistory/RequestHistory';
import DonorList from './Component/DonorList/DonorList';
import Bloodstock from './Component/Bloodstock/Bloodstock';
import ProtectedRoute from './Component/Protector/ProtectorRouter';
import Navbar from './Component/Navbar/Navbar';
import Footer from './Component/Footer/Footer';
import AdminDashboard from './Component/AdminDashboard/AdminDashboard';



function App() {
  return (
    <Router>
      <Navbar />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path='/forgot-password' element={<ForgotPassword/>}/>
          <Route path='/signup' element={<Registration/>}/>

          {/* Protected Routes (Only Logged-in Users) */}
          <Route path='/dashboard' element={<ProtectedRoute><UserDashboard/></ProtectedRoute>}/>
          <Route path='/requesthistoryfromuser' element={<ProtectedRoute><RequestHistoryUser/></ProtectedRoute>}/>
          <Route path='/requestblood' element={<ProtectedRoute><RequestBlood/></ProtectedRoute>}/>
          <Route path='/userasdonor' element={<ProtectedRoute><UserAsDonor/></ProtectedRoute>}/>
          <Route path='/userprofile' element={<ProtectedRoute><UserProfile/></ProtectedRoute>}/>

          {/* Admin Protected Routes (Only Admin Users) */}
          <Route path='/admin-dashboard' element={<AdminUserProtectedRoute><AdminDashboard/></AdminUserProtectedRoute>}/>
          <Route path='/addDonor' element={<AdminUserProtectedRoute><AddDonor/></AdminUserProtectedRoute>}/>
          <Route path='/userlist' element={<AdminUserProtectedRoute><UserList/></AdminUserProtectedRoute>}/>
          <Route path='/requesthistory' element={<AdminUserProtectedRoute><RequestHistory/></AdminUserProtectedRoute>}/>

          {/* Shared Routes (Both Admin & User can Access) */}
          <Route path='/donorlist' element={<AdminUserProtectedRoute><DonorList/></AdminUserProtectedRoute>}/>
          <Route path='/bloodStock' element={<AdminUserProtectedRoute><Bloodstock/></AdminUserProtectedRoute>}/>
        </Routes>
      <Footer />
    </Router>
  );
}

export default App;

import { Navigate } from "react-router-dom";

const UnprotectedRoute = ({ children }) => {
  const isAuthenticated = sessionStorage.getItem("userEmail");

  return isAuthenticated ? <Navigate to="/dashboard" /> : children;
};

export default UnprotectedRoute;

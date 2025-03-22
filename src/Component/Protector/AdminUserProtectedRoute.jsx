import { Navigate } from "react-router-dom";

const AdminUserProtectedRoute = ({ children }) => {
  const role = sessionStorage.getItem("role");

  if (role === "ADMIN" || role === "USER") {
    return children;
  } else {
    alert("Unauthorized Access! Redirecting to login.");
    return <Navigate to="/login" />;
  }
};

export default AdminUserProtectedRoute;

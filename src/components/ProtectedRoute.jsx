import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const user = JSON.parse(localStorage.getItem("user") || "null");

  if (!user) {
    return <Navigate to="/" replace />;
  }


  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // If user role is not allowed, redirect to their home dashboard
    return <Navigate to={user.role === "admin" ? "/admin-dashboard" : "/dashboard"} replace />;
  }

  return children;
};

export default ProtectedRoute;

/* eslint-disable react/prop-types */
import { useContext } from "react";
import { Navigate } from "react-router-dom";
import LoadingSpinner from "../components/Shared/LoadingSpinner";
import { UserContext } from "../providers/UserProvider";

const AdminRoute = ({ children }) => {
  const { userData, loading } = useContext(UserContext);

  // Check if userData is loaded and has the role
  if (loading) return <LoadingSpinner />;

  // If no user or role, redirect to login or a different page
  if (!userData || userData.role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  // If user is admin, render the children (the protected component)
  return children;
};

export default AdminRoute;

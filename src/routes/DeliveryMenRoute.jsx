/* eslint-disable react/prop-types */
import { useContext } from "react";
import { Navigate } from "react-router-dom";
import LoadingSpinner from "../components/Shared/LoadingSpinner";
import { UserContext } from "../Context/UserContext";

const DeliveryMenRoute = ({ children }) => {
  const { userData, loading } = useContext(UserContext);

  if (loading) return <LoadingSpinner />;

  if (!userData || userData.role !== "deliverymen") {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default DeliveryMenRoute;

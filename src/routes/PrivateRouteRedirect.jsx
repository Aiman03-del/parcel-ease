import { useContext } from "react";
import { UserContext } from "../Context/UserContext";
import AdminStatistics from "../pages/Dashboard/Admin/AdminStatistics";
import MyDeliveryList from "../pages/Dashboard/DeliveryMen/MyDeliveryList";
import MyProfile from "../pages/Dashboard/User/MyProfile";

const PrivateRouteRedirect = () => {
  const { userData } = useContext(UserContext);

  if (userData?.role === "admin") {
    return <AdminStatistics />;
  } else if (userData?.role === "deliverymen") {
    return <MyDeliveryList />;
  } else {
    return <MyProfile />;
  }
};

export default PrivateRouteRedirect;

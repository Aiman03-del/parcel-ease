import { useContext } from "react";
import AdminStatistics from "../pages/Dashboard/Admin/AdminStatistics";
import MyDeliveryList from "../pages/Dashboard/DeliveryMen/MyDeliveryList";
import MyProfile from "../pages/Dashboard/User/MyProfile";
import { UserContext } from "../providers/UserProvider";

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

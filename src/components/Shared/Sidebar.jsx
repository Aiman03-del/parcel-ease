import { motion } from "framer-motion";
import { useContext } from "react";
import {
  FaBox,
  FaChartBar,
  FaHome,
  FaList,
  FaStar,
  FaUser,
  FaUsers,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { UserContext } from "../../providers/UserProvider";

const Sidebar = () => {
  const { userData } = useContext(UserContext);

  const userType = userData?.role;
  console.log("User Role:", userType);

  const menuItems = {
    User: [
      { name: "Book a Parcel", path: "/dashboard/book-parcel", icon: FaBox },
      { name: "My Parcels", path: "/dashboard/my-parcels", icon: FaList },
      { name: "My Profile", path: "/dashboard/my-profile", icon: FaUser },
    ],
    DeliveryMen: [
      {
        name: "My Delivery List",
        path: "/dashboard/my-delivery-list",
        icon: FaList,
      },
      { name: "My Reviews", path: "/dashboard/my-reviews", icon: FaStar },
    ],
    Admin: [
      { name: "All Parcels", path: "/dashboard/all-parcels", icon: FaBox },
      { name: "All Users", path: "/dashboard/all-users", icon: FaUsers },
      {
        name: "All Delivery Men",
        path: "/dashboard/all-delivery-men",
        icon: FaUsers,
      },
      { name: "Statistics", path: "/dashboard/statistics", icon: FaChartBar },
    ],
  };

  // Normalize userType to handle case insensitivity
  const normalizedUserType = Object.keys(menuItems).find(
    (key) => key.toLowerCase() === userType?.toLowerCase()
  );

  const menu = menuItems[normalizedUserType] || menuItems["User"];

  return (
    <motion.div
      initial={{ x: -250 }}
      animate={{ x: 0 }}
      transition={{ type: "spring", stiffness: 100 }}
      className="w-64 bg-slate-800 shadow-md min-h-screen flex flex-col"
    >
      {/* Home Button */}
      <div className="p-6 text-lg font-bold">
        <Link
          to="/"
          className="flex items-center px-6 py-2 hover:bg-slate-600 rounded-lg text-white transition-colors"
        >
          <FaHome className="mr-3 text-xl " />
          Home
        </Link>
      </div>

      {/* Sidebar Menu */}
      <div className="space-y-4 px-6 py-4 flex flex-col">
        {menu.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className="flex items-center px-6 py-2 hover:bg-slate-600 rounded-lg transition-colors text-white text-lg whitespace-nowrap"
          >
            <item.icon className="mr-3 text-xl" />
            <span>{item.name}</span>
          </Link>
        ))}
      </div>
    </motion.div>
  );
};

export default Sidebar;

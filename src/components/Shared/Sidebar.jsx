/* eslint-disable react/prop-types */
import { motion } from "framer-motion";
import { useContext } from "react";
import {
  FaBars,
  FaBox,
  FaChartBar,
  FaHome,
  FaList,
  FaStar,
  FaUser,
  FaUsers,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { UserContext } from "../../Context/UserContext";

const Sidebar = ({ isOpen, toggleSidebar, theme }) => {
  const { userData } = useContext(UserContext);
  const userRole = userData?.role;

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

  const normalizedUserRole = Object.keys(menuItems).find(
    (key) => key.toLowerCase() === userRole?.toLowerCase()
  );

  const menu = menuItems[normalizedUserRole] || menuItems["User"];

  const themeClasses = theme === "dark" ? "bg-black text-white" : "bg-white text-black";

  return (
    <>
      {/* Mobile Toggle Button */}
      <div className="fixed top-2 left-2 z-50">
        <button
          onClick={toggleSidebar}
          className={`p-2 ${themeClasses} rounded-lg`}
        >
          <FaBars />
        </button>
      </div>

      {/* Sidebar */}
      <motion.div
        initial={{ x: -250 }}
        animate={{ x: isOpen ? 0 : -250 }}
        transition={{ type: "spring", stiffness: 100 }}
        className={`w-64 ${themeClasses} shadow-md h-full flex flex-col md:static fixed top-0 left-0 z-40`}
      >
        {/* Home Button */}
        <div className="p-6 text-lg font-bold">
          <Link
            to="/"
            className={`flex items-center px-6 py-2 hover:bg-slate-600 rounded-lg transition-colors ${theme === "dark" ? "text-white" : "text-black"}`}
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
              className={`flex items-center px-6 py-2 hover:bg-slate-600 rounded-lg transition-colors ${theme === "dark" ? "text-white" : "text-black"} text-lg whitespace-nowrap`}
            >
              <item.icon className="mr-3 text-xl" />
              <span>{item.name}</span>
            </Link>
          ))}
        </div>
      </motion.div>
    </>
  );
};

export default Sidebar;

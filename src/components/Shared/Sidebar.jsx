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
import { UserContext } from "../../providers/UserProvider";

const Sidebar = ({ isOpen, toggleSidebar }) => {
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

  return (
    <>
      {/* Mobile Toggle Button */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={toggleSidebar}
          className=" p-2 bg-slate-800 text-white rounded-lg"
        >
          <FaBars />
        </button>
      </div>

      {/* Sidebar */}
      <motion.div
        initial={{ x: -250 }}
        animate={{ x: isOpen ? 0 : -250 }}
        transition={{ type: "spring", stiffness: 100 }}
        className={`w-64 bg-slate-800 shadow-md h-full  flex flex-col md:static fixed top-0 left-0 z-40`}
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
    </>
  );
};

export default Sidebar;

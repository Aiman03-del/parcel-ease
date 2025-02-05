import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import axios from "axios";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { IoNotificationsSharp } from "react-icons/io5";
import { SiRedash } from "react-icons/si";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import logoImg from "../../assets/images/logo-square.png";
import useAuth from "../../hooks/useAuth";

const Navbar = () => {
  const { user, logOut } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showModal, setShowModal] = useState(false);

  const fetchNotifications = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/notifications`,
        {
          withCredentials: true,
        }
      );
      const data = Array.isArray(res.data) ? res.data : [];
      setNotifications(data);

      // Count unread notifications
      const unread = data.filter((notification) => !notification.read).length;
      setUnreadCount(unread);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user]);

  const markSingleAsRead = async (id) => {
    try {
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/notifications/${id}/read`,
        {},
        { withCredentials: true }
      );

      // Update notification list
      setNotifications((prev) =>
        prev.map((notification) =>
          notification._id === id
            ? { ...notification, read: true }
            : notification
        )
      );

      setUnreadCount((prev) => (prev > 0 ? prev - 1 : 0));
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const handleLogout = () => {
    logOut()
      .then(() => {
        console.log("Logged out successfully");
        window.location.href = "/login";
      })
      .catch((error) => {
        console.error("Logout error:", error);
      });
  };

  const handleNotificationClick = () => {
    if (user) {
      setShowModal(true);
    } else {
      Swal.fire({
        title: "Please log in to view notifications.",
        showClass: {
          popup: `
            animate__animated
            animate__fadeInUp
            animate__faster
          `,
        },
        hideClass: {
          popup: `
            animate__animated
            animate__fadeOutDown
            animate__faster
          `,
        },
      });
    }
  };

  return (
    <motion.nav
      className="bg-white bg-opacity-30 shadow-lg px-6 py-4 flex flex-row md:flex-row justify-between items-center sticky top-0 z-50"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="flex items-center space-x-2  md:mb-0">
        <img src={logoImg} alt="Parcel Ease" className="h-10 w-10 rounded-md" />
        <Link
          to="/"
          className="hidden md:block lg:text-2xl font-semibold text-white hover:text-gray-200 transition-all whitespace-nowrap"
        >
          Parcel Ease
        </Link>
      </div>
      <div className="flex items-center space-x-2">
        <div className="relative flex items-center space-x-2">
          <motion.div
            className="relative cursor-pointer"
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleNotificationClick}
          >
            <IoNotificationsSharp className="text-white text-2xl" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-red-600 text-white text-xs rounded-full px-1">
                {unreadCount}
              </span>
            )}
          </motion.div>
        </div>
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <motion.img
                src={
                  typeof user.photoURL === "string"
                    ? user.photoURL
                    : FaUserCircle
                }
                alt={user.displayName || "User"}
                className="h-10 w-10 rounded-full border-2 border-white shadow-md cursor-pointer"
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-56 bg-white rounded-lg shadow-xl"
            >
              <div className="p-4 text-gray-800">
                <p className="text-sm font-semibold">{user.displayName}</p>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>
              <DropdownMenuItem>
                <Link
                  to="/dashboard"
                  className="w-full text-left px-4 py-2 text-blue-500 hover:bg-gray-100 transition"
                >
                  Dashboard
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleLogout}
                className="text-red-600 hover:bg-gray-100 transition px-4 py-2"
              >
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className="flex items-center">
            {" "}
            <Link
              to="/dashboard"
              className="flex items-center w-full text-left px-4 py-2 text-yellow-500  transition "
            >
              <SiRedash className="text-2xl" />
              Dashboard
            </Link>
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button asChild>
                <Link
                  to="/login"
                  className="text-white font-semibold hover:text-gray-300 transition-all"
                >
                  Login
                </Link>
              </Button>
            </motion.div>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80">
            <h2 className="text-xl font-semibold mb-4">Notifications</h2>
            <ul>
              {notifications.map((notification) => (
                <li
                  key={notification._id}
                  className={`flex items-center p-2 cursor-pointer transition ${
                    notification.read ? "text-gray-400" : "text-black font-bold"
                  }`}
                  onClick={() => markSingleAsRead(notification._id)}
                >
                  <img
                    src={
                      typeof notification.image === "string"
                        ? notification.image
                        : FaUserCircle
                    }
                    alt="Notification"
                    className="h-8 w-8 rounded-full mr-2"
                  />
                  <div>
                    <p className="text-sm">{notification.message}</p>
                    <p className="text-xs text-gray-500">{notification.name}</p>
                  </div>
                </li>
              ))}
            </ul>
            <button
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
              onClick={() => setShowModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </motion.nav>
  );
};

export default Navbar;

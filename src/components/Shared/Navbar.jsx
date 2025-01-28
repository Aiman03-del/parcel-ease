import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { motion } from "framer-motion";
import { FaUserCircle } from "react-icons/fa";
import { IoNotificationsSharp } from "react-icons/io5";
import { Link } from "react-router-dom";
import logoImg from "../../assets/images/Logo.png";
import useAuth from "../../hooks/useAuth";

const Navbar = () => {
  const { user, logOut } = useAuth();

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

  return (
    <motion.nav
      className="bg-gradient-to-r from-blue-500 to-teal-500 shadow-lg px-6 py-4 flex justify-between items-center sticky top-0 z-50"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="flex items-center space-x-4">
        <img src={logoImg} alt="Parcel Ease" className="h-10 w-10 rounded-md" />
        <Link
          to="/"
          className="text-2xl font-semibold text-white hover:text-gray-200 transition-all"
        >
          Parcel Ease
        </Link>
      </div>
      <div className="flex items-center space-x-6">
        <Link to="/notifications" className="relative flex items-center">
          <motion.div
            className="relative cursor-pointer"
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
          >
            <IoNotificationsSharp className="text-white text-2xl" />
            <span className="absolute -top-1 -right-2 bg-red-600 text-white text-xs rounded-full px-1">
              3
            </span>
          </motion.div>
        </Link>
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <motion.img
                src={user.photoURL || FaUserCircle}
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
        )}
      </div>
    </motion.nav>
  );
};

export default Navbar;

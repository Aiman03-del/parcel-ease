import axios from "axios";
import { useEffect, useState } from "react";

const Notification = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
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

    fetchNotifications();
  }, []);

  // ✅ সব নোটিফিকেশন রিড করা
  const markAllAsRead = async () => {
    try {
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/notifications/read`,
        {},
        { withCredentials: true }
      );

      // সব নোটিফিকেশন "read" হিসেবে আপডেট করা
      setNotifications((prev) =>
        prev.map((notification) => ({ ...notification, read: true }))
      );
      setUnreadCount(0);
    } catch (error) {
      console.error("Error marking notifications as read:", error);
    }
  };

  // ✅ নির্দিষ্ট একটি নোটিফিকেশন রিড করা
  const markSingleAsRead = async (id) => {
    try {
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/notifications/${id}/read`,
        {},
        { withCredentials: true }
      );

      // আপডেট করা নোটিফিকেশন লিস্ট
      setNotifications((prev) =>
        prev.map((notification) =>
          notification._id === id
            ? { ...notification, read: true }
            : notification
        )
      );

      // unreadCount কমানো
      setUnreadCount((prev) => (prev > 0 ? prev - 1 : 0));
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  return (
    <div className="relative w-64 mx-auto">
      {/* 🔔 Bell Icon */}
      <button onClick={markAllAsRead} className="text-xl relative">
        <i className="fa fa-bell"></i>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-2">
            {unreadCount}
          </span>
        )}
      </button>

      {/* 🔽 Dropdown Notifications */}
      {notifications.length > 0 && (
        <div className="absolute right-0 mt-2 bg-white shadow-lg p-4 rounded-md w-60">
          <ul>
            {notifications.map((notification) => (
              <li
                key={notification._id}
                className={`text-sm p-2 cursor-pointer transition ${
                  notification.read ? "text-gray-400" : "text-black font-bold"
                }`}
                onClick={() => markSingleAsRead(notification._id)}
              >
                {notification.message}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Notification;

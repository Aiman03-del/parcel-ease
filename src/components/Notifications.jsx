import axios from "axios";
import { useEffect, useState } from "react";

const Notification = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Fetch unread notifications
    const fetchNotifications = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/notifications`,
          {
            withCredentials: true,
          }
        );
        const data = Array.isArray(res.data) ? res.data : [];
        console.log(data);

        setNotifications(data);
        setUnreadCount(data.length);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
  }, []);

  const markAsRead = async () => {
    try {
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/read`,
        {},
        {
          withCredentials: true,
        }
      );
      setUnreadCount(0);
    } catch (error) {
      console.error("Error marking notifications as read:", error);
    }
  };

  return (
    <div className="relative">
      <button onClick={markAsRead} className="text-xl">
        <i className="fa fa-bell"></i>
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-2">
            {unreadCount}
          </span>
        )}
      </button>

      {notifications.length > 0 && (
        <div className="absolute right-0 mt-2 bg-white shadow-lg p-4 rounded-md w-60">
          <ul>
            {notifications.map((notification) => (
              <li key={notification._id} className="text-sm">
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

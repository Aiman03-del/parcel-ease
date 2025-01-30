/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { UserContext } from "../Context/UserContext";
import useAuth from "../hooks/useAuth";

// UserContext Provider Component
const UserProvider = ({ children }) => {
  const { user } = useAuth();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    if (user?.email) {
      const fetchUser = async () => {
        try {
          const response = await fetch(
            `${import.meta.env.VITE_API_URL}/users/${user.email}`
          );

          if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
          }

          const text = await response.text();

          if (!text) {
            throw new Error("Empty response from server");
          }

          const data = JSON.parse(text);
          setUserData(data || null);
        } catch (error) {
          console.error("Failed to fetch user data:", error.message);
        }
      };

      fetchUser();
    }
  }, [user]);

  return (
    <UserContext.Provider value={{ userData, setUserData }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;

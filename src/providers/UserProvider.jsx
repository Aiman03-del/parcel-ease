/* eslint-disable react/prop-types */
import { createContext, useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";

// Create UserContext
export const UserContext = createContext();

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

          const data = await response.json();
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

import axios from "axios";
import { useEffect, useState } from "react";

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const usersPerPage = 5;

  // Fetch paginated users
  useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage]);

  const fetchUsers = async (page) => {
    try {
      const { data } = await axios.get(
        `http://localhost:9000/users?page=${page}&limit=${usersPerPage}`
      );
      setUsers(data.users);
      setTotalUsers(data.total);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  };

  // Handle user type update
  const handleUpdateUserRole = async (userId, newType) => {
    try {
      const response = await axios.patch(
        `http://localhost:9000/users/${userId}`,
        {
          type: newType,
        }
      );

      alert(response.data.message);
      fetchUsers(currentPage);
    } catch (error) {
      console.error("Failed to update user type:", error);
      alert(error.response?.data?.message || "Failed to update user type.");
    }
  };

  // Pagination handlers
  const totalPages = Math.ceil(totalUsers / usersPerPage);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">All Users</h1>

      {/* Users Table */}
      <table className="w-full table-auto border-collapse border border-gray-300 mb-4">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Name</th>
            <th className="border p-2">Phone</th>
            <th className="border p-2">Parcels Booked</th>
            <th className="border p-2">Total Spent</th>
            <th className="border p-2">Role</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td className="border p-2">{user.name}</td>
              <td className="border p-2">{user.phone || "N/A"}</td>
              <td className="border p-2">{user.parcelsBooked || 0}</td>
              <td className="border p-2">
                ${user.totalSpent ? user.totalSpent.toFixed(2) : "0.00"}
              </td>
              <td className="border p-2">{user.role.toUpperCase()}</td>

              <td className="border p-2">
                {user.role === "admin" && (
                  <>
                    <button
                      className="bg-green-500 text-white px-4 py-2 rounded mr-2"
                      onClick={() =>
                        handleUpdateUserRole(user._id, "deliverymen")
                      }
                    >
                      Make Delivery Man
                    </button>
                    <button
                      className="bg-gray-500 text-white px-4 py-2 rounded"
                      onClick={() => handleUpdateUserRole(user._id, "user")}
                    >
                      Make User
                    </button>
                  </>
                )}

                {user.role === "deliverymen" && (
                  <>
                    <button
                      className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
                      onClick={() => handleUpdateUserRole(user._id, "admin")}
                    >
                      Make Admin
                    </button>
                    <button
                      className="bg-gray-500 text-white px-4 py-2 rounded"
                      onClick={() => handleUpdateUserRole(user._id, "user")}
                    >
                      Make User
                    </button>
                  </>
                )}

                {user.role === "user" && (
                  <>
                    <button
                      className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
                      onClick={() => handleUpdateUserRole(user._id, "admin")}
                    >
                      Make Admin
                    </button>
                    <button
                      className="bg-green-500 text-white px-4 py-2 rounded"
                      onClick={() =>
                        handleUpdateUserRole(user._id, "deliverymen")
                      }
                    >
                      Make Delivery Man
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="flex justify-center gap-4">
        <button
          className="bg-gray-500 text-white px-4 py-2 rounded"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
        >
          Previous
        </button>
        <span className="px-4 py-2">
          Page {currentPage} of {totalPages}
        </span>
        <button
          className="bg-gray-500 text-white px-4 py-2 rounded"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => prev + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AllUsers;

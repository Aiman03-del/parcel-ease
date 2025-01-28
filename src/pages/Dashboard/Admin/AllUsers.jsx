import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import LoadingSpinner from "../../../components/Shared/LoadingSpinner";

const fetchUsers = async (page, limit) => {
  const { data } = await axios.get(
    `http://localhost:9000/users?page=${page}&limit=${limit}`
  );
  return data;
};

const AllUsers = () => {
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;

  const {
    data: userData = {},
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["users", currentPage, usersPerPage],
    queryFn: () => fetchUsers(currentPage, usersPerPage),
    keepPreviousData: true,
  });

  const users = userData.users || [];
  const totalUsers = userData.total || 0;
  const totalPages = Math.ceil(totalUsers / usersPerPage);

  const handleUpdateUserRole = async (userId, newType) => {
    try {
      const response = await axios.patch(
        `http://localhost:9000/users/${userId}`,
        {
          type: newType,
        }
      );

      alert(response.data.message);
      queryClient.invalidateQueries({ queryKey: ["users"] });
    } catch (error) {
      console.error("Failed to update user type:", error);
      alert(error.response?.data?.message || "Failed to update user type.");
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center">All Users</h1>

      {isLoading && <LoadingSpinner />}
      {isError && (
        <div className="text-center text-red-500">Failed to load users.</div>
      )}

      {!isLoading && !isError && (
        <>
          <table className="w-full table-auto border-collapse border border-gray-300 text-sm md:text-base mb-4">
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
                <tr key={user._id} className="hover:bg-gray-100">
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
                          onClick={() =>
                            handleUpdateUserRole(user._id, "admin")
                          }
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
                          onClick={() =>
                            handleUpdateUserRole(user._id, "admin")
                          }
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
        </>
      )}
    </div>
  );
};

export default AllUsers;

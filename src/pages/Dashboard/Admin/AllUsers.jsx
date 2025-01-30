import { Button } from "@/components/ui/button";
import { Table } from "@/components/ui/table";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { motion } from "framer-motion";
import { useState } from "react";
import { Helmet } from "react-helmet-async";
import Swal from "sweetalert2";
import LoadingSpinner from "../../../components/Shared/LoadingSpinner";
const fetchUsers = async (page, limit) => {
  try {
    const { data } = await axios.get(
      `${import.meta.env.VITE_API_URL}/users?page=${page}&limit=${limit}`,
      { withCredentials: true }
    );
    return data;
  } catch (error) {
    console.error(
      "Error fetching users:",
      error.response?.data || error.message
    );
    throw error;
  }
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
        `${import.meta.env.VITE_API_URL}/users/${userId}`,
        { type: newType }
      );
      Swal.fire({
        icon: "success",
        title: response.data.message,
        showConfirmButton: false,
        timer: 1500,
      });
      queryClient.invalidateQueries({ queryKey: ["users"] });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || "Failed to update user type.",
        showConfirmButton: true,
      });
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <Helmet>
        <title> ParcelEase | All Users</title>
      </Helmet>
      <h1 className="text-2xl font-bold mb-4 text-center">All Users</h1>

      {isLoading && <LoadingSpinner />}
      {isError && (
        <div className="text-center text-red-500">Failed to load users.</div>
      )}

      {!isLoading && !isError && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Table className="w-full table-auto border-collapse border border-gray-300 text-sm md:text-base mb-4">
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
                    <td className="border p-2">
                      {user.totalParcelBooked || 0}
                    </td>
                    <td className="border p-2">
                      ${user.totalSpent ? user.totalSpent.toFixed(2) : "0.00"}
                    </td>
                    <td className="border p-2">{user.role.toUpperCase()}</td>
                    <td className="border p-2">
                      {user.role === "admin" && (
                        <>
                          <Button
                            className="bg-green-500 text-white px-4 py-2 rounded mr-2"
                            onClick={() =>
                              handleUpdateUserRole(user._id, "deliverymen")
                            }
                          >
                            Make Delivery Man
                          </Button>
                          <Button
                            className="bg-gray-500 text-white px-4 py-2 rounded"
                            onClick={() =>
                              handleUpdateUserRole(user._id, "user")
                            }
                          >
                            Make User
                          </Button>
                        </>
                      )}
                      {user.role === "deliverymen" && (
                        <>
                          <Button
                            className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
                            onClick={() =>
                              handleUpdateUserRole(user._id, "admin")
                            }
                          >
                            Make Admin
                          </Button>
                          <Button
                            className="bg-gray-500 text-white px-4 py-2 rounded"
                            onClick={() =>
                              handleUpdateUserRole(user._id, "user")
                            }
                          >
                            Make User
                          </Button>
                        </>
                      )}
                      {user.role === "user" && (
                        <>
                          <Button
                            className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
                            onClick={() =>
                              handleUpdateUserRole(user._id, "admin")
                            }
                          >
                            Make Admin
                          </Button>
                          <Button
                            className="bg-green-500 text-white px-4 py-2 rounded"
                            onClick={() =>
                              handleUpdateUserRole(user._id, "deliverymen")
                            }
                          >
                            Make Delivery Man
                          </Button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>

            <div className="flex justify-center gap-4">
              <Button
                className="bg-gray-500 text-white px-4 py-2 rounded"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
              >
                Previous
              </Button>
              <span className="px-4 py-2">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                className="bg-gray-500 text-white px-4 py-2 rounded"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => prev + 1)}
              >
                Next
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </div>
  );
};

export default AllUsers;

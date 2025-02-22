import { Table } from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import Swal from "sweetalert2";
import LoadingSpinner from "../../../components/Shared/LoadingSpinner";

const AllDeliveryMen = () => {
  const fetchDeliveryMen = async () => {
    try {
      const { data } = await axios.get(
        "https://server-sigma-plum.vercel.app/deliverymen",
        {
          withCredentials: true,
        }
      );
      return data;
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message,
        showConfirmButton: true,
      });
      throw error;
    }
  };

  const {
    data: deliveryMen,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["deliveryMen"],
    queryFn: fetchDeliveryMen,
  });

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isError) {
    return <div className="text-black dark:text-white">Error loading delivery men.</div>;
  }

  return (
    <div className="p-6 bg-white dark:bg-black text-black dark:text-white">
      <Helmet>
        <title> ParcelEase | All Delivery Men</title>
      </Helmet>
      <h1 className="text-2xl font-bold mb-4">All Delivery Men</h1>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="overflow-x-scroll"
      >
        <Table className="w-full table-auto border-collapse border border-gray-300 mb-4">
          <thead>
            <tr className="bg-gray-200 dark:bg-gray-700">
              <th className="border p-2">Name</th>
              <th className="border p-2">Phone Number</th>
              <th className="border p-2">Parcels Delivered</th>
              <th className="border p-2">Average Review</th>
            </tr>
          </thead>
          <tbody>
            {deliveryMen.length > 0 ? (
              deliveryMen.map((man) => (
                <tr key={man._id} className="hover:bg-gray-100 dark:hover:bg-gray-600">
                  <td className="border p-2">{man.name}</td>
                  <td className="border p-2">{man.phone}</td>
                  <td className="border p-2">{man.totalDelivered || 0}</td>
                  <td className="border p-2">{man.averageRatting || "N/A"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="border p-2 text-center text-black dark:text-white">
                  No delivery men found.
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </motion.div>
    </div>
  );
};

export default AllDeliveryMen;

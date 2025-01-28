/* eslint-disable no-unused-vars */
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import moment from "moment";
import { useContext, useState } from "react";
import LoadingSpinner from "../../../components/Shared/LoadingSpinner";
import { UserContext } from "../../../providers/UserProvider";

const MyDeliveryList = () => {
  const { userData } = useContext(UserContext);
  const queryClient = useQueryClient();
  const loggedInDeliveryManId = userData?._id;
  const [totalDelivered, setTotalDelivered] = useState(0);

  // Fetch parcels using TanStack Query
  const { data: parcels = [], isLoading } = useQuery({
    queryKey: ["parcels", loggedInDeliveryManId],
    queryFn: async () => {
      if (!loggedInDeliveryManId) return [];
      const res = await axios.get(
        `http://localhost:9000/parcels?deliveryManId=${loggedInDeliveryManId}`
      );
      setTotalDelivered(
        res.data.filter((parcel) => parcel.status === "Delivered").length
      );
      return res.data;
    },
    enabled: !!loggedInDeliveryManId,
  });

  // Mutation to update parcel status
  const updateParcelMutation = useMutation({
    mutationFn: async ({ parcelId, status }) => {
      await axios.patch(`import.meta.env.VITE_API_URL/parcels/${parcelId}`, {
        status,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["parcels", loggedInDeliveryManId]);
    },
  });

  // Handle Cancel button
  const handleCancel = async (parcelId) => {
    if (window.confirm("Are you sure you want to cancel this parcel?")) {
      updateParcelMutation.mutate({ parcelId, status: "Cancelled" });
    }
  };

  // Handle Deliver button
  const handleDeliver = async (parcelId) => {
    if (
      window.confirm("Are you sure you want to mark this parcel as Delivered?")
    ) {
      updateParcelMutation.mutate({ parcelId, status: "Delivered" });
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <h1 className="text-2xl font-bold mb-4 text-center sm:text-left">
        My Delivery List
      </h1>

      {isLoading ? (
        <LoadingSpinner />
      ) : parcels.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200 text-sm sm:text-base">
                <th className="border p-2">Booked User</th>
                <th className="border p-2">Receiver</th>
                <th className="border p-2">Booked Phone</th>
                <th className="border p-2">Requested Date</th>
                <th className="border p-2">Delivery Date</th>
                <th className="border p-2">Receiver Phone</th>
                <th className="border p-2">Address</th>
                <th className="border p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {parcels.map((parcel) => (
                <tr key={parcel._id} className="text-sm sm:text-base">
                  <td className="border p-2">{parcel.name}</td>
                  <td className="border p-2">{parcel.receiverName}</td>
                  <td className="border p-2">{parcel.phone}</td>
                  <td className="border p-2">
                    {moment(parcel.createdAt).format("YYYY-MM-DD")}
                  </td>
                  <td className="border p-2">{parcel.deliveryDate}</td>
                  <td className="border p-2">{parcel.receiverPhone}</td>
                  <td className="border p-2">{parcel.deliveryAddress}</td>
                  <td className="border p-2 flex flex-col sm:flex-row gap-2">
                    <button
                      className="bg-blue-500 text-white px-3 py-1 rounded text-xs sm:text-sm"
                      onClick={() =>
                        window.open(
                          `https://maps.google.com/?q=${parcel.receiverAddress}`,
                          "_blank"
                        )
                      }
                    >
                      View Location
                    </button>
                    <button
                      className={`px-3 py-1 rounded text-xs sm:text-sm ${
                        parcel.status === "Cancelled" ||
                        parcel.status === "Delivered"
                          ? "bg-gray-500 text-gray-200 cursor-not-allowed"
                          : "bg-red-500 text-white"
                      }`}
                      onClick={() => handleCancel(parcel._id)}
                      disabled={
                        parcel.status === "Cancelled" ||
                        parcel.status === "Delivered"
                      }
                    >
                      Cancel
                    </button>
                    <button
                      className={`px-3 py-1 rounded text-xs sm:text-sm ${
                        parcel.status === "Cancelled" ||
                        parcel.status === "Delivered"
                          ? "bg-gray-500 text-gray-200 cursor-not-allowed"
                          : "bg-green-500 text-white"
                      }`}
                      onClick={() => handleDeliver(parcel._id)}
                      disabled={
                        parcel.status === "Cancelled" ||
                        parcel.status === "Delivered"
                      }
                    >
                      Deliver
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-center">No parcels assigned to you.</p>
      )}
    </div>
  );
};

export default MyDeliveryList;

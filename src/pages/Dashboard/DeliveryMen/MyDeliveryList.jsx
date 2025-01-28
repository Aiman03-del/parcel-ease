/* eslint-disable react/no-unescaped-entities */
import axios from "axios";
import moment from "moment";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../providers/UserProvider";

const MyDeliveryList = () => {
  const [parcels, setParcels] = useState([]);
  const [loading, setLoading] = useState(false);
  const { userData } = useContext(UserContext);
  const [totalDelivered, setTotalDelivered] = useState(0);
  const loggedInDeliveryManId = userData?._id;

  useEffect(() => {
    const fetchAssignedParcels = async () => {
      if (!loggedInDeliveryManId) return;
      setLoading(true);
      try {
        const { data } = await axios.get(
          `http://localhost:9000/parcels?deliveryManId=${loggedInDeliveryManId}`
        );
        setParcels(data);
        console.log(data);

        const initialDeliveredCount = data.filter(
          (parcel) => parcel.status === "Delivered"
        ).length;
        setTotalDelivered(initialDeliveredCount);
      } catch (error) {
        console.error("Error fetching parcels:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAssignedParcels();
  }, [loggedInDeliveryManId]);

  // Handle Cancel button click
  const handleCancel = async (parcelId) => {
    if (window.confirm("Are you sure you want to cancel this parcel?")) {
      try {
        await axios.patch(`http://localhost:9000/parcels/${parcelId}`, {
          status: "Cancelled",
        });
        alert("Parcel status changed to Cancelled.");
        // Fetch the updated parcels
        const updatedParcels = parcels.map((parcel) =>
          parcel._id === parcelId ? { ...parcel, status: "Cancelled" } : parcel
        );
        setParcels(updatedParcels);
      } catch (error) {
        console.error("Error cancelling parcel:", error);
      }
    }
  };

  // Handle Deliver button click
  // Handle Deliver button click
  const handleDeliver = async (parcelId) => {
    if (
      window.confirm("Are you sure you want to mark this parcel as Delivered?")
    ) {
      try {
        // Update Parcel Status
        const response = await axios.patch(
          `http://localhost:9000/parcels/${parcelId}`,
          {
            status: "Delivered",
            deliveryDate: moment().format("YYYY-MM-DD"),
            deliveryManId: loggedInDeliveryManId,
          }
        );
        console.log(response);

        if (response.data.success) {
          // Update Delivery Man's Total Delivered
          const { data } = await axios.patch(
            `http://localhost:9000/delivery-man/${loggedInDeliveryManId}`
          );

          if (data.success) {
            setParcels((prevParcels) => {
              const updatedParcels = prevParcels.map((parcel) =>
                parcel._id === parcelId
                  ? {
                      ...parcel,
                      status: "Delivered",
                      deliveryDate: moment().format("YYYY-MM-DD"),
                      deliveryManId: loggedInDeliveryManId,
                    }
                  : parcel
              );
              console.log("Updated parcels:", updatedParcels);
              return updatedParcels;
            });

            setTotalDelivered((prevCount) => prevCount + 1);
            alert("Delivery successful!");
          } else {
            alert(data.message || "Failed to update delivery count.");
          }
        }
      } catch (error) {
        console.error("Error marking parcel as Delivered:", error);
        alert("Failed to mark the parcel as Delivered. Try again.");
      }
    }
  };

  return (
    <div className="p-6">
      {" "}
      <div className="mb-4">
        <strong>Total Delivered Parcels: {totalDelivered}</strong>
      </div>
      <h1 className="text-2xl font-bold mb-4">My Delivery List</h1>
      {loading ? (
        <p>Loading parcels...</p>
      ) : parcels.length > 0 ? (
        <table className="w-full table-auto border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Booked User's Name</th>
              <th className="border p-2">Receiver's Name</th>
              <th className="border p-2">Booked User's Phone</th>
              <th className="border p-2">Requested Delivery Date</th>
              <th className="border p-2">Approximate Delivery Date</th>
              <th className="border p-2">Receiver's Phone</th>
              <th className="border p-2">Receiver's Address</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {parcels.map((parcel) => (
              <tr key={parcel._id}>
                <td className="border p-2">{parcel.name}</td>
                <td className="border p-2">{parcel.receiverName}</td>
                <td className="border p-2">{parcel.phone}</td>
                <td className="border p-2">
                  {moment(parcel.createdAt).format("YYYY-MM-DD")}
                </td>
                <td className="border p-2">{parcel.deliveryDate}</td>
                <td className="border p-2">{parcel.receiverPhone}</td>
                <td className="border p-2">{parcel.deliveryAddress}</td>
                <td className="border p-2 flex gap-2">
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded"
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
                    className={`px-4 py-2 rounded ${
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
                    className={`px-4 py-2 rounded ${
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
      ) : (
        <p>No parcels assigned to you.</p>
      )}
    </div>
  );
};

export default MyDeliveryList;

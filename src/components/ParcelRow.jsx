/* eslint-disable react/prop-types */
import { FaEdit, FaMoneyBillWave, FaStar, FaTrashAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import { Tooltip } from "react-tooltip";
import useAxiosSecure from "../hooks/useAxiosSecure";

const ParcelRow = ({ parcel, setParcels }) => {
  const axiosSecure = useAxiosSecure();

  const handleCancel = async () => {
    if (window.confirm("Are you sure you want to cancel this booking?")) {
      try {
        await axiosSecure.patch(`/parcels/${parcel._id}`, {
          status: "canceled",
        });

        // Update state
        setParcels((prevParcels) =>
          prevParcels.map((p) =>
            p._id === parcel._id ? { ...p, status: "canceled" } : p
          )
        );

        alert("Booking canceled successfully.");
      } catch (error) {
        console.error("Error canceling parcel:", error);
      }
    }
  };
  return (
    <tr className="border-b hover:bg-gray-100 transition">
      <td className="px-4 py-4 text-sm">{parcel.parcelType}</td>
      <td className="px-4 py-4 text-sm">
        {new Date(parcel.deliveryDate).toLocaleDateString()}
      </td>
      <td className="px-4 py-4 text-sm">
        {new Date(parcel.deliveryDate).toLocaleDateString()}
      </td>
      <td className="px-4 py-4 text-sm">
        {new Date(parcel.createdAt).toLocaleDateString()}
      </td>
      <td className="px-4 py-4 text-sm">
        {parcel.deliveryManId || "Not Assigned"}
      </td>
      <td className="px-4 py-4 text-sm capitalize">{parcel.status}</td>
      <td className="px-4 py-4 text-sm flex gap-2">
        {/* Update button only visible for "pending" status */}
        <Link
          to={`/dashboard/update-parcel/${parcel._id}`}
          className={`text-blue-500 hover:text-blue-700 transition ${
            parcel.status !== "pending" ? "pointer-events-none opacity-50" : ""
          }`}
          data-tooltip-id="Update"
          data-tooltip-content="Update Parcel"
          data-tooltip-place="top"
        >
          <FaEdit />
        </Link>

        <Tooltip place="top" effect="solid" id="Update" />

        {/* Cancel button only visible for "pending" status */}
        <button
          onClick={handleCancel}
          className={`text-red-500 hover:text-red-700 transition ${
            parcel.status !== "pending" ? "pointer-events-none opacity-50" : ""
          }`}
          data-tooltip-id="Cancel"
          data-tooltip-content="Cancel Booking"
          data-tooltip-place="top"
        >
          <FaTrashAlt />
        </button>
        <Tooltip id="Cancel" place="top" effect="solid" />

        {parcel.status === "delivered" && (
          <Link
            to={`/review-parcel/${parcel._id}`}
            className="text-yellow-500 hover:text-yellow-700 transition"
            data-tooltip-id="Review"
            data-tooltip-content="Leave a Review"
            data-tooltip-place="top"
          >
            <FaStar />
          </Link>
        )}
        <Tooltip id="Review" place="top" effect="solid" />

        <Link
          to={`/payment/${parcel._id}`}
          className="text-green-500 hover:text-green-700 transition"
          data-tooltip-id="Payment"
          data-tooltip-content="Payment"
          data-tooltip-place="top"
        >
          <FaMoneyBillWave />
        </Link>
        <Tooltip id="Payment" place="top" effect="solid" />
      </td>
    </tr>
  );
};

export default ParcelRow;

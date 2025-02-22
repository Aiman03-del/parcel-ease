import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { toast } from "react-hot-toast";
import { FaEdit, FaMoneyBillWave, FaStar, FaTrashAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { Tooltip } from "react-tooltip";
import Swal from "sweetalert2";
import ReviewModal from "../../../components/ReviewModal";
import LoadingSpinner from "../../../components/Shared/LoadingSpinner";
import useAuth from "../../../hooks/useAuth";
import useAxiosPublic from "../../../hooks/useAxiosPublic";

const MyParcels = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedParcel, setSelectedParcel] = useState(null);
  const [filter, setFilter] = useState("all");

  const axios = useAxiosPublic();

  const [parcels, setParcels] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user?.email) return;

    const fetchParcels = async () => {
      try {
        const response = await axios.get(`/my-parcels?email=${user.email}`);
        setParcels(response.data);
        setIsLoading(false);
      } catch (err) {
        setError(err);
        setIsLoading(false);
      }
    };

    fetchParcels();
  }, [user?.email, axios]);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div>Error loading parcels</div>;

  const handleCancel = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to cancel this parcel?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, cancel it!",
    });

    if (!result.isConfirmed) return;

    try {
      const response = await axios.patch(`/cancel-parcel/${id}`);
      const data = response.data;

      if (data.success) {
        toast.success("Parcel canceled successfully!");
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to cancel the parcel");
    }
  };

  const handlePayClick = (parcel) => {
    navigate(`/dashboard/pay-parcel/${parcel._id}`, { state: { parcel } });
  };

  const filteredParcels =
    filter === "all"
      ? parcels
      : parcels.filter(
          (parcel) => parcel.status.toLowerCase() === filter.toLowerCase()
        );

  const handleReviewClick = (parcel) => setSelectedParcel(parcel);
  const closeModal = () => setSelectedParcel(null);

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-white dark:bg-black text-black dark:text-white">
      <Helmet>
        <title> ParcelEase | My Parcels</title>
      </Helmet>
      <h1 className="text-2xl sm:text-3xl font-bold mb-4">My Parcels</h1>
      <div className="mb-4 flex flex-wrap justify-between items-center">
        <div>
          <label htmlFor="filter" className="mr-2">
            Filter by status:
          </label>
          <Select value={filter} onValueChange={(value) => setFilter(value)}>
            <SelectTrigger className="border px-2 py-1">
              <SelectValue placeholder="Select a status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="On the way">On the Way</SelectItem>
              <SelectItem value="Delivered">Delivered</SelectItem>
              <SelectItem value="Returned">Returned</SelectItem>
              <SelectItem value="Canceled">Canceled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <motion.div
        className="overflow-x-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <table className="w-full table-auto border-collapse border border-gray-300">
          <thead>
            <tr className=" text-sm">
              <th className="border p-2 whitespace-nowrap">Parcel Type</th>
              <th className="border p-2 whitespace-nowrap">
                Requested Delivery Date
              </th>
              <th className="border p-2 whitespace-nowrap">
                Approx. Delivery Date
              </th>
              <th className="border p-2 whitespace-nowrap">Booking Date</th>
              <th className="border p-2 whitespace-nowrap">Delivery Man ID</th>
              <th className="border p-2 whitespace-nowrap">Status</th>
              <th className="border p-2 whitespace-nowrap">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredParcels.map((parcel) => (
              <tr key={parcel._id} className="text-center">
                <td className="border p-2 ">{parcel.parcelType}</td>
                <td className="border p-2 ">{parcel.deliveryDate}</td>
                <td className="border p-2 ">{parcel.deliveryDate || "-"}</td>
                <td className="border p-2 ">
                  {new Date(parcel.createdAt).toLocaleDateString()}
                </td>
                <td className="border p-2 ">{parcel.deliveryManId || "-"}</td>
                <td className="border p-2  capitalize">{parcel.status}</td>
                <td className="border p-2  space-x-2 flex justify-center">
                  <Button
                    onClick={() =>
                      navigate(`/dashboard/update-parcel/${parcel._id}`)
                    }
                    className="px-3 py-1 bg-blue-500 text-white rounded disabled:opacity-50"
                    disabled={parcel.status !== "pending"}
                    data-tooltip-id="update"
                    data-tooltip-content="Update"
                    data-tooltip-place="top"
                  >
                    <FaEdit />
                    <Tooltip
                      id="update"
                      place="top"
                      type="dark"
                      effect="solid"
                    />
                  </Button>
                  <Button
                    onClick={() => handleCancel(parcel._id)}
                    className="px-3 py-1 bg-red-500 text-white rounded disabled:opacity-50"
                    disabled={parcel.status !== "pending"}
                    data-tooltip-id="cancel"
                    data-tooltip-content="Cancel"
                    data-tooltip-place="top"
                  >
                    <FaTrashAlt />
                    <Tooltip
                      id="cancel"
                      place="top"
                      type="dark"
                      effect="solid"
                    />
                  </Button>
                  {parcel.status === "Delivered" && (
                    <Button
                      onClick={() => handleReviewClick(parcel)}
                      className="px-3 py-1 bg-green-500 text-white rounded"
                      data-tooltip-content="Review"
                      data-tooltip-id="review"
                      data-tooltip-place="top"
                    >
                      <FaStar />
                      <Tooltip
                        id="review"
                        place="top"
                        type="dark"
                        effect="solid"
                      />
                    </Button>
                  )}
                  {parcel.status === "pending" && (
                    <Button
                      onClick={() => handlePayClick(parcel)}
                      className="px-3 py-1 bg-yellow-500 text-white rounded"
                      data-tooltip-id="pay"
                      data-tooltip-content="Pay"
                      data-tooltip-place="top"
                    >
                      <FaMoneyBillWave />
                      <Tooltip
                        id="pay"
                        place="top"
                        type="dark"
                        effect="solid"
                      />
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>
      {filteredParcels.length === 0 && (
        <p className="text-center text-gray-500 mt-4">No parcels found.</p>
      )}

      <ReviewModal
        isOpen={!!selectedParcel}
        onClose={closeModal}
        parcel={selectedParcel}
        user={user}
      />
    </div>
  );
};

export default MyParcels;

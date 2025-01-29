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
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import ReviewModal from "../../../components/ReviewModal";
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

  if (isLoading) return <div>Loading...</div>;
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

  const filteredParcels =
    filter === "all"
      ? parcels
      : parcels.filter(
          (parcel) => parcel.status.toLowerCase() === filter.toLowerCase()
        );

  const handleReviewClick = (parcel) => setSelectedParcel(parcel);
  const closeModal = () => setSelectedParcel(null);

  return (
    <div className="p-4">
      <Helmet>
        <title> ParcelEase | My Parcels</title>
      </Helmet>
      <h1 className="text-2xl font-bold mb-4">My Parcels</h1>
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
      <motion.table
        className="w-full table-auto border-collapse border border-gray-300"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Parcel Type</th>
            <th className="border p-2">Requested Delivery Date</th>
            <th className="border p-2">Approx. Delivery Date</th>
            <th className="border p-2">Booking Date</th>
            <th className="border p-2">Delivery Man ID</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredParcels.map((parcel) => (
            <tr key={parcel._id} className="text-center">
              <td className="border p-2">{parcel.parcelType}</td>
              <td className="border p-2">{parcel.deliveryDate}</td>
              <td className="border p-2">{parcel.deliveryDate || "-"}</td>
              <td className="border p-2">
                {new Date(parcel.createdAt).toLocaleDateString()}
              </td>
              <td className="border p-2">{parcel.deliveryManId || "-"}</td>
              <td className="border p-2 capitalize">{parcel.status}</td>
              <td className="border p-2 space-x-2">
                <Button
                  onClick={() =>
                    navigate(`/dashboard/update-parcel/${parcel._id}`)
                  }
                  className="px-3 py-1 bg-blue-500 text-white rounded disabled:opacity-50"
                  disabled={parcel.status !== "pending"}
                >
                  Update
                </Button>
                <Button
                  onClick={() => handleCancel(parcel._id)}
                  className="px-3 py-1 bg-red-500 text-white rounded disabled:opacity-50"
                  disabled={parcel.status !== "pending"}
                >
                  Cancel
                </Button>
                {parcel.status === "Delivered" && (
                  <Button
                    onClick={() => handleReviewClick(parcel)}
                    className="px-3 py-1 bg-green-500 text-white rounded"
                  >
                    Review
                  </Button>
                )}
                {parcel.status === "pending" && (
                  <Button
                    onClick={() =>
                      navigate(`/dashboard/pay-parcel/${parcel._id}`)
                    }
                    className="px-3 py-1 bg-yellow-500 text-white rounded"
                  >
                    Pay
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </motion.table>
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

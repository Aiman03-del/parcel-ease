import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import ReviewModal from "../../../components/ReviewModal";
import useAuth from "../../../hooks/useAuth";

const MyParcels = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedParcel, setSelectedParcel] = useState(null);
  const [filter, setFilter] = useState("all");

  const {
    data: parcels = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["myParcels", user?.email],
    queryFn: async () => {
      const response = await fetch(
        `http://localhost:9000/my-parcels?email=${user.email}`,
        { credentials: "include" }
      );
      const data = await response.json();

      return data;
    },
    enabled: !!user?.email,
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading parcels</div>;

  const handleCancel = async (id) => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this parcel?"
    );
    if (!confirmCancel) return;

    try {
      const response = await fetch(
        `import.meta.env.VITE_API_URL/cancel-parcel/${id}`,
        { method: "PATCH", credentials: "include" }
      );
      const data = await response.json();

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
      <h1 className="text-2xl font-bold mb-4">My Parcels</h1>
      <div className="mb-4 flex flex-wrap justify-between items-center">
        <div>
          <label htmlFor="filter" className="mr-2">
            Filter by status:
          </label>
          <select
            id="filter"
            className="border px-2 py-1"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All</option>
            <option value="Pending">Pending</option>
            <option value="On the way">On the Way</option>
            <option value="Delivered">Delivered</option>
            <option value="returned">Returned</option>
            <option value="Canceled">Canceled</option>
          </select>
        </div>
      </div>
      <table className="w-full table-auto border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Parcel Type</th>
            <th className="border p-2">Requested Delivery Date</th>
            <th className="border p-2">Approx. Delivery Date</th>
            <th className="border p-2">Booking Date</th>
            <th className="border p-2">Delivery Men ID</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredParcels?.map((parcel) => (
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
      </table>
      {filteredParcels?.length === 0 && (
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

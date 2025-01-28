import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import LoadingSpinner from "../../../components/Shared/LoadingSpinner";

const AllDeliveryMen = () => {
  const fetchDeliveryMen = async () => {
    const { data } = await axios.get("http://localhost:9000/deliverymen");
    return data;
  };

  const {
    data: deliveryMen,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["deliveryMen"],
    queryFn: fetchDeliveryMen,
  });

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">All Delivery Men</h1>

      <table className="w-full table-auto border-collapse border border-gray-300 mb-4">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Name</th>
            <th className="border p-2">Phone Number</th>
            <th className="border p-2">Parcels Delivered</th>
            <th className="border p-2">Average Review</th>
          </tr>
        </thead>
        <tbody>
          {deliveryMen.length > 0 ? (
            deliveryMen.map((man) => (
              <tr key={man._id}>
                <td className="border p-2">{man.name}</td>
                <td className="border p-2">{man.phone}</td>
                <td className="border p-2">{man.totalDelivered || 0}</td>
                <td className="border p-2">{man.averageReview || "N/A"}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="border p-2 text-center">
                No delivery men found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AllDeliveryMen;

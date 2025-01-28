import axios from "axios";
import { useEffect, useState } from "react";

const AllDeliveryMen = () => {
  const [deliveryMen, setDeliveryMen] = useState([]);

  useEffect(() => {
    fetchDeliveryMen();
  }, []);

  const fetchDeliveryMen = async () => {
    try {
      const { data } = await axios.get("http://localhost:9000/deliverymen");
      setDeliveryMen(data);
    } catch (error) {
      console.error("Error fetching delivery men:", error);
    }
  };
  console.log(deliveryMen);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">All Delivery Men</h1>

      {/* Delivery Men Table */}
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

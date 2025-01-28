import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const TopDeliveryMen = () => {
  const [deliveryMen, setDeliveryMen] = useState([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/top-deliverymen`)
      .then((res) => res.json())
      .then((data) => {
        console.log("API Response:", data);
        if (data.success && Array.isArray(data.deliveryMen)) {
          setDeliveryMen(data.deliveryMen);
        } else {
          setDeliveryMen([]); // যদি ডেটা না থাকে অ্যারে ফাঁকা সেট করুন
        }
      })
      .catch((err) => console.error("Error fetching top delivery men:", err));
  }, []);
  console.log(deliveryMen);

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-6 text-center">
        {/* Section Heading */}
        <h2 className="text-3xl font-bold text-gray-800 mb-6">
          Our Top Delivery Men
        </h2>
        <p className="text-gray-600 mb-12">
          Meet our most efficient and highly-rated delivery professionals.
        </p>

        {/* Delivery Men Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {deliveryMen.map((man) => (
            <motion.div
              key={man._id}
              className="bg-white shadow-lg rounded-lg p-8 text-left"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <img
                src={man.image}
                alt={man.name}
                className="w-24 h-24 rounded-full mx-auto mb-4"
              />
              <h3 className="text-xl font-semibold text-gray-800 text-center mb-2">
                {man.name}
              </h3>
              <p className="text-gray-600 text-center mb-2">
                <strong>Parcels Delivered:</strong> {man.deliveredParcels}
              </p>
              <p className="text-gray-600 text-center">
                <strong>Average Rating:</strong>
                {man.averageRating !== null && man.averageRating !== undefined
                  ? man.averageRating.toFixed(1)
                  : "N/A"}{" "}
                ⭐
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TopDeliveryMen;

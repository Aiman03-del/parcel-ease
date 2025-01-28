import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import StarRatings from "react-star-ratings";

const TopDeliveryMen = () => {
  const [deliveryMen, setDeliveryMen] = useState([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/top-deliverymen`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.deliveryMen)) {
          setDeliveryMen(data.deliveryMen);
        } else {
          setDeliveryMen([]);
        }
      })
      .catch((err) => console.error("Error fetching top delivery men:", err));
  }, []);

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-6 text-center">
        <motion.h2
          className="text-3xl font-bold text-gray-800 mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          Our Top Delivery Men
        </motion.h2>
        <motion.p
          className="text-gray-600 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Meet our most efficient and highly-rated delivery professionals.
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {deliveryMen.map((man, index) => (
            <motion.div
              key={man._id}
              className="bg-white shadow-lg rounded-lg p-8 text-left"
              whileHover={{ scale: 1.05 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
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
              <div className="flex justify-center items-center">
                <StarRatings
                  rating={man.averageRating || 1}
                  starRatedColor="#FFD700"
                  numberOfStars={5}
                  starDimension="20px"
                  starSpacing="3px"
                  name={`rating-${man._id}`}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TopDeliveryMen;

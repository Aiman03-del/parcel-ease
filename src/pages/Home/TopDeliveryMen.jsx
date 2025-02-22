import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import StarRatings from "react-star-ratings";
import useAxiosPublic from "../../hooks/useAxiosPublic";

const TopDeliveryMen = () => {
  const [deliveryMen, setDeliveryMen] = useState([]);
  const axiosPublic = useAxiosPublic();

  useEffect(() => {
    const fetchTopDeliveryMen = async () => {
      try {
        const response = await axiosPublic.get("/top-deliverymen");
        if (response.data.success && Array.isArray(response.data.deliveryMen)) {
          setDeliveryMen(response.data.deliveryMen);
        } else {
          setDeliveryMen([]);
        }
      } catch (error) {
        console.error("Error fetching top delivery men:", error);
      }
    };

    fetchTopDeliveryMen();
  }, [axiosPublic]);

  return (
    <section className="py-16">
      <div className="container mx-auto px-6 text-center">
        <motion.h2
          className="text-4xl font-extrabold mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          Our Top Delivery Men
        </motion.h2>
        <motion.p
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Meet our most efficient and highly-rated delivery professionals.
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-3 justify-between gap-8">
          {deliveryMen.map((man, index) => (
            <motion.div
              key={man._id}
              className="shadow-xl rounded-lg p-8 text-left transform transition-transform duration-200 hover:scale-105"
              whileHover={{ scale: 1.05 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
            >
              <motion.img
                src={man.image}
                alt={man.name}
                className="w-24 h-24 rounded-full mx-auto mb-4"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              />
              <h3 className="text-xl font-semibold text-center mb-2">
                {man.name}
              </h3>
              <p className="text-center mb-2">
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

/* eslint-disable react/no-unescaped-entities */
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { motion } from "framer-motion";
import moment from "moment";
import { useContext } from "react";
import { Helmet } from "react-helmet-async";
import StarRatings from "react-star-ratings";
import { UserContext } from "../../../Context/UserContext";

const MyReviews = () => {
  const { userData } = useContext(UserContext);
  const loggedInDeliveryManId = userData?._id;

  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ["reviews", loggedInDeliveryManId],
    queryFn: async () => {
      if (!loggedInDeliveryManId) return [];
      const res = await axios.get(
        `${
          import.meta.env.VITE_API_URL
        }/reviews?deliveryManId=${loggedInDeliveryManId}`,
        { withCredentials: true }
      );
      return res.data;
    },
    enabled: !!loggedInDeliveryManId,
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Helmet>
        <title> ParcelEase | My Reviews</title>
      </Helmet>
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center sm:text-left">
        My Reviews
      </h1>

      {isLoading ? (
        <p className="text-center animate-pulse">Loading reviews...</p>
      ) : reviews.length > 0 ? (
        <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review, index) => (
            <motion.div
              key={review._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
            >
              <Card className="shadow-md bg-white dark:bg-gray-800">
                <CardContent className="p-4 sm:p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <img
                      src={review.userImage}
                      alt={review.userName}
                      className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover border border-gray-300"
                    />
                    <div>
                      <h3 className="font-semibold">{review.userName}</h3>
                      <p className="text-sm">{moment(review.createdAt).format("MMMM Do, YYYY")}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <StarRatings
                      rating={review.rating}
                      starRatedColor="#FFD700"
                      numberOfStars={5}
                      starDimension="18px"
                      starSpacing="2px"
                      name="rating"
                    />
                  </div>

                  <p className="mt-3 italic">"{review.feedback}"</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          No reviews available.
        </motion.p>
      )}
    </div>
  );
};

export default MyReviews;

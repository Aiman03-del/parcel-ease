/* eslint-disable react/prop-types */
import { useState } from "react";
import { toast } from "react-hot-toast";
import { IoIosCloseCircle } from "react-icons/io";

const ReviewModal = ({ isOpen, onClose, parcel, user }) => {
  const [rating, setRating] = useState(5);
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    const review = {
      userName: user.displayName,
      userImage: user.photoURL,
      rating,
      feedback,
      deliveryManId: parcel.deliveryManId,
      parcelId: parcel._id,
    };

    setLoading(true);

    try {
      const response = await fetch(
        "https://server-sigma-plum.vercel.app/review",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(review),
          credentials: "include",
        }
      );

      const data = await response.json();

      if (data.success) {
        toast.success("Review submitted successfully!");
        onClose(); // Close the modal
      } else {
        toast.error("Failed to submit review");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 flex justify-center items-center bg-gray-500 bg-opacity-80 z-50">
      <div className="bg-white p-6 rounded-xl w-80 max-w-full shadow-lg">
        <div className="flex justify-between items-center">
          <button
            onClick={onClose}
            className=" absolute right-10 text-gray-600 hover:text-gray-800 text-lg"
          >
            <IoIosCloseCircle className="text-4xl" />
          </button>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Leave a Review
          </h2>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700">
              Your Name
            </label>
            <input
              type="text"
              value={user.displayName}
              disabled
              className="w-full p-2 border border-gray-300 rounded-lg mt-2 text-gray-600"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700">
              Your Image
            </label>
            <img
              src={user.photoURL}
              alt="User"
              className="w-12 h-12 rounded-full mt-2"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700">
              Rating
            </label>
            <input
              type="number"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              max={5}
              min={1}
              className="w-full p-2 border border-gray-300 rounded-lg mt-2"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700">
              Feedback
            </label>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              rows="3"
              className="w-full p-2 border border-gray-300 rounded-lg mt-2"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700">
              Delivery Man ID
            </label>
            <input
              type="text"
              value={parcel.deliveryManId}
              disabled
              className="w-full p-2 border border-gray-300 rounded-lg mt-2 text-gray-600"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-blue-600 text-white rounded-lg mt-4 hover:bg-blue-700 transition duration-300"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit Review"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReviewModal;

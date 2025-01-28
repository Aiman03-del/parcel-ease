/* eslint-disable react/prop-types */
import { useState } from "react";
import { toast } from "react-hot-toast";

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
      const response = await fetch("http://localhost:9000/review", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(review),
        credentials: "include",
      });

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
    <div className="fixed inset-0 flex justify-center items-center bg-gray-500 bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-xl font-bold mb-4">Leave a Review</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-semibold">Your Name</label>
            <input
              type="text"
              value={user.displayName}
              disabled
              className="w-full p-2 border rounded mt-1"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold">Your Image</label>
            <img
              src={user.photoURL}
              alt="User"
              className="w-16 h-16 rounded-full mt-1"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold">Rating</label>
            <input
              type="number"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              max={5}
              min={1}
              className="w-full p-2 border rounded mt-1"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold">Feedback</label>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              rows="4"
              className="w-full p-2 border rounded mt-1"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold">
              Delivery Man ID
            </label>
            <input
              type="text"
              value={parcel.deliveryManId}
              disabled
              className="w-full p-2 border rounded mt-1"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-blue-500 text-white rounded mt-4"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit Review"}
          </button>
        </form>
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          X
        </button>
      </div>
    </div>
  );
};

export default ReviewModal;

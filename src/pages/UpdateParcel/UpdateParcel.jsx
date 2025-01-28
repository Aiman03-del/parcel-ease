/* eslint-disable react/no-unescaped-entities */
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const UpdateParcel = () => {
  const { _id } = useParams();

  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const [parcelData, setParcelData] = useState({
    parcelType: "",
    parcelWeight: "",
    receiverName: "",
    receiverPhoneNumber: "",
    deliveryAddress: "",
    deliveryDate: "",
  });
  console.log(parcelData);

  useEffect(() => {
    const fetchParcel = async () => {
      try {
        const response = await axiosSecure.get(`/parcels/${_id}`);

        setParcelData(response.data);
      } catch (error) {
        console.error("Error fetching parcel data:", error);
      }
    };
    fetchParcel();
  }, [_id, axiosSecure]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setParcelData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // নিশ্চিত করুন যে স্ট্যাটাস "pending" থাকলে আপডেট হবে
    if (parcelData.status !== "pending") {
      alert("Parcel status is not 'pending', update is not allowed");
      return;
    }

    const updatedParcel = { ...parcelData };

    // Remove _id from the updated parcel data to prevent modification of immutable field
    delete updatedParcel._id;

    try {
      // প্যাচ রিকোয়েস্ট পাঠানো
      const response = await axiosSecure.patch(
        `/parcels/${_id}`,
        updatedParcel
      );

      if (response.status === 200) {
        alert("Parcel updated successfully!");
        navigate("/dashboard/my-parcels");
      }
    } catch (error) {
      console.error("Error updating parcel:", error);
      alert(
        `Failed to update parcel: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">Update Parcel</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block font-medium mb-1">Parcel Type</label>
          <input
            type="text"
            name="parcelType"
            value={parcelData.parcelType}
            onChange={handleChange}
            required
            className="p-2 w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Parcel Weight (kg)</label>
          <input
            type="number"
            name="parcelWeight"
            value={parcelData.parcelWeight}
            onChange={handleChange}
            required
            className="p-2 w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Receiver’s Name</label>
          <input
            type="text"
            name="receiverName"
            value={parcelData.receiverName}
            onChange={handleChange}
            required
            className="p-2 w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block font-medium mb-1">
            Receiver's Phone Number
          </label>
          <input
            type="tel"
            name="receiverPhoneNumber"
            value={parcelData.receiverPhoneNumber}
            onChange={handleChange}
            required
            className="p-2 w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Delivery Address</label>
          <input
            type="text"
            name="deliveryAddress"
            value={parcelData.deliveryAddress}
            onChange={handleChange}
            required
            className="p-2 w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Delivery Date</label>
          <input
            type="date"
            name="deliveryDate"
            value={parcelData.deliveryDate}
            onChange={handleChange}
            required
            className="p-2 w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md shadow-md hover:bg-blue-600 transition"
        >
          Update Parcel
        </button>
      </form>
    </div>
  );
};

export default UpdateParcel;

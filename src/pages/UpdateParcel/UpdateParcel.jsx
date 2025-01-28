/* eslint-disable react/no-unescaped-entities */
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const UpdateParcel = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [parcelData, setParcelData] = useState({
    parcelType: "",
    parcelWeight: "",
    receiverName: "",
    receiverPhoneNumber: "",
    deliveryAddress: "",
    deliveryDate: "",
  });

  useEffect(() => {
    const fetchParcel = async () => {
      try {
        const response = await axios.get(`http://localhost:9000/parcels/${id}`);
        const fetchedParcelData = response.data || {};

        setParcelData({
          parcelType: fetchedParcelData.parcelType || "",
          parcelWeight: fetchedParcelData.parcelWeight || "",
          receiverName: fetchedParcelData.receiverName || "",
          receiverPhoneNumber: fetchedParcelData.phone || "",
          deliveryAddress: fetchedParcelData.deliveryAddress || "",
          deliveryDate: fetchedParcelData.deliveryDate || "",
        });
      } catch (error) {
        console.error("Error fetching parcel data:", error);
      }
    };
    fetchParcel();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setParcelData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:9000/parcels/${id}`, parcelData);
      navigate(`/dashboard/my-parcels`);
    } catch (error) {
      console.error("Error updating parcel:", error);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">Update Parcel</h2>
      <form className="space-y-6" onSubmit={handleSubmit}>
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

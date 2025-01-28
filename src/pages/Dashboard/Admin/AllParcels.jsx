import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import moment from "moment";
import { useState } from "react";
import Modal from "react-modal";

Modal.setAppElement("#root");

const fetchParcels = async () => {
  const { data } = await axios.get("http://localhost:9000/parcels", {
    withCredentials: true,
  });
  return data;
};

const fetchDeliveryMen = async () => {
  const { data } = await axios.get("http://localhost:9000/deliverymen", {
    withCredentials: true,
  });
  return data;
};

const AllParcels = () => {
  const queryClient = useQueryClient();
  const [selectedParcel, setSelectedParcel] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const {
    data: parcels = [],
    isLoading: parcelsLoading,
    isError: parcelsError,
  } = useQuery({
    queryKey: ["parcels"],
    queryFn: fetchParcels,
  });

  const {
    data: deliveryMen = [],
    isLoading: deliveryMenLoading,
    isError: deliveryMenError,
  } = useQuery({
    queryKey: ["deliveryMen"],
    queryFn: fetchDeliveryMen,
  });

  const handleManageClick = (parcel) => {
    setSelectedParcel(parcel);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedParcel(null);
  };

  const handleAssign = async (event) => {
    event.preventDefault();
    const deliveryManId = event.target.deliveryMan.value;
    const deliveryDate = event.target.deliveryDate.value;

    try {
      const response = await axios.patch(
        `http://localhost:9000/parcels/${selectedParcel._id}`,
        {
          deliveryManId,
          deliveryDate,
          status: "On The Way",
        }
      );

      if (response.data.success) {
        alert("Parcel assigned successfully!");
        queryClient.invalidateQueries({ queryKey: ["parcels"] });
        closeModal();
      } else {
        alert("Failed to assign parcel.");
      }
    } catch (error) {
      console.error("Failed to assign parcel:", error);
      alert("An error occurred.");
    }
  };

  if (parcelsLoading || deliveryMenLoading) {
    return <div className="text-center">Loading...</div>;
  }

  if (parcelsError || deliveryMenError) {
    return (
      <div className="text-center text-red-500">Failed to fetch data.</div>
    );
  }

  return (
    <div className="p-6 max-w-screen-lg mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">All Parcels</h1>
      <div className="overflow-x-auto">
        <table className="w-full table-auto border-collapse border border-gray-300 text-sm md:text-base">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Name</th>
              <th className="border p-2">Phone</th>
              <th className="border p-2">Booking Date</th>
              <th className="border p-2">Delivery Date</th>
              <th className="border p-2">Cost</th>
              <th className="border p-2">Status</th>
              <th className="border p-2">Manage</th>
            </tr>
          </thead>
          <tbody>
            {parcels.map((parcel) => (
              <tr key={parcel._id} className="hover:bg-gray-100">
                <td className="border p-2">{parcel.name}</td>
                <td className="border p-2">{parcel.phone}</td>
                <td className="border p-2">
                  {moment(parcel.createdAt).format("YYYY-MM-DD")}
                </td>
                <td className="border p-2">{parcel.deliveryDate}</td>
                <td className="border p-2">${parcel.price}</td>
                <td className="border p-2">{parcel.status}</td>
                <td className="border p-2">
                  <button
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                    onClick={() => handleManageClick(parcel)}
                  >
                    Manage
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Modal isOpen={modalIsOpen} onRequestClose={closeModal} className="modal">
        <h2 className="text-xl font-bold mb-4 text-center">
          Assign Delivery Man
        </h2>
        <form onSubmit={handleAssign}>
          <div className="mb-4">
            <label className="block font-medium mb-2">Delivery Man</label>
            <select name="deliveryMan" className="border p-2 rounded w-full">
              {deliveryMen.map((man) => (
                <option key={man._id} value={man._id}>
                  {man.name}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block font-medium mb-2">Delivery Date</label>
            <input
              type="date"
              name="deliveryDate"
              className="border p-2 rounded w-full"
            />
          </div>
          <div className="flex justify-end gap-4">
            <button
              type="button"
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              onClick={closeModal}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Assign
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AllParcels;

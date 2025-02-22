import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { motion } from "framer-motion";
import moment from "moment";
import { useState } from "react";
import { Helmet } from "react-helmet-async";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

const fetchParcels = async (from, to) => {
  const { data } = await axios.get(
    "https://server-sigma-plum.vercel.app/parcels",
    {
      params: { from, to },
      withCredentials: true,
    }
  );
  return data;
};

const fetchDeliveryMen = async () => {
  const { data } = await axios.get(
    "https://server-sigma-plum.vercel.app/deliverymen",
    {
      withCredentials: true,
    }
  );
  return data;
};

const AllParcels = () => {
  const queryClient = useQueryClient();
  const [selectedParcel, setSelectedParcel] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [deliveryManId, setDeliveryManId] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const {
    data: parcels = [],
    isLoading: parcelsLoading,
    isError: parcelsError,
  } = useQuery({
    queryKey: ["parcels", fromDate, toDate],
    queryFn: () => fetchParcels(fromDate, toDate),
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
    setDeliveryManId("");
    setDeliveryDate("");
  };

  const handleAssign = async (event) => {
    event.preventDefault();

    if (!deliveryManId || !deliveryDate) {
      toast.error("Please select a delivery man");
      return;
    }
    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_API_URL}/parcels/${selectedParcel._id}`,
        { deliveryManId, deliveryDate, status: "On The Way" }
      );

      if (response.data.success) {
        Swal.fire("Success!", "Parcel assigned successfully!", "success");
        queryClient.invalidateQueries({ queryKey: ["parcels"] });
        closeModal();
      } else {
        Swal.fire("Error", "Failed to assign parcel.", "error");
      }
    } catch (error) {
      console.log(error);

      Swal.fire(
        "Error",
        "An error occurred while assigning the parcel.",
        "error"
      );
    }
  };

  const handleSearch = (event) => {
    event.preventDefault();
    queryClient.invalidateQueries({ queryKey: ["parcels", fromDate, toDate] });
  };

  if (parcelsLoading || deliveryMenLoading)
    return <div className="text-center text-black dark:text-white">Loading...</div>;
  if (parcelsError || deliveryMenError)
    return (
      <div className="text-center text-red-500 dark:text-red-400">Failed to fetch data.</div>
    );

  return (
    <div className="p-6 max-w-screen-lg mx-auto bg-white dark:bg-black text-black dark:text-white">
      <Helmet>
        <title> ParcelEase | All Parcel</title>
      </Helmet>
      <h1 className="text-2xl font-bold mb-6 text-center">All Parcels</h1>
      <form onSubmit={handleSearch} className="mb-6 flex gap-4 justify-center">
        <div>
          <label className="block font-medium mb-2">From Date</label>
          <Input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
        </div>
        <div>
          <label className="block font-medium mb-2">To Date</label>
          <Input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />
        </div>
        <Button
          type="submit"
          className="self-end bg-blue-500 hover:bg-blue-600"
        >
          Search
        </Button>
      </form>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-200 dark:bg-gray-700">
              <TableHead>Name</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Booking Date</TableHead>
              <TableHead>Delivery Date</TableHead>
              <TableHead>Cost</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Manage</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {parcels.map((parcel, index) => (
              <motion.tr
                key={parcel._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="hover:bg-gray-100 dark:hover:bg-gray-600"
              >
                <TableCell>{parcel.name}</TableCell>
                <TableCell>{parcel.phone}</TableCell>
                <TableCell>
                  {moment(parcel.createdAt).format("YYYY-MM-DD")}
                </TableCell>
                <TableCell>{parcel.deliveryDate}</TableCell>
                <TableCell>${parcel.price}</TableCell>
                <TableCell>{parcel.status}</TableCell>
                <TableCell>
                  <Button
                    onClick={() => handleManageClick(parcel)}
                    className="bg-green-500 hover:bg-green-600 text-white"
                  >
                    Manage
                  </Button>
                </TableCell>
              </motion.tr>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={modalIsOpen} onOpenChange={closeModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-center">
              Assign Delivery Man
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAssign}>
            <div className="mb-4">
              <label className="block font-medium mb-2">Delivery Man</label>
              <Select
                onValueChange={setDeliveryManId}
                value={deliveryManId}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a delivery man" />
                </SelectTrigger>
                <SelectContent>
                  {deliveryMen.map((man) => (
                    <SelectItem key={man._id} value={man._id}>
                      {man.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="mb-4">
              <label className="block font-medium mb-2">Delivery Date</label>
              <Input
                type="date"
                value={deliveryDate}
                onChange={(e) => setDeliveryDate(e.target.value)}
                required
              />
            </div>
            <div className="flex justify-end gap-4">
              <Button type="button" variant="secondary" onClick={closeModal}>
                Cancel
              </Button>
              <Button type="submit" className="bg-blue-500 hover:bg-blue-600">
                Assign
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AllParcels;

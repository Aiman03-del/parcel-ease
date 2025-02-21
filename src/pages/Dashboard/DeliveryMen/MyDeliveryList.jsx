/* eslint-disable no-unused-vars */
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { motion } from "framer-motion";
import moment from "moment";
import { useContext, useState } from "react";
import { Helmet } from "react-helmet-async";
import Swal from "sweetalert2";
import { UserContext } from "../../../Context/UserContext";

const MyDeliveryList = () => {
  const { userData } = useContext(UserContext);
  const queryClient = useQueryClient();
  const loggedInDeliveryManId = userData?._id;
  const [totalDelivered, setTotalDelivered] = useState(0);

  const { data: parcels = [], isLoading } = useQuery({
    queryKey: ["parcels", loggedInDeliveryManId],
    queryFn: async () => {
      if (!loggedInDeliveryManId) return [];
      const res = await axios.get(
        `${
          import.meta.env.VITE_API_URL
        }/parcels?deliveryManId=${loggedInDeliveryManId}`,
        { withCredentials: true }
      );
      setTotalDelivered(
        res.data.filter((parcel) => parcel.status === "Delivered").length
      );
      return res.data;
    },
    enabled: !!loggedInDeliveryManId,
  });

  const updateParcelMutation = useMutation({
    mutationFn: async ({ parcelId, status }) => {
      await axios.put(`${import.meta.env.VITE_API_URL}/parcels/${parcelId}`, {
        status,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["parcels", loggedInDeliveryManId]);
    },
  });

  const handleCancel = async (parcelId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to cancel this parcel?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, cancel it!",
    });

    if (result.isConfirmed) {
      updateParcelMutation.mutate({ parcelId, status: "Cancelled" });
      Swal.fire("Cancelled!", "The parcel has been cancelled.", "success");
    }
  };

  const handleDeliver = async (parcelId) => {
    const result = await Swal.fire({
      title: "Confirm Delivery",
      text: "Are you sure you want to mark this parcel as Delivered?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#28a745",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, deliver it!",
    });

    if (result.isConfirmed) {
      updateParcelMutation.mutate({ parcelId, status: "Delivered" });
      Swal.fire(
        "Delivered!",
        "The parcel has been marked as delivered.",
        "success"
      );
    }
  };

  return (
    <motion.div
      className="p-4 sm:p-6 lg:p-8 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Helmet>
        <title> ParcelEase | My Delivery List</title>
      </Helmet>
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 text-center sm:text-left">
        My Delivery List
      </h1>
      {isLoading ? (
        <p>Loading...</p>
      ) : parcels.length > 0 ? (
        <div className="overflow-x-auto">
          <Table className="min-w-full">
            <TableHeader>
              <TableRow>
                <TableHead>Booked User</TableHead>
                <TableHead>Receiver</TableHead>
                <TableHead>Booked Phone</TableHead>
                <TableHead>Requested Date</TableHead>
                <TableHead>Delivery Date</TableHead>
                <TableHead>Receiver Phone</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {parcels.map((parcel) => (
                <TableRow key={parcel._id}>
                  <TableCell>{parcel.name}</TableCell>
                  <TableCell>{parcel.receiverName}</TableCell>
                  <TableCell>{parcel.phone}</TableCell>
                  <TableCell>
                    {moment(parcel.createdAt).format("YYYY-MM-DD")}
                  </TableCell>
                  <TableCell>{parcel.deliveryDate}</TableCell>
                  <TableCell>{parcel.receiverPhone}</TableCell>
                  <TableCell>{parcel.deliveryAddress}</TableCell>
                  <TableCell className="flex flex-col sm:flex-row gap-2">
                    <Button
                      variant="outline"
                      onClick={() =>
                        window.open(
                          `https://maps.google.com/?q=${parcel.receiverAddress}`,
                          "_blank"
                        )
                      }
                    >
                      View Location
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => handleCancel(parcel._id)}
                      disabled={
                        parcel.status === "Cancelled" ||
                        parcel.status === "Delivered"
                      }
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="success"
                      onClick={() => handleDeliver(parcel._id)}
                      disabled={
                        parcel.status === "Cancelled" ||
                        parcel.status === "Delivered"
                      }
                    >
                      Deliver
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <p className="text-center">No parcels assigned to you.</p>
      )}
    </motion.div>
  );
};

export default MyDeliveryList;

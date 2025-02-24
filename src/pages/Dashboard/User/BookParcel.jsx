/* eslint-disable react/no-unescaped-entities */
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import useAuth from "../../../hooks/useAuth";
import useAxiosPublic from "../../../hooks/useAxiosPublic";

const BookParcel = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const axiosPublic = useAxiosPublic();

  const [formData, setFormData] = useState({
    phone: "",
    parcelType: "",
    parcelWeight: 1,
    receiverName: "",
    receiverPhone: "",
    deliveryAddress: "",
    deliveryDate: "",
    latitude: "",
    longitude: "",
  });

  const [price, setPrice] = useState(50);

  const {
    data: locationData,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["locations"],
    queryFn: async () => {
      const response = await axiosPublic.get("/locations");
      if (response.headers["content-type"].includes("application/json")) {
        return response.data;
      } else {
        throw new Error("Invalid response format");
      }
    },
  });
  console.log(locationData);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "parcelWeight") {
      const weight = parseFloat(value);
      setPrice(weight === 1 ? 50 : weight === 2 ? 100 : 150);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const {
      phone,
      parcelType,
      receiverName,
      receiverPhone,
      deliveryAddress,
      deliveryDate,
      latitude,
      longitude,
    } = formData;

    if (
      !phone ||
      !parcelType ||
      !receiverName ||
      !receiverPhone ||
      !deliveryAddress ||
      !deliveryDate ||
      !latitude ||
      !longitude
    ) {
      toast.error("All fields are required!");
      return;
    }

    if (isNaN(parseFloat(latitude)) || isNaN(parseFloat(longitude))) {
      toast.error("Latitude and Longitude must be valid numbers!");
      return;
    }

    try {
      await axiosPublic.post(
        "/bookParcel",
        {
          email: user.email,
          name: user.displayName,
          phone,
          parcelType,
          parcelWeight: formData.parcelWeight,
          price,
          receiverName,
          receiverPhone,
          deliveryAddress,
          deliveryDate,
          latitude,
          longitude,
          status: "pending",
        },
        { withCredentials: true }
      );

      toast.success("Parcel booked successfully!");
      navigate("/dashboard/my-parcels");
    } catch (err) {
      console.log(err);
      Swal.fire({
        icon: "error",
        title: "Failed to book parcel",
        text: "Please try again.",
      });
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <motion.div
      className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-black text-gray-900 dark:text-gray-100 p-4 sm:p-6 lg:p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Helmet>
        <title>ParcelEase | Book Parcel</title>
      </Helmet>
      <Card className="w-full max-w-2xl p-6">
        <CardContent>
          <motion.div
            className="mb-8 text-center"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-2xl sm:text-3xl font-bold">Book a Parcel</h1>
          </motion.div>
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 gap-4 md:grid-cols-2"
          >
            <div className="md:col-span-2">
              <Label htmlFor="name">Name</Label>
              <Input type="text" id="name" value={user.displayName} readOnly />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="email">Email</Label>
              <Input type="email" id="email" value={user.email} readOnly />
            </div>
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                type="text"
                id="phone"
                name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="parcelType">Parcel Type</Label>
              <Input
                type="text"
                id="parcelType"
                name="parcelType"
                required
                value={formData.parcelType}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="parcelWeight">Parcel Weight (kg)</Label>
              <Input
                type="number"
                id="parcelWeight"
                name="parcelWeight"
                min="1"
                required
                value={formData.parcelWeight}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="receiverName">Receiver's Name</Label>
              <Input
                type="text"
                id="receiverName"
                name="receiverName"
                required
                value={formData.receiverName}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="receiverPhone">Receiver's Phone</Label>
              <Input
                type="text"
                id="receiverPhone"
                name="receiverPhone"
                required
                value={formData.receiverPhone}
                onChange={handleChange}
              />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="deliveryAddress">Delivery Address</Label>
              <Input
                type="text"
                id="deliveryAddress"
                name="deliveryAddress"
                required
                value={formData.deliveryAddress}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="deliveryDate">Delivery Date</Label>
              <Input
                type="date"
                id="deliveryDate"
                name="deliveryDate"
                required
                value={formData.deliveryDate}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="latitude">Latitude</Label>
              <Input
                type="number"
                id="latitude"
                name="latitude"
                required
                value={formData.latitude}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="longitude">Longitude</Label>
              <Input
                type="number"
                id="longitude"
                name="longitude"
                required
                value={formData.longitude}
                onChange={handleChange}
              />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="price">Price (Tk)</Label>
              <Input type="text" id="price" value={price} readOnly />
            </div>
            <motion.div whileHover={{ scale: 1.05 }} className="md:col-span-2">
              <Button type="submit" className="w-full bg-blue-500 text-white">
                Book Parcel
              </Button>
            </motion.div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default BookParcel;

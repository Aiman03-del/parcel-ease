import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "./useAxiosSecure";

const useFetchParcel = (id) => {
  const axiosSecure = useAxiosSecure();

  return useQuery(["parcel", id], async () => {
    const response = await axiosSecure.get(`/parcels/`);
    return response.data;
  });
};

export default useFetchParcel;

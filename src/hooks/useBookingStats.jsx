import { useQuery } from "@tanstack/react-query";

const fetchBookingStats = async () => {
  const res = await fetch("http://localhost:9000/stats/charts");
  if (!res.ok) throw new Error("Error fetching data");
  return res.json();
};

export const useBookingStats = () => {
  return useQuery({
    queryKey: ["bookingStats"],
    queryFn: fetchBookingStats,
  });
};

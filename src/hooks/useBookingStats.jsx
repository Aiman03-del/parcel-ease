import { useQuery } from "@tanstack/react-query";

const fetchBookingStats = async () => {
  const res = await fetch("https://server-sigma-plum.vercel.app/stats/charts", {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Error fetching data");
  const data = await res.json();
  return data;
};
export const useBookingStats = () => {
  return useQuery({
    queryKey: ["bookingStats"],
    queryFn: fetchBookingStats,
  });
};

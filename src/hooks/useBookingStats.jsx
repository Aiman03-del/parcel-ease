import { useQuery } from "@tanstack/react-query";

const fetchBookingStats = async () => {
  const res = await fetch("http://localhost:9000/stats/charts", {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Error fetching data");
  const data = await res.json();
  console.log("Fetched Data:", data);
  return data;
};

export const useBookingStats = () => {
  return useQuery({
    queryKey: ["bookingStats"],
    queryFn: fetchBookingStats,
  });
};

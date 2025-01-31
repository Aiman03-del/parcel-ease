import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import useAxiosPublic from "../../../hooks/useAxiosPublic";
import StatisticsCard from "./StatisticsCard";

const Statistics = () => {
  const [stats, setStats] = useState({
    parcelsBooked: 0,
    parcelsDelivered: 0,
    totalUsers: 0,
  });

  const axiosPublic = useAxiosPublic();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axiosPublic.get("/stats");
        setStats(response.data);
      } catch (error) {
        console.error("Error fetching statistics:", error);
      }
    };

    fetchStats();
  }, [axiosPublic]);

  return (
    <section className="statistics-section py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.h2
          className="text-center text-4xl font-bold mb-12"
          initial={{ opacity: 0, y: -50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          Our Statistics
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <StatisticsCard
            title="Parcels Booked"
            value={stats.parcelsBooked}
            delay={0.2}
          />
          <StatisticsCard
            title="Parcels Delivered"
            value={stats.parcelsDelivered}
            delay={0.4}
          />
          <StatisticsCard
            title="Total Users"
            value={stats.totalUsers}
            delay={0.6}
          />
        </div>
      </div>
    </section>
  );
};

export default Statistics;

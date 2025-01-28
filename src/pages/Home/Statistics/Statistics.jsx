import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import CountUp from "react-countup";
import StatisticsCard from "./StatisticsCard";
const Statistics = () => {
  const [stats, setStats] = useState({
    parcelsBooked: 0,
    parcelsDelivered: 0,
    totalUsers: 0,
  });

  useEffect(() => {
    fetch("http://localhost:9000/stats")
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <section className="statistics-section py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.h2
          className="text-center text-4xl font-bold mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          Our Statistics
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <StatisticsCard
            title="Parcels Booked"
            value={<CountUp end={stats.parcelsBooked} duration={2} />}
            delay={0.2}
          />
          <StatisticsCard
            title="Parcels Delivered"
            value={<CountUp end={stats.parcelsDelivered} duration={2} />}
            delay={0.4}
          />
          <StatisticsCard
            title="Total Users"
            value={<CountUp end={stats.totalUsers} duration={2} />}
            delay={0.6}
          />
        </div>
      </div>
    </section>
  );
};

export default Statistics;

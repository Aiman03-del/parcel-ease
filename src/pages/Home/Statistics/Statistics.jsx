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
    <section className="statistics-section mt-16">
      <h2 className="text-center text-3xl font-bold mb-8">Our Statistics</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatisticsCard
          title="Parcels Booked"
          value={<CountUp end={stats.parcelsBooked} duration={2} />}
        />
        <StatisticsCard
          title="Parcels Delivered"
          value={<CountUp end={stats.parcelsDelivered} duration={2} />}
        />
        <StatisticsCard
          title="Total Users"
          value={<CountUp end={stats.totalUsers} duration={2} />}
        />
      </div>
    </section>
  );
};

export default Statistics;

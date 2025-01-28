import { motion } from "framer-motion";

/* eslint-disable react/prop-types */
const StatisticsCard = ({ title, value, delay }) => {
  return (
    <motion.div
      className="stat-card bg-white shadow-md p-6 rounded-lg text-center hover:shadow-lg transition"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
    >
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-4xl font-bold text-blue-600">{value}</p>
    </motion.div>
  );
};

export default StatisticsCard;

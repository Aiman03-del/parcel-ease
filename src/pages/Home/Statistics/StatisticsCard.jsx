import { motion } from "framer-motion";
import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";

/* eslint-disable react/prop-types */
const StatisticsCard = ({ title, value, delay }) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <motion.div
      ref={ref}
      className="stat-card shadow-md p-6 rounded-lg text-center hover:shadow-lg transition"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      viewport={{ once: true }}
    >
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-4xl font-bold ">
        {inView ? <CountUp end={value} duration={2} /> : value}
      </p>
    </motion.div>
  );
};

export default StatisticsCard;

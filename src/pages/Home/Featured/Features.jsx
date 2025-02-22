import { motion } from "framer-motion";
import FeatureCard from "./FeatureCard";

const Features = () => {
  const features = [
    {
      id: 1,
      icon: "📦",
      title: "Parcel Safety",
      description: "We ensure 100% safety for your parcels during delivery.",
    },
    {
      id: 2,
      icon: "⚡",
      title: "Super Fast Delivery",
      description: "Get your parcels delivered at lightning speed.",
    },
    {
      id: 3,
      icon: "🌍",
      title: "Global Reach",
      description: "Our network spans across the globe for seamless delivery.",
    },
  ];

  return (
    <section className="features-section py-16">
      <div className="container mx-auto px-4">
        <motion.h2
          className="text-center text-4xl font-bold mb-12"
          initial={{ opacity: 0, y: -50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          Our Features
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature) => (
            <FeatureCard key={feature.id} feature={feature} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;

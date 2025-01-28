import FeatureCard from "./FeatureCard";

const Features = () => {
  const features = [
    {
      id: 1,
      icon: "📦", // Use emojis or replace with icons from a library (e.g., FontAwesome).
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
    <section className="features-section">
      <h2 className="text-center text-3xl font-bold mb-8">Our Features</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {features.map((feature) => (
          <FeatureCard key={feature.id} feature={feature} />
        ))}
      </div>
    </section>
  );
};

export default Features;

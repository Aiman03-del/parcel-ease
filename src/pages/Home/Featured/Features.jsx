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
    <section className="features-section py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-center text-4xl font-bold mb-12">Our Features</h2>
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

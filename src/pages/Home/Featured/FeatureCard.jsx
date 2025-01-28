/* eslint-disable react/prop-types */

const FeatureCard = ({ feature }) => {
  const { icon, title, description } = feature;

  return (
    <div className="feature-card bg-white shadow-md p-6 rounded-lg hover:shadow-lg transition">
      <div className="icon text-5xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

export default FeatureCard;

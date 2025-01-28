/* eslint-disable react/prop-types */

const StatisticsCard = ({ title, value }) => {
  return (
    <div className="statistics-card bg-white shadow-md p-6 rounded-lg hover:shadow-lg transition">
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-3xl font-bold text-blue-500">{value}</p>
    </div>
  );
};

export default StatisticsCard;

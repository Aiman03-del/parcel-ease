import ApexCharts from "react-apexcharts";
import { Helmet } from "react-helmet-async";
import LoadingSpinner from "../../../components/Shared/LoadingSpinner";
import { useBookingStats } from "../../../hooks/useBookingStats";

const AdminStatistics = () => {
  const { data, error, isLoading } = useBookingStats();

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div>Error: {error.message}</div>;

  const barChartData = {
    chart: {
      type: "bar",
      height: 350,
    },
    series: [
      {
        name: "Bookings",
        data: data.bookingsByDate.map((item) => item.count),
      },
    ],
    xaxis: {
      categories: data.bookingsByDate.map((item) => item.date),
    },
  };

  const lineChartData = {
    chart: {
      type: "line",
      height: 350,
    },
    series: [
      {
        name: "Booked",
        data: data.bookedVsDelivered.map((item) => item.booked),
      },
      {
        name: "Delivered",
        data: data.bookedVsDelivered.map((item) => item.delivered),
      },
    ],
    xaxis: {
      categories: data.bookedVsDelivered.map((item) => item.date),
    },
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <Helmet>
        <title> ParcelEase | Statistics</title>
      </Helmet>
      <h2 className="text-2xl font-semibold mb-6">Admin Statistics</h2>
      <div className="mb-8">
        <h3 className="text-xl font-medium mb-4">Bookings by Date</h3>
        <div className="w-full max-w-4xl mx-auto">
          <ApexCharts
            options={barChartData}
            series={barChartData.series}
            type="bar"
            height={350}
          />
        </div>
      </div>
      <div>
        <h3 className="text-xl font-medium mb-4">Booked vs Delivered</h3>
        <div className="w-full max-w-4xl mx-auto">
          <ApexCharts
            options={lineChartData}
            series={lineChartData.series}
            type="line"
            height={350}
          />
        </div>
      </div>
    </div>
  );
};

export default AdminStatistics;

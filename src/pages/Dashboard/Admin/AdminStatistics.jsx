import axios from "axios";
import { useEffect, useState } from "react";
import Chart from "react-apexcharts";

const AdminStatistics = () => {
  const [barChartData, setBarChartData] = useState({
    series: [],
    options: {},
  });
  const [lineChartData, setLineChartData] = useState({
    series: [],
    options: {},
  });

  useEffect(() => {
    // Fetch data from the server
    const fetchData = async () => {
      try {
        const { data } = await axios.get("http://localhost:9000/stats/charts");

        // Bar Chart: Bookings by Date
        setBarChartData({
          series: [
            {
              name: "Bookings",
              data: data.bookingsByDate.map((item) => item.count),
            },
          ],
          options: {
            chart: { type: "bar" },
            xaxis: {
              categories: data.bookingsByDate.map((item) => item.date),
            },
            title: {
              text: "Bookings by Date",
              align: "center",
            },
          },
        });

        // Line Chart: Booked vs Delivered
        setLineChartData({
          series: [
            {
              name: "Booked Parcels",
              data: data.bookedVsDelivered.map((item) => item.booked),
            },
            {
              name: "Delivered Parcels",
              data: data.bookedVsDelivered.map((item) => item.delivered),
            },
          ],
          options: {
            chart: { type: "line" },
            xaxis: {
              categories: data.bookedVsDelivered.map((item) => item.date),
            },
            title: {
              text: "Booked vs Delivered Parcels",
              align: "center",
            },
          },
        });
      } catch (error) {
        console.error("Failed to fetch statistics:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Statistics</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Bar Chart */}
        <div className="shadow-lg rounded-lg p-4 bg-white">
          <Chart
            options={barChartData.options}
            series={barChartData.series}
            type="bar"
            height={350}
          />
        </div>
        {/* Line Chart */}
        <div className="shadow-lg rounded-lg p-4 bg-white">
          <Chart
            options={lineChartData.options}
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

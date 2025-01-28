import { Helmet } from "react-helmet-async";
import Banner from "./Banner";
import Features from "./Featured/Features";
import Statistics from "./Statistics/Statistics";
import TopDeliveryMen from "./TopDeliveryMen";

const Home = () => {
  return (
    <div>
      <Helmet>
        <title> ParcelEase | Order Your Parcel</title>
      </Helmet>
      <Banner />
      <Features />
      <Statistics />
      <TopDeliveryMen />
    </div>
  );
};

export default Home;

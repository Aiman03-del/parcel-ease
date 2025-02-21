import { Helmet } from "react-helmet-async";
import Banner from "./Banner";
import Features from "./Featured/Features";
import Statistics from "./Statistics/Statistics";
import TopDeliveryMen from "./TopDeliveryMen";
import Newsletter from "./Newsletter";
import Reviews from "./Reviews";
import AboutUs from "./AboutUs";
import Team from "./Team"; 
import FAQ from "./FAQ";
import ContactUs from "./ContactUs";

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
      <Newsletter />
      <Reviews />
      <AboutUs />
      <Team />
      <FAQ /> 
      <ContactUs />
    </div>
  );
};

export default Home;

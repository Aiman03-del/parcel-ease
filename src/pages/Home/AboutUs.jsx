import { motion } from 'framer-motion';
import { FaShippingFast, FaLock, FaThumbsUp } from 'react-icons/fa';

const AboutUs = () => {
  return (
    <div className="about-us-container mx-auto  p-8 rounded-lg shadow-lg">
      <motion.h2 
        className="text-7xl font-semibold mb-4 text-center"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        About Us
      </motion.h2>
      <motion.p 
        className="text-lg text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        ParcelEase is dedicated to providing the best parcel delivery service. Our mission is to make parcel delivery easy and convenient for everyone.
      </motion.p>
      <div className="flex flex-wrap items-center justify-around mt-8">
        <Card 
          icon={<FaShippingFast size={40} className="text-blue-500" />} 
          title="Fast Delivery" 
          description="We ensure quick and efficient delivery of your parcels." 
        />
        <Card 
          icon={<FaLock size={40} className="text-green-500" />} 
          title="Secure Packaging" 
          description="Your parcels are securely packaged to prevent any damage." 
        />
        <Card 
          icon={<FaThumbsUp size={40} className="text-yellow-500" />} 
          title="Customer Satisfaction" 
          description="We prioritize customer satisfaction above all else." 
        />
      </div>
    </div>
  );
};

import PropTypes from 'prop-types';

const Card = ({ icon, title, description }) => (
  <motion.div 
    className="p-6 m-4 rounded-lg shadow-lg w-64 flex flex-col items-center text-center"
    whileHover={{ scale: 1.05 }}
  >
    <div className="mb-4">{icon}</div>
    <div>
    <h3 className="text-2xl font-semibold mb-2">{title}</h3>
    <p >{description}</p>
    </div>
  </motion.div>
);

Card.propTypes = {
  icon: PropTypes.element.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
};


export default AboutUs;

import { motion } from "framer-motion";
import Swal from "sweetalert2";

const Newsletter = () => {
  const handleSubscribe = () => {
    Swal.fire({
      title: 'Subscribed!',
      text: 'You have successfully subscribed to our newsletter.',
      icon: 'success',
      confirmButtonText: 'OK'
    });
  };

  return (
    <section className="py-16">
      <div className="container mx-auto px-6 text-center">
        <motion.h2
          className="text-4xl font-extrabold mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          Subscribe to our Newsletter
        </motion.h2>
        <motion.p
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Stay updated with our latest news and offers.
        </motion.p>
        <div className="flex justify-center">
          <input
            type="email"
            placeholder="Enter your email"
            className="dark:bg-black bg-white p-3 w-1/2 border rounded-l-lg focus:outline-none"
          />
          <button 
            className="bg-blue-500 text-white px-6 py-3 rounded-r-lg"
            onClick={handleSubscribe}
          >
            Subscribe
          </button>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;

import { motion } from 'framer-motion';
import Swal from 'sweetalert2';

const ContactUs = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    Swal.fire({
      title: 'Success!',
      text: 'Your message has been sent.',
      icon: 'success',
      confirmButtonText: 'OK'
    });
  };

  return (
    <div className="contact-us-container mx-auto p-8 rounded-lg shadow-lg flex flex-col md:flex-row items-center space-y-8 md:space-y-0 md:space-x-8">
      <motion.div 
        className="w-full md:w-1/2"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-4xl font-semibold mb-4 text-center md:text-left">Contact Us</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-lg font-medium">Name</label>
            <input type="text" className="bg-white dark:bg-black mt-1 p-2 w-full border rounded-lg" placeholder="Your Name" />
          </div>
          <div>
            <label className="block text-lg font-medium">Email</label>
            <input type="email" className="bg-white dark:bg-black mt-1 p-2 w-full border rounded-lg" placeholder="Your Email" />
          </div>
          <div>
            <label className="block text-lg font-medium">Message</label>
            <textarea className="bg-white dark:bg-black mt-1 p-2 w-full border rounded-lg" rows="4" placeholder="Your Message"></textarea>
          </div>
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg">Send Message</button>
        </form>
      </motion.div>
      <motion.div 
        className="w-full md:w-1/2"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-4xl font-semibold mb-4 text-center md:text-left">Our Address</h2>
        <p className="text-lg text-center md:text-left mb-4">123 ParcelEase St, Delivery City, Country</p>
        <div className="w-full h-64">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.019284507041!2d144.9630579153169!3d-37.81627997975195!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad642af0f11fd81%3A0xf577d1b6e4b0a0b!2sParcelEase!5e0!3m2!1sen!2sau!4v1633071234567!5m2!1sen!2sau"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
          ></iframe>
        </div>
      </motion.div>
    </div>
  );
};

export default ContactUs;

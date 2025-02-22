import { motion } from 'framer-motion';

const faqs = [
  {
    question: "How do I track my parcel?",
    answer: "You can track your parcel using the tracking number provided in your confirmation email.",
  },
  {
    question: "What is the delivery time?",
    answer: "Delivery time depends on the destination and shipping method chosen. Typically, it takes 3-5 business days.",
  },
  {
    question: "How do I contact customer support?",
    answer: "You can contact our customer support via email at support@parcelease.com or call us at 123-456-7890.",
  },
];

const FAQ = () => {
  return (
    <div className="faq-container mx-auto p-8 rounded-lg shadow-lg">
      <motion.h2 
        className="text-4xl font-semibold mb-4 text-center"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Frequently Asked Questions
      </motion.h2>
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <motion.div 
            key={index} 
            className="p-4 border-b border-gray-200"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.2, duration: 0.5 }}
          >
            <h3 className="text-2xl font-semibold mb-2">{faq.question}</h3>
            <p >{faq.answer}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default FAQ;

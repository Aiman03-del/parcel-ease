import Confetti from "react-confetti";

const PaymentSuccess = () => {
  return (
    <div className="payment-success bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-4">
      <Confetti />
      <h1 className="text-2xl font-bold mb-4">Payment Successful!</h1>
      <p>Thank you for your purchase. Enjoy your delivery!</p>
    </div>
  );
};

export default PaymentSuccess;

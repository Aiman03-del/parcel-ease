import Confetti from "react-confetti";

const PaymentSuccess = () => {
  return (
    <div className="payment-success">
      <Confetti />
      <h1>Payment Successful!</h1>
      <p>Thank you for your purchase. Enjoy your delivery!</p>
    </div>
  );
};

export default PaymentSuccess;

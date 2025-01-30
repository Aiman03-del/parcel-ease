import Confetti from "react-confetti";
import { Helmet } from "react-helmet-async";
import { useWindowSize } from "react-use";

const PaymentSuccess = () => {
  const { width, height } = useWindowSize();

  return (
    <div className="p-4 text-center">
      <Helmet>
        <title>ParcelEase | Payment Success</title>
      </Helmet>
      <Confetti width={width} height={height} />
      <h1 className="text-3xl font-bold mb-4">Payment Successful!</h1>
      <p className="text-lg">Thank you for your payment.</p>
    </div>
  );
};

export default PaymentSuccess;

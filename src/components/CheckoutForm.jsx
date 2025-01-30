import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import axios from "axios";
import PropTypes from "prop-types";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const CheckoutForm = ({ parcel }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!stripe || !elements) return;

    setIsProcessing(true);

    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/create-payment-intent`,
        { amount: parcel.price * 100 },
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const clientSecret = data.clientSecret;
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card: elements.getElement(CardElement) },
      });

      if (result.error) {
        toast.error(result.error.message);
      } else if (result.paymentIntent.status === "succeeded") {
        toast.success("Payment successful!");
        navigate("/payment-success");
      }
    } catch (error) {
      toast.error(`Payment failed: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement />
      <button
        type="submit"
        disabled={!stripe || isProcessing}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        {isProcessing ? "Processing..." : "Pay"}
      </button>
    </form>
  );
};

CheckoutForm.propTypes = {
  parcel: PropTypes.shape({
    price: PropTypes.number.isRequired,
  }).isRequired,
};

export default CheckoutForm;

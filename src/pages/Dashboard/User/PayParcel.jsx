import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { Helmet } from "react-helmet-async";
import { useLocation, useNavigate } from "react-router-dom";
import CheckoutForm from "../../../components/CheckoutForm";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const PayParcel = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { parcel } = location.state || {};

  if (!parcel) {
    navigate("/dashboard/my-parcels");
    return null;
  }

  return (
    <div className="p-4">
      <Helmet>
        <title>ParcelEase | Pay Parcel</title>
      </Helmet>
      <h1 className="text-2xl font-bold mb-4">Pay for Parcel</h1>
      <Elements stripe={stripePromise}>
        <CheckoutForm parcel={parcel} />
      </Elements>
    </div>
  );
};

export default PayParcel;

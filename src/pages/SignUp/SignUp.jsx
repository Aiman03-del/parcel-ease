import axios from "axios";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { toast } from "react-hot-toast";
import { FcGoogle } from "react-icons/fc";
import { TbFidgetSpinner } from "react-icons/tb";
import { Link, useNavigate } from "react-router-dom";
import { imageUpload, saveUser } from "../../API/Utils";
import useAuth from "../../hooks/useAuth";

const SignUp = () => {
  const { createUser, updateUserProfile, signInWithGoogle, loading } =
    useAuth();
  const navigate = useNavigate();

  // Form submit handler
  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.target;
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const password = form.password.value.trim();
    const phone = form.phone.value.trim();
    const image = form.image.files[0];

    if (!name || !email || !password || !phone || !image) {
      toast.error("All fields are required.");
      return;
    }

    try {
      const photoURL = await imageUpload(image);
      const result = await createUser(email, password);
      await updateUserProfile(name, photoURL);
      await saveUser({
        uid: result?.user.uid,
        displayName: name,
        email: result?.user.email,
        photoURL,
        phone,
      });
      navigate("/");
      toast.success("Signup Successful");
    } catch (error) {
      console.error("Error during sign-up:", error.message);
      if (error.code === "auth/email-already-in-use") {
        toast.error("This email is already registered. Please log in.");
      } else {
        toast.error(error.message || "Something went wrong. Please try again.");
      }
    }
  };

  // Handle Google Sign-In
  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithGoogle();
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/users/${result?.user.email}`
      );
      if (data.exists) {
        toast.error("This email is already registered. Please log in.");
        return;
      }
      await saveUser({
        uid: result?.user.uid,
        displayName: result?.user.displayName,
        email: result?.user.email,
        photoURL: result?.user.photoURL,
        phone: "",
      });
      navigate("/");
      toast.success("Signup Successful");
    } catch (error) {
      console.error("Google Sign-In Error:", error.message);
      if (error.code === "auth/account-exists-with-different-credential") {
        toast.error(
          "This email is already registered with a different method. Please log in."
        );
      } else {
        toast.error(error.message || "Failed to sign in with Google.");
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-600"
    >
      <Helmet>
        <title> ParcelEase | Sign In</title>
      </Helmet>
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        className="flex flex-col max-w-md p-8 rounded-lg shadow-lg bg-white text-gray-900"
      >
        <div className="mb-8 text-center">
          <h1 className="my-3 text-4xl font-bold text-purple-700">Sign Up</h1>
          <p className="text-sm text-gray-500">Welcome to ParcelEase</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
            <input
              type="file"
              name="image"
              accept="image/*"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-all"
          >
            {loading ? (
              <TbFidgetSpinner className="animate-spin m-auto" />
            ) : (
              "Continue"
            )}
          </button>
        </form>
        <div className="text-center mt-4">
          <p className="text-sm text-gray-500">Or sign up using</p>
          <motion.div
            whileHover={{ scale: 1.1 }}
            onClick={handleGoogleSignIn}
            className="flex justify-center items-center mt-2 p-2 border rounded-md cursor-pointer hover:bg-gray-200 transition-all"
          >
            <FcGoogle size={32} />
            <p className="ml-2">Continue with Google</p>
          </motion.div>
        </div>
        <p className="text-center mt-4 text-gray-500">
          Already have an account?{" "}
          <Link to="/login" className="text-purple-600 hover:underline">
            Login
          </Link>
        </p>
      </motion.div>
    </motion.div>
  );
};

export default SignUp;

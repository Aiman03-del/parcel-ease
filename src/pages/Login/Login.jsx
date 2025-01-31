/* eslint-disable react/no-unescaped-entities */
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import toast from "react-hot-toast";
import { FcGoogle } from "react-icons/fc";
import { TbFidgetSpinner } from "react-icons/tb";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import LoadingSpinner from "../../components/Shared/LoadingSpinner";
import useAuth from "../../hooks/useAuth";

const Login = () => {
  const { signIn, signInWithGoogle, loading, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location?.state?.from?.pathname || "/";

  if (user) return <Navigate to={from} replace={true} />;
  if (loading) return <LoadingSpinner />;

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.target;
    const email = form.email.value;
    const password = form.password.value;

    try {
      await signIn(email, password);
      navigate(from, { replace: true });
      toast.success("Login Successful");
    } catch (err) {
      toast.error(err?.message || "Login Failed");
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      navigate(from, { replace: true });
      toast.success("Login Successful");
    } catch (err) {
      toast.error(err?.message || "Google Sign-In Failed");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex justify-center items-center min-h-screen bg-gray-50"
    >
      <Helmet>
        <title> ParcelEase | Login</title>
      </Helmet>
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col max-w-md p-8 rounded-lg shadow-lg bg-white text-gray-900"
      >
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-blue-600">Log In</h1>
          <p className="text-sm text-gray-500">
            Sign in to access your account
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email address
            </label>
            <input
              type="email"
              name="email"
              id="email"
              required
              className="w-full px-4 py-2 mt-2 border rounded-md focus:ring focus:ring-blue-200 focus:outline-none"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              required
              className="w-full px-4 py-2 mt-2 border rounded-md focus:ring focus:ring-blue-200 focus:outline-none"
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="w-full py-3 rounded-md bg-blue-600 text-white font-bold hover:bg-blue-700 focus:ring focus:ring-blue-200 focus:outline-none"
          >
            {loading ? (
              <TbFidgetSpinner className="animate-spin m-auto" />
            ) : (
              "Sign In"
            )}
          </motion.button>
        </form>
        <button className="mt-3 text-sm text-blue-600 hover:underline">
          Forgot password?
        </button>
        <div className="flex items-center my-4">
          <div className="flex-1 h-px bg-gray-300"></div>
          <p className="px-3 text-sm text-gray-500">Or sign in with</p>
          <div className="flex-1 h-px bg-gray-300"></div>
        </div>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleGoogleSignIn}
          className="flex items-center justify-center p-2 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-100"
        >
          <FcGoogle size={28} />
          <p className="ml-3">Continue with Google</p>
        </motion.div>
        <p className="mt-4 text-center text-sm text-gray-500">
          Don't have an account?
          <Link to="/signup" className="text-blue-600 hover:underline">
            {" "}
            Sign up
          </Link>
        </p>
      </motion.div>
    </motion.div>
  );
};

export default Login;

import axios from "axios";
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
      // 1. Upload image to imgbb
      const photoURL = await imageUpload(image);

      // 2. User Registration
      const result = await createUser(email, password);

      // 3. Update username & profile photo
      await updateUserProfile(name, photoURL);

      // 4. Save user info in DB if the user is new
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

      // Handle email already in use
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

      // Check if email is already in use
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/users/${result?.user.email}`
      );

      if (data.exists) {
        // If email exists, show an alert
        toast.error("This email is already registered. Please log in.");
        return;
      }

      // If email is not registered, proceed with saving user
      await saveUser({
        uid: result?.user.uid,
        displayName: result?.user.displayName,
        email: result?.user.email,
        photoURL: result?.user.photoURL,
        phone: "", // Google sign-in users might not have a phone number initially
      });

      navigate("/");
      toast.success("Signup Successful");
    } catch (error) {
      console.error("Google Sign-In Error:", error.message);

      // Handle account exists with different credentials
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
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="flex flex-col max-w-lg p-8 rounded-lg shadow-lg bg-white text-gray-900">
        <div className="mb-8 text-center">
          <h1 className="my-3 text-3xl font-bold">Create an Account</h1>
          <p className="text-sm text-gray-500">Join our community</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            {/* Name Input */}
            <div>
              <label htmlFor="name" className="block mb-2 text-sm font-medium">
                Name
              </label>
              <input
                type="text"
                name="name"
                id="name"
                placeholder="Enter Your Name"
                className="w-full px-4 py-2 border rounded-md border-gray-300 focus:ring focus:ring-blue-200 focus:outline-none"
                required
              />
            </div>

            {/* Phone Input */}
            <div>
              <label htmlFor="phone" className="block mb-2 text-sm font-medium">
                Phone Number
              </label>
              <input
                type="text"
                name="phone"
                id="phone"
                placeholder="Enter Your Phone Number"
                className="w-full px-4 py-2 border rounded-md border-gray-300 focus:ring focus:ring-blue-200 focus:outline-none"
                required
              />
            </div>

            {/* Image Input */}
            <div>
              <label htmlFor="image" className="block mb-2 text-sm font-medium">
                Profile Picture
              </label>
              <input
                type="file"
                id="image"
                name="image"
                accept="image/*"
                className="w-full px-4 py-2 border rounded-md border-gray-300 focus:ring focus:ring-blue-200 focus:outline-none"
                required
              />
            </div>

            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block mb-2 text-sm font-medium">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                id="email"
                placeholder="Enter Your Email"
                className="w-full px-4 py-2 border rounded-md border-gray-300 focus:ring focus:ring-blue-200 focus:outline-none"
                required
              />
            </div>

            {/* Password Input */}
            <div>
              <label
                htmlFor="password"
                className="block mb-2 text-sm font-medium"
              >
                Password
              </label>
              <input
                type="password"
                name="password"
                id="password"
                placeholder="Enter Your Password"
                className="w-full px-4 py-2 border rounded-md border-gray-300 focus:ring focus:ring-blue-200 focus:outline-none"
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:ring focus:ring-blue-200 focus:outline-none"
              disabled={loading}
            >
              {loading ? (
                <TbFidgetSpinner className="animate-spin m-auto" />
              ) : (
                "Sign Up"
              )}
            </button>
          </div>
        </form>

        {/* Social Signup */}
        <div className="flex items-center pt-4 space-x-1">
          <div className="flex-1 h-px sm:w-16 bg-gray-300"></div>
          <p className="px-3 text-sm text-gray-400">Or sign up with</p>
          <div className="flex-1 h-px sm:w-16 bg-gray-300"></div>
        </div>
        <div
          onClick={handleGoogleSignIn}
          className="flex justify-center items-center space-x-2 border m-3 p-2 border-gray-300 rounded cursor-pointer hover:bg-gray-100"
        >
          <FcGoogle size={32} />
          <p>Google</p>
        </div>

        {/* Redirect to Login */}
        <p className="text-sm text-center text-gray-500">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;

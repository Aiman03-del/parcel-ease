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
    <div className="flex justify-center items-center min-h-screen bg-white">
      <div className="flex flex-col max-w-md p-6 rounded-md sm:p-10 bg-gray-100 text-gray-900">
        <div className="mb-8 text-center">
          <h1 className="my-3 text-4xl font-bold">Sign Up</h1>
          <p className="text-sm text-gray-400">Welcome to PlantNet</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            {/* Name Input */}
            <div>
              <label htmlFor="name" className="block mb-2 text-sm">
                Name
              </label>
              <input
                type="text"
                name="name"
                id="name"
                placeholder="Enter Your Name Here"
                className="w-full px-3 py-2 border rounded-md border-gray-300 focus:outline-lime-500 bg-gray-200 text-gray-900"
                required
              />
            </div>

            {/* Phone Input */}
            <div>
              <label htmlFor="phone" className="block mb-2 text-sm">
                Phone Number
              </label>
              <input
                type="text"
                name="phone"
                id="phone"
                placeholder="Enter Your Phone Number Here"
                className="w-full px-3 py-2 border rounded-md border-gray-300 focus:outline-lime-500 bg-gray-200 text-gray-900"
                required
              />
            </div>

            {/* Image Input */}
            <div>
              <label htmlFor="image" className="block mb-2 text-sm">
                Select Image
              </label>
              <input
                type="file"
                id="image"
                name="image"
                accept="image/*"
                className="w-full px-3 py-2 border rounded-md border-gray-300 bg-gray-200 text-gray-900"
                required
              />
            </div>

            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block mb-2 text-sm">
                Email address
              </label>
              <input
                type="email"
                name="email"
                id="email"
                placeholder="Enter Your Email Here"
                className="w-full px-3 py-2 border rounded-md border-gray-300 focus:outline-lime-500 bg-gray-200 text-gray-900"
                required
              />
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block mb-2 text-sm">
                Password
              </label>
              <input
                type="password"
                name="password"
                id="password"
                placeholder="*******"
                className="w-full px-3 py-2 border rounded-md border-gray-300 focus:outline-lime-500 bg-gray-200 text-gray-900"
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="bg-lime-500 w-full rounded-md py-3 text-white"
              disabled={loading}
            >
              {loading ? (
                <TbFidgetSpinner className="animate-spin m-auto" />
              ) : (
                "Continue"
              )}
            </button>
          </div>
        </form>

        {/* Social Signup */}
        <div className="flex items-center pt-4 space-x-1">
          <div className="flex-1 h-px sm:w-16 bg-gray-300"></div>
          <p className="px-3 text-sm text-gray-400">
            Signup with social accounts
          </p>
          <div className="flex-1 h-px sm:w-16 bg-gray-300"></div>
        </div>
        <div
          onClick={handleGoogleSignIn}
          className="flex justify-center items-center space-x-2 border m-3 p-2 border-gray-300 rounded cursor-pointer hover:bg-gray-200"
        >
          <FcGoogle size={32} />
          <p>Continue with Google</p>
        </div>

        {/* Redirect to Login */}
        <p className="px-6 text-sm text-center text-gray-400">
          Already have an account?{" "}
          <Link
            to="/login"
            className="hover:underline hover:text-lime-500 text-gray-600"
          >
            Login
          </Link>
          .
        </p>
      </div>
    </div>
  );
};

export default SignUp;

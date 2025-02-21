import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { FaCamera, FaSyncAlt } from "react-icons/fa";
import { toast } from "react-toastify";
import { imageUpload } from "../../../API/Utils";
import useAuth from "../../../hooks/useAuth";

const MyProfile = () => {
  const { user, updateUserProfile } = useAuth();
  const [image, setImage] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [file, setFile] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || "");
  const [address, setAddress] = useState(user?.address || "");

console.log(user);
  const handleProfileUpdate = async () => {
    if (!file && phoneNumber === user.phoneNumber && address === user.address) return;

    toast.info("Updating profile, please wait...");
    setIsUploading(true);

    try {
      let imageUrl = image;
      if (file) {
        imageUrl = await imageUpload(file);
        setImage(imageUrl);
      }
      await updateUserProfile(user.displayName, imageUrl, phoneNumber, address);
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Profile update failed:", error);
      toast.error("Failed to update profile!");
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };

  useEffect(() => {
    setImage(user?.photoURL);
  }, [user]);

  return (
    <motion.div
      className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-4 sm:p-6 lg:p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Helmet>
        <title> ParcelEase | My Profile</title>
      </Helmet>
      <div className="card w-full max-w-md p-6 shadow-md border rounded-lg">
        <motion.div
          className="flex flex-col items-center gap-4"
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="relative">
            <img
              src={image || "/default-avatar.png"}
              alt="Profile"
              className="h-32 w-32 rounded-full object-cover border shadow"
            />
            <label
              htmlFor="fileInput"
              className="absolute bottom-2 right-2 flex items-center justify-center w-10 h-10 bg-primary text-primary-foreground rounded-full cursor-pointer shadow-md hover:bg-primary-hover transition"
            >
              <FaCamera size={16} />
            </label>
            <input
              type="file"
              accept="image/*"
              id="fileInput"
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
          </div>
          <div className="text-center">
            <h3 className="text-lg font-medium">{user.displayName}</h3>
            <p className="text-sm">{user.email}</p>
            <div className="mt-4">
              <label className="block text-sm font-medium">Phone Number</label>
              <input
                type="text"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium">Address</label>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
          </div>
        </motion.div>

        <div className="mt-6 flex justify-center">
          <button
            onClick={handleProfileUpdate}
            className={`btn bg-blue-600 rounded p-2 max-w-sm ${
              isUploading && "btn-disabled"
            }`}
            disabled={isUploading}
          >
            {isUploading ? (
              <>
                <FaSyncAlt className="animate-spin mr-2" />
                Updating...
              </>
            ) : (
              "Update Profile"
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default MyProfile;

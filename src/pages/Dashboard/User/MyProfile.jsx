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

  const handleImageUpload = async () => {
    if (!file) return;

    toast.info("Uploading image, please wait...");
    setIsUploading(true);

    try {
      const imageUrl = await imageUpload(file);
      setImage(imageUrl);
      await updateUserProfile(user.displayName, imageUrl);
      toast.success("Image uploaded and profile updated!");
    } catch (error) {
      console.error("Image upload failed:", error);
      toast.error("Failed to upload image!");
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
      className="flex items-center justify-center min-h-screen bg-background p-4 sm:p-6 lg:p-8"
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
            <h3 className="text-lg font-medium text-foreground">
              {user.displayName}
            </h3>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
        </motion.div>

        <div className="mt-6 flex justify-center">
          <button
            onClick={handleImageUpload}
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

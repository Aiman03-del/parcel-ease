import axios from "axios";

export const imageUpload = async (imageData) => {
  try {
    const formData = new FormData();
    formData.append("image", imageData);

    const { data } = await axios.post(
      `https://api.imgbb.com/1/upload?key=${
        import.meta.env.VITE_IMGBB_API_KEY
      }`,
      formData
    );

    if (!data.success) throw new Error("Image upload failed");
    return data.data.display_url;
  } catch (error) {
    console.error("Image Upload Error:", error);
    throw new Error("Failed to upload image");
  }
};

export const saveUser = async (userData) => {
  try {
    const response = await axios.post(
      "https://server-sigma-plum.vercel.app/users",
      {
        uid: userData.uid,
        name: userData.displayName,
        email: userData.email,
        image: userData.photoURL,
        phone: userData.phone,
        role: "user",
      }
    );
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      console.error("Save User Error: Endpoint not found (404)", error);
      throw new Error("Failed to save user data: Endpoint not found (404)");
    }
    console.error("Save User Error:", error);
    throw new Error("Failed to save user data");
  }
};

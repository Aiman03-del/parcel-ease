import axios from "axios";
// Upload image and return image url

export const imageUpload = async (imageData) => {
  const formData = new FormData();
  formData.append("image", imageData);
  const { data } = await axios.post(
    `https://api.imgbb.com/1/upload?expiration=600&key=${
      import.meta.env.VITE_IMGBB_API_KEY
    }`,
    formData
  );
  return data.data.display_url;
};

export const saveUser = async (user) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/users/${user?.email}`,
      {
        name: user?.displayName,
        image: user?.photoURL,
        email: user?.email,
        phone: user?.phone || "",
        role: "user",
      }
    );
    console.log(response.data);
  } catch (error) {
    console.error("Error saving user:", error.message);
  }
};

import axios from "axios";
import { useState } from "react";

const useAxiosSecure = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const axiosSecure = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
  });

  axiosSecure.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  const get = async (url, config = {}) => {
    setLoading(true);
    try {
      const response = await axiosSecure.get(url, config);
      return response.data;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const patch = async (url, data, config = {}) => {
    setLoading(true);
    try {
      const response = await axiosSecure.patch(url, data, config);
      return response.data;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { get, patch, loading, error };
};

export default useAxiosSecure;

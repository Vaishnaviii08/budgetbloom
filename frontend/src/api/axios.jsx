import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api", // Change this to your backend URL when deployed
  headers: {
    "Content-Type": "application/json",
  },
});

// Automatically add JWT token to every request if available
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default API;
import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Automatically inject Bearer Token from localStorage if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("connexo_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;

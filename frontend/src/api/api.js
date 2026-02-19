import axios from "axios";


const api = axios.create({
  baseURL: "http://localhost:5000/api",
  // baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api",
});

export default api;

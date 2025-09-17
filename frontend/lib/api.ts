// frontend/lib/api.ts
import axios from "axios";
import { DashboardData } from "@/app/dashboard/page";

const api = axios.create({
  baseURL: "http://localhost:3001/api", // Your backend URL
});

// Add a request interceptor to include the token
api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export const fetchDashboardSummary = async (): Promise<DashboardData> => {
  try {
    const response = await api.get("/dashboard/summary");
    return response.data;
  } catch (error) {
    console.error("Failed to fetch dashboard summary:", error);
    // Re-throw the error to be handled by the component
    throw error;
  }
};

export default api;

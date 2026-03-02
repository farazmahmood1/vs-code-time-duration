import axios from "axios";
import { toast } from "sonner";

const api = axios.create({
  // baseURL: "http://localhost:3000/api",
  baseURL: `${import.meta.env.VITE_SERVER_URL?.replace(/\/$/, "")}/api`,
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const message =
      error.response?.data?.message || error.message || "Something went wrong";

    // Skip toast for auth errors (handled by auth redirects)
    if (status === 401) {
      return Promise.reject(error);
    }

    // Show error toast for all other failures
    toast.error(message);

    return Promise.reject(error);
  }
);

export default api;

export interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
    status?: number;
  };
  message: string;
}

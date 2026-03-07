import axios from "axios";
import API_CONFIG from "../config/apiConfig";

const api = axios.create({
  baseURL: `${API_CONFIG.BASE_URL}/api`,
});

// Auto-attach token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Catch 401s → clear auth → redirect to login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const isAuthRoute = error.config?.url?.includes("/users/login") ||
        error.config?.url?.includes("/users/register") ||
        error.config?.url?.includes("/auth/");
      if (!isAuthRoute) {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("userId");
        window.location.href = "/login?error=session_expired";
      }
    }
    return Promise.reject(error);
  }
);

export default api;

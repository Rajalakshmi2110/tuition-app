import axios from "axios";
import API_CONFIG from "../config/apiConfig";

const api = axios.create({
  baseURL: `${API_CONFIG.BASE_URL}/api`,
});

export default api;

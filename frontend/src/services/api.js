import axios from "axios";

const api = axios.create({
  baseURL: "https://tuitionapp-yq06.onrender.com/api",
});

export default api;

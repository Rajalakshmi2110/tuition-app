import axios from "axios";
import API_CONFIG from "../config/apiConfig";

const API_URL = `${API_CONFIG.BASE_URL}/api`;

export const getStudentClasses = async (studentId) => {
  const res = await axios.get(`${API_URL}/classes/student/${studentId}`);
  return res.data;
};

export const getTutorClasses = async (tutorId) => {
  const res = await axios.get(`${API_URL}/classes/tutor/${tutorId}`);
  return res.data;
};

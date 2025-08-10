import axios from "axios";

const API_URL = "http://localhost:5000/api";

export const getStudentClasses = async (studentId) => {
  const res = await axios.get(`${API_URL}/classes/student/${studentId}`);
  return res.data;
};

export const getTutorClasses = async (tutorId) => {
  const res = await axios.get(`${API_URL}/classes/tutor/${tutorId}`);
  return res.data;
};

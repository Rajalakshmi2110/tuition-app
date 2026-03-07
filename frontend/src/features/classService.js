import api from "../services/api";

export const getStudentClasses = async (studentId) => {
  const res = await api.get(`/classes/student/${studentId}`);
  return res.data;
};

export const getTutorClasses = async (tutorId) => {
  const res = await api.get(`/classes/tutor/${tutorId}`);
  return res.data;
};

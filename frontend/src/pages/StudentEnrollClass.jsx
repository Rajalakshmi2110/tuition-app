import React, { useEffect, useState } from "react";
import axios from "axios";
import {jwtDecode} from "jwt-decode";

const StudentEnrollClass = () => {
  const [availableClasses, setAvailableClasses] = useState([]);
  const token = localStorage.getItem("token");

  const fetchAvailableClasses = async () => {
    if (!token) return;

    try {
      const decoded = jwtDecode(token);
      const userId = decoded.id || decoded._id;

      const res = await axios.get(
        `http://localhost:5000/api/classes/available-for-student/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setAvailableClasses(res.data);
    } catch (err) {
      console.error("Failed to fetch available classes:", err);
    }
  };

  const enrollClass = async (classId) => {
    try {
      const decoded = jwtDecode(token);
      const userId = decoded.id || decoded._id;

      await axios.post(
        `http://localhost:5000/api/classes/enroll`,
        { studentId: userId, classId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Enrolled successfully!");
      fetchAvailableClasses();
    } catch (err) {
      console.error("Enrollment failed:", err);
      alert("Enrollment failed!");
    }
  };

  useEffect(() => {
    fetchAvailableClasses();
  }, [token]);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Available Classes</h2>

      {availableClasses.length === 0 ? (
        <p>No available classes at the moment.</p>
      ) : (
        <ul className="space-y-2">
          {availableClasses.map((cls) => (
            <li key={cls._id} className="border p-4 rounded shadow">
              <h3 className="text-lg font-semibold">{cls.name}</h3>
              <p>Subject: {cls.subject}</p>
              <p>Schedule: {cls.schedule}</p>
              <p>Tutor: {cls.tutor?.name || "N/A"}</p>
              <button
                onClick={() => enrollClass(cls._id)}
                className="mt-2 px-3 py-1 bg-blue-500 text-white rounded"
              >
                Enroll
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default StudentEnrollClass;

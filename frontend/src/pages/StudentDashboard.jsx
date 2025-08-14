import React, { useEffect, useState, useCallback  } from "react";
import axios from "axios";
import {jwtDecode} from "jwt-decode";
import { Link } from "react-router-dom";

const StudentDashboard = () => {
  const [enrolledClasses, setEnrolledClasses] = useState([]);
  const token = localStorage.getItem("token");

const fetchEnrolledClasses = useCallback(async () => {
  if (!token) return;

  try {
    const decoded = jwtDecode(token);
    const userId = decoded.id || decoded._id;

    const res = await axios.get(
      `http://localhost:5000/api/classes/student/${userId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setEnrolledClasses(res.data);
  } catch (err) {
    console.error("Failed to fetch enrolled classes:", err);
  }
}, [token]);

useEffect(() => {
  fetchEnrolledClasses();
}, [fetchEnrolledClasses]);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">My Enrolled Classes</h2>

      {enrolledClasses.length === 0 ? (
        <p>No classes enrolled yet.</p>
      ) : (
        <ul className="space-y-2">
          {enrolledClasses.map((cls) => (
            <li key={cls._id} className="border p-4 rounded shadow">
              <h3 className="text-lg font-semibold">{cls.name}</h3>
              <p>Subject: {cls.subject}</p>
              <p>Schedule: {cls.schedule}</p>
              <p>Tutor: {cls.tutor?.name || "N/A"}</p>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-6">
        <Link
          to="/student/enroll"
          className="text-blue-600 underline"
        >
          Enroll in Available Classes
        </Link>
      </div>

      <div className="mt-4">
        <Link to="/student/files" className="text-green-600 underline">
          View Study Materials
        </Link>
      </div>
    </div>
  );
};

export default StudentDashboard;

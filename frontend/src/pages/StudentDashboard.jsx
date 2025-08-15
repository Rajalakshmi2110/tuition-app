import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const StudentDashboard = () => {
  const [myClasses, setMyClasses] = useState([]);
  const token = localStorage.getItem("token");

  const fetchClasses = useCallback(async () => {
    if (!token) return;
    try {
      const decoded = jwtDecode(token);
      const studentClassName = decoded.className;

      const res = await axios.get(
        `http://localhost:5000/api/classes/by-classname/${encodeURIComponent(studentClassName)}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMyClasses(res.data);
    } catch (err) {
      console.error("Failed to fetch classes:", err);
    }
  }, [token]);

  useEffect(() => {
    fetchClasses();
  }, [fetchClasses]);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">My Classes</h2>

      {myClasses.length === 0 ? (
        <p>No classes assigned yet.</p>
      ) : (
        <ul className="space-y-2">
          {myClasses.map((cls) => (
            <li key={cls._id} className="border p-4 rounded shadow">
              <h3 className="text-lg font-semibold">{cls.name}</h3>
              <p>Subject: {cls.subject}</p>
              <p>Schedule: {cls.schedule}</p>
              <p>Tutor: {cls.tutor?.name || "N/A"}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default StudentDashboard;

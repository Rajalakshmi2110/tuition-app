
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const StudentDashboard = () => {
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    const fetchMyClasses = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/students/my-classes', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setClasses(res.data.enrolledClasses);
      } catch (err) {
        console.error('Failed to fetch classes', err);
      }
    };
    fetchMyClasses();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">My Enrolled Classes</h2>
      {classes.length === 0 ? (
        <p>No classes enrolled yet.</p>
      ) : (
        <ul className="space-y-2">
          {classes.map((cls) => (
            <li key={cls._id} className="border p-4 rounded shadow">
              <h3 className="text-lg font-semibold">{cls.name}</h3>
              <p>Subject: {cls.subject}</p>
              <p>Schedule: {cls.schedule}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default StudentDashboard;

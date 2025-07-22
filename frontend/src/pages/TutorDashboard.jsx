// src/pages/TutorDashboard.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TutorDashboard = () => {
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    const fetchTutorClasses = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/tutors/my-classes', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setClasses(res.data.tutorClasses);
      } catch (err) {
        console.error('Failed to fetch tutor classes', err);
      }
    };
    fetchTutorClasses();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">My Classes</h2>
      {classes.length === 0 ? (
        <p>No classes assigned.</p>
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

export default TutorDashboard;

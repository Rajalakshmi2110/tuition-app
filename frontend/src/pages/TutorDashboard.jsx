// src/pages/TutorDashboard.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/TutorDashboard.css';

const TutorDashboard = () => {
  const [classes, setClasses] = useState([]);
  const navigate = useNavigate();

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
    <div className="tutor-dashboard">
      <h2 className="dashboard-title">My Classes</h2>
      {classes.length === 0 ? (
        <p>No classes assigned.</p>
      ) : (
        <ul className="class-list">
          {classes.map((cls) => (
            <li
              key={cls._id}
              className="class-card"
              onClick={() => navigate(`/tutor/class/${cls._id}`)}
            >
              <h3>{cls.name}</h3>
              <p><strong>Subject:</strong> {cls.subject}</p>
              <p><strong>Schedule:</strong> {cls.schedule}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TutorDashboard;

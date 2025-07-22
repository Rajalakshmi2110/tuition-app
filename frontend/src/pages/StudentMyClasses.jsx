// src/pages/StudentMyClasses.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const StudentMyClasses = () => {
  const [myClasses, setMyClasses] = useState([]);

  useEffect(() => {
    const fetchMyClasses = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/students/my-classes', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMyClasses(res.data.enrolledClasses);
      } catch (error) {
        console.error('Failed to fetch my classes:', error);
      }
    };

    fetchMyClasses();
  }, []);

  return (
    <div>
      <h2>My Enrolled Classes</h2>
      {myClasses.length === 0 ? (
        <p>You have not enrolled in any classes yet.</p>
      ) : (
        <ul>
          {myClasses.map((cls) => (
            <li key={cls._id}>
              <strong>{cls.name}</strong> - {cls.subject} ({cls.schedule})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default StudentMyClasses;

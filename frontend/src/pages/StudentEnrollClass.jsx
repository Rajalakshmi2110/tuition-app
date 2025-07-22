// src/pages/StudentEnrollClass.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const StudentEnrollClass = () => {
  const [availableClasses, setAvailableClasses] = useState([]);
  const token = localStorage.getItem('token');

  const fetchClasses = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/students/available-classes', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAvailableClasses(res.data.availableClasses);
    } catch (err) {
      alert('Failed to load classes');
    }
  };

  const enroll = async (classId) => {
    try {
      await axios.post(
        'http://localhost:5000/api/students/enroll',
        { classId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Enrolled successfully!');
      fetchClasses(); // refresh after enrollment
    } catch (err) {
      alert('Enrollment failed');
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  return (
    <div>
      <h2>Available Classes</h2>
      {availableClasses.length === 0 ? (
        <p>No classes available</p>
      ) : (
        <ul>
          {availableClasses.map((cls) => (
            <li key={cls._id}>
              <strong>{cls.name}</strong> — {cls.subject} ({cls.schedule})<br />
              Tutor: {cls.tutor?.name || 'N/A'}<br />
              <button onClick={() => enroll(cls._id)}>Enroll</button>
              <hr />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default StudentEnrollClass;

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CreateClass = () => {
  const [formData, setFormData] = useState({
    name: '',
    subject: '',
    schedule: '',
    tutorId: '',
    classLevel: '',
  });

  const [tutors, setTutors] = useState([]);
  const classLevels = ["8", "9", "10", "11", "12"];

  // Fetch all tutors for selection
  useEffect(() => {
    const fetchTutors = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('https://tuitionapp-yq06.onrender.com/api/users/tutors', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTutors(res.data.tutors);
      } catch (err) {
        console.error('Error fetching tutors:', err);
      }
    };
    fetchTutors();
  }, []);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const payload = {
        name: formData.name,
        subject: formData.subject,
        schedule: formData.schedule,
        tutor: formData.tutorId,
        classLevel: formData.classLevel,
      };
      await axios.post('https://tuitionapp-yq06.onrender.com/api/classes/create', payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFormData({ name: '', subject: '', schedule: '', tutorId: '', classLevel: '' });
    } catch (err) {
      console.error('Error creating class:', err);
    }
  };

  return (
    <div style={{
      maxWidth: '500px',
      margin: '40px auto',
      padding: '30px',
      backgroundColor: '#fff',
      borderRadius: '12px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
    }}>
      <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px', textAlign: 'center' }}>
        Create a New Class
      </h2>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <input
          type="text"
          name="name"
          placeholder="Class Name"
          value={formData.name}
          onChange={handleChange}
          style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }}
          required
        />

        <input
          type="text"
          name="subject"
          placeholder="Subject"
          value={formData.subject}
          onChange={handleChange}
          style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }}
          required
        />

        <input
          type="text"
          name="schedule"
          placeholder="Schedule (e.g., Mon-Fri 6PM)"
          value={formData.schedule}
          onChange={handleChange}
          style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }}
          required
        />

        <select
          name="tutorId"
          value={formData.tutorId}
          onChange={handleChange}
          style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }}
          required
        >
          <option value="">Select Tutor</option>
          {tutors.map(tutor => (
            <option key={tutor._id} value={tutor._id}>
              {tutor.name} ({tutor.email})
            </option>
          ))}
        </select>

        <select
          name="classLevel"
          value={formData.classLevel}
          onChange={handleChange}
          style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }}
          required
        >
          <option value="">Select Class Level</option>
          {classLevels.map(level => (
            <option key={level} value={level}>{level}</option>
          ))}
        </select>

        <button
          type="submit"
          style={{
            padding: '12px',
            borderRadius: '8px',
            backgroundColor: '#007bff',
            color: '#fff',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'background 0.3s',
            border: 'none'
          }}
          onMouseOver={e => e.currentTarget.style.backgroundColor = '#0056b3'}
          onMouseOut={e => e.currentTarget.style.backgroundColor = '#007bff'}
        >
          Create Class
        </button>
      </form>
    </div>
  );
};

export default CreateClass;

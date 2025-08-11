import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminCreateClass = () => {
  const [formData, setFormData] = useState({
    name: '',
    subject: '',
    schedule: '',
    tutorId: ''
  });

  const [tutors, setTutors] = useState([]);

  useEffect(() => {
    const fetchTutors = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/users/tutors', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTutors(res.data.tutors);
      } catch (error) {
        console.error('Failed to fetch tutors', error);
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
      description: `Advanced ${formData.subject} class for ${formData.name}`,
      schedule: formData.schedule,
      tutor: formData.tutorId,
      students: []
    };

    await axios.post('http://localhost:5000/api/classes/create', payload, {
      headers: { Authorization: `Bearer ${token}` },
    });

    alert('Class created successfully!');
    setFormData({ name: '', subject: '', schedule: '', tutorId: '' });
  } catch (err) {
    console.error('Class creation failed', err);
    alert('Failed to create class');
  }
};


  return (
    <div style={{ maxWidth: '500px', margin: '20px auto', padding: '20px', backgroundColor: '#fff', border: '1px solid #ddd', borderRadius: '8px' }}>
      <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '15px' }}>Create a New Class</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Class Name"
          value={formData.name}
          onChange={handleChange}
          style={{ width: '100%', padding: '8px', marginBottom: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
          required
        />
        <input
          type="text"
          name="subject"
          placeholder="Subject"
          value={formData.subject}
          onChange={handleChange}
          style={{ width: '100%', padding: '8px', marginBottom: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
          required
        />
        <input
          type="text"
          name="schedule"
          placeholder="Schedule (e.g., Mon-Fri 6PM)"
          value={formData.schedule}
          onChange={handleChange}
          style={{ width: '100%', padding: '8px', marginBottom: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
          required
        />
        <select
          name="tutorId"
          value={formData.tutorId}
          onChange={handleChange}
          style={{ width: '100%', padding: '8px', marginBottom: '15px', borderRadius: '4px', border: '1px solid #ccc' }}
          required
        >
          <option value="">Select a Tutor</option>
          {tutors.map((tutor) => (
            <option key={tutor._id} value={tutor._id}>
              {tutor.name} ({tutor.email})
            </option>
          ))}
        </select>
        <button
          type="submit"
          style={{
            backgroundColor: '#007bff',
            color: '#fff',
            padding: '10px 15px',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Create Class
        </button>
      </form>
    </div>
  );
};

export default AdminCreateClass;

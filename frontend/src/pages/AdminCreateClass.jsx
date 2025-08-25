import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminLayout from '../components/AdminLayout';

const AdminCreateClass = () => {
  const [formData, setFormData] = useState({
    name: '',
    subject: '',
    schedule: '',
    scheduledDate: '',
    tutorId: '',
    classLevel: '',
  });

  const [tutors, setTutors] = useState([]);
  const classLevels = ["8", "9", "10", "11", "12"];

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
      await axios.post('http://localhost:5000/api/classes/create', {
        name: formData.name,
        subject: formData.subject,
        schedule: formData.schedule,
        scheduledDate: formData.scheduledDate,
        tutor: formData.tutorId,
        classLevel: formData.classLevel,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Session created successfully!');
      setFormData({ name: '', subject: '', schedule: '', scheduledDate: '', tutorId: '', classLevel: '' });
    } catch (err) {
      console.error('Session creation failed', err);
      alert('Failed to create session');
    }
  };

  return (
    <AdminLayout>
      <div style={{
        maxWidth: '500px', margin: '0 auto', padding: '30px',
        backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
      }}>
      <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>Create a New Session</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="Session Name (e.g., Math Session)" value={formData.name} onChange={handleChange} required />
        <input type="text" name="subject" placeholder="Subject" value={formData.subject} onChange={handleChange} required />
        <input type="text" name="schedule" placeholder="Time (e.g., 6:00 PM - 7:00 PM)" value={formData.schedule} onChange={handleChange} required />
        <input type="date" name="scheduledDate" value={formData.scheduledDate} onChange={handleChange} required />
        
        <select name="tutorId" value={formData.tutorId} onChange={handleChange} required>
          <option value="">Select a Tutor</option>
          {tutors.map(tutor => (
            <option key={tutor._id} value={tutor._id}>{tutor.name} ({tutor.email})</option>
          ))}
        </select>

        <select name="classLevel" value={formData.classLevel} onChange={handleChange} required>
          <option value="">Select Academic Class Level</option>
          {classLevels.map(level => (
            <option key={level} value={level}>Class {level}</option>
          ))}
        </select>

        <button type="submit" className="btn-primary">Create Session</button>
      </form>

      <style>{`
        input, select {
          width: 100%;
          padding: 12px;
          margin-bottom: 15px;
          border-radius: 8px;
          border: 1px solid #ccc;
          font-size: 16px;
        }
        .btn-primary {
          padding: 12px 20px;
          background-color: #2563eb;
          color: white;
          font-weight: 600;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .btn-primary:hover {
          background-color: #1e40af;
        }
      `}</style>
      </div>
    </AdminLayout>
  );
};

export default AdminCreateClass;

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
      await axios.post('http://localhost:5000/api/classes', formData, {
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
    <div className="max-w-xl mx-auto p-6 bg-white shadow rounded mt-8">
      <h2 className="text-2xl font-bold mb-4">Create a New Class</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Class Name"
          value={formData.name}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          required
        />
        <input
          type="text"
          name="subject"
          placeholder="Subject"
          value={formData.subject}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          required
        />
        <input
          type="text"
          name="schedule"
          placeholder="Schedule (e.g., Mon-Fri 6PM)"
          value={formData.schedule}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          required
        />
        <select
          name="tutorId"
          value={formData.tutorId}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          required
        >
          <option value="">Select a Tutor</option>
          {tutors.map((tutor) => (
            <option key={tutor._id} value={tutor._id}>
              {tutor.name} ({tutor.email})
            </option>
          ))}
        </select>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Create Class
        </button>
      </form>
    </div>
  );
};

export default AdminCreateClass;

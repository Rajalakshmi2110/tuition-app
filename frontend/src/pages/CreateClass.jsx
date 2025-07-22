// src/pages/CreateClass.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CreateClass = () => {
  const [formData, setFormData] = useState({
    name: '',
    subject: '',
    schedule: '',
    tutorId: '',
  });
  const [tutors, setTutors] = useState([]);

  // Fetch all tutors on mount
  useEffect(() => {
    const fetchTutors = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/users/tutors', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTutors(res.data.tutors);
      } catch (err) {
        console.error('Error fetching tutors', err);
      }
    };
    fetchTutors();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/classes/create', formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Class created successfully');
    } catch (err) {
      alert('Error creating class');
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Create New Class</h2>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <input
          type="text"
          name="name"
          placeholder="Class Name"
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <input
          type="text"
          name="subject"
          placeholder="Subject"
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <input
          type="text"
          name="schedule"
          placeholder="Schedule (e.g., Mon-Wed 5PM)"
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <select
          name="tutorId"
          onChange={handleChange}
          value={formData.tutorId}
          className="w-full border p-2 rounded"
        >
          <option value="">Select Tutor</option>
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

export default CreateClass;

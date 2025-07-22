// src/pages/Register.jsx
import React, { useState } from 'react';
import axios from 'axios';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'student' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/users/register', formData);
      alert('Registered successfully!');
    } catch (error) {
      alert('Registration failed');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-4 text-center text-blue-600">Register</h2>
        <input
          name="name"
          placeholder="Name"
          onChange={handleChange}
          className="w-full p-2 mb-3 border border-gray-300 rounded"
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          onChange={handleChange}
          className="w-full p-2 mb-3 border border-gray-300 rounded"
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
          className="w-full p-2 mb-3 border border-gray-300 rounded"
        />
        <select
          name="role"
          onChange={handleChange}
          value={formData.role}
          className="w-full p-2 mb-4 border border-gray-300 rounded"
        >
          <option value="student">Student</option>
          <option value="tutor">Tutor</option>
        </select>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;

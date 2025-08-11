import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: '',
    specialization: '',
    classId: ''
  });

  const [classes, setClasses] = useState([]);

  useEffect(() => {
    if (formData.role === 'student') {
      fetchClasses();
    }
  }, [formData.role]);

  const fetchClasses = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/classes', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setClasses(res.data);
    } catch (error) {
      console.error('Failed to fetch classes', error);
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting form data:", formData);
    try {
      await axios.post('http://localhost:5000/api/users/register', formData);
      alert('Registration successful!');
      setFormData({ name: '', email: '', password: '', role: '', specialization: '', classId: '' });
      navigate('/login');
    } catch (err) {
      console.error('Registration failed', err);
      alert('Failed to register');
    }
  };


  return (
    <div style={{ maxWidth: '500px', margin: '20px auto', padding: '20px', backgroundColor: '#fff', border: '1px solid #ddd', borderRadius: '8px' }}>
      <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '15px' }}>Register</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          style={{ width: '100%', padding: '8px', marginBottom: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          style={{ width: '100%', padding: '8px', marginBottom: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          style={{ width: '100%', padding: '8px', marginBottom: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
          required
        />
        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          style={{ width: '100%', padding: '8px', marginBottom: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
          required
        >
          <option value="">Select Role</option>
          <option value="tutor">Tutor</option>
          <option value="student">Student</option>
        </select>

        {formData.role === 'tutor' && (
          <input
            type="text"
            name="specialization"
            placeholder="Specialization / Subject"
            value={formData.specialization}
            onChange={handleChange}
            style={{ width: '100%', padding: '8px', marginBottom: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
            required
          />
        )}

        {formData.role === 'student' && (
          <select
            name="classId"
            value={formData.classId}
            onChange={handleChange}
            style={{ width: '100%', padding: '8px', marginBottom: '15px', borderRadius: '4px', border: '1px solid #ccc' }}
            required
          >
            <option value="">Select Class</option>
            {classes.map((cls) => (
              <option key={cls._id} value={cls._id}>
                {cls.name} - {cls.subject}
              </option>
            ))}
          </select>
        )}

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
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;

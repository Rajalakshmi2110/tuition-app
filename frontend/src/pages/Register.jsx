import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/login.css';
import Header from '../components/Header';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: '',
    specialization: '',
    className: ''
  });

  const studentClasses = ["8", "9", "10", "11", "12"];

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/auth/register', formData);
      alert('Registration successful!');
      setFormData({ name: '', email: '', password: '', role: '', specialization: '', classId: '' });
      navigate('/login');
    } catch (err) {
      console.error('Registration failed', err);
      alert(err.response?.data?.message || 'Failed to register');
    }
  };

  return (
    <div>
      <Header />
      <div className="login-container">
        <div className="login-box" style={{ maxWidth: '450px', padding: '30px' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Create an Account</h2>
          <form onSubmit={handleSubmit} className="login-form">
            {/* Full Name */}
            <input
              name="name"
              type="text"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '12px 15px', marginBottom: '15px', fontSize: '14px', borderRadius: '5px', border: '1px solid #ccc' }}
            />

            <input
              name="email"
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '12px 15px', marginBottom: '15px', fontSize: '14px', borderRadius: '5px', border: '1px solid #ccc' }}
            />

            <input
              name="password"
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '12px 15px', marginBottom: '15px', fontSize: '14px', borderRadius: '5px', border: '1px solid #ccc' }}
            />

            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '12px 15px', marginBottom: '15px', fontSize: '14px', borderRadius: '5px', border: '1px solid #ccc', backgroundColor: '#fff' }}
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
                required
                style={{ width: '100%', padding: '12px 15px', marginBottom: '15px', fontSize: '14px', borderRadius: '5px', border: '1px solid #ccc' }}
              />
            )}
            
            {formData.role === 'student' && (
            <select
              name="className"
              value={formData.className}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '12px 15px',
                marginBottom: '15px',
                fontSize: '14px',
                borderRadius: '5px',
                border: '1px solid #ccc',
                backgroundColor: '#fff'
              }}
            >
              <option value="">Select Class</option>
              {studentClasses.map(cls => (
                <option key={cls} value={cls}>{cls}</option>
              ))}
            </select>
          )}


            <button
              type="submit"
              className="login-btn"
              style={{ width: '100%', padding: '12px', fontSize: '15px', borderRadius: '5px', marginBottom: '10px' }}
            >
              Register
            </button>
          </form>
          
          <div style={{ textAlign: 'center', margin: '20px 0' }}>
            <div style={{ display: 'flex', alignItems: 'center', margin: '20px 0' }}>
              <hr style={{ flex: 1, border: 'none', borderTop: '1px solid #ccc' }} />
              <span style={{ margin: '0 15px', color: '#666' }}>OR</span>
              <hr style={{ flex: 1, border: 'none', borderTop: '1px solid #ccc' }} />
            </div>
            
            <a 
              href="http://localhost:5000/api/auth/google"
              style={{
                display: 'inline-block',
                background: '#4285f4',
                color: 'white',
                padding: '12px 20px',
                textDecoration: 'none',
                borderRadius: '5px',
                fontSize: '14px',
                fontWeight: 'bold',
                width: '100%',
                textAlign: 'center',
                boxSizing: 'border-box'
              }}
            >
              🔍 Sign up with Google
            </a>
          </div>
          
          <p style={{ textAlign: 'center', fontSize: '14px' }}>
            Already have an account? <span style={{ color: '#007bff', cursor: 'pointer' }} onClick={() => navigate('/login')}>Login</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;

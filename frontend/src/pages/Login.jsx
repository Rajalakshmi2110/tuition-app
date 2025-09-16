
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/login.css';
import Header from '../components/Header';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL || 'https://tuitionapp-yq06.onrender.com'}/api/users/login`, formData);
      console.log("login working");
      const { token, user } = res.data;
      localStorage.setItem('token', token);
      localStorage.setItem('role', user.role);
      localStorage.setItem('userId', user.id);
      if (user.role === 'admin') navigate('/admin');
      else if (user.role === 'tutor') navigate('/tutor');
      else navigate('/student');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <div> 

    <Header />
    <div className="login-container">
      
      <div className="login-box">
        <h2>Login</h2>
        <form onSubmit={handleSubmit} className="login-form">
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button type="submit" className="login-btn">Login</button>
        </form>
        
        <div style={{ textAlign: 'center', margin: '20px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', margin: '20px 0' }}>
            <hr style={{ flex: 1, border: 'none', borderTop: '1px solid #ccc' }} />
            <span style={{ margin: '0 15px', color: '#666' }}>OR</span>
            <hr style={{ flex: 1, border: 'none', borderTop: '1px solid #ccc' }} />
          </div>
          
          <a 
            href={`${process.env.REACT_APP_API_URL || 'https://tuitionapp-yq06.onrender.com'}/api/auth/google`}
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
            🔍 Sign in with Google
          </a>
        </div>
        
        <div style={{ textAlign: 'center', marginTop: '15px' }}>
          <Link to="/forgot-password">Forgot Password?</Link>
        </div>
      </div>
    </div>
    </div>
  );
};

export default Login;

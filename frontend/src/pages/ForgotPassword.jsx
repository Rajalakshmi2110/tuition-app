import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Header from '../components/Header';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('http://localhost:5000/api/auth/forgot-password', { email });
      setMessage('Password reset email sent. Check your inbox.');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error sending reset email');
    }
    setLoading(false);
  };

  return (
    <div>
      <Header />
      <div className="login-container">
        <div className="login-box">
          <h2>Reset Password</h2>
          <form onSubmit={handleSubmit} className="login-form">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>
          {message && <p style={{ marginTop: '10px', textAlign: 'center' }}>{message}</p>}
          <div style={{ textAlign: 'center', marginTop: '15px' }}>
            <Link to="/login">Back to Login</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
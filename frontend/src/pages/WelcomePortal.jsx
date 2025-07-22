// src/pages/WelcomePortal.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/welcome.css'; // <-- add this import

const WelcomePortal = () => {
  return (
    <div className="welcome-container">
      <div className="welcome-box">
        <h2>Welcome to Tuition Login Portal</h2>
        <div className="button-group">
          <Link to="/login" className="btn">Login</Link>
          <Link to="/register" className="btn">Register</Link>
        </div>
      </div>
    </div>
  );
};

export default WelcomePortal;

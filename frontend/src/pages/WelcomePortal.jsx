
import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/welcome.css';
import Header from '../components/Header';

const WelcomePortal = () => {
  return (
    <div className="welcome-portal">
      <Header />
      <div className="welcome-container">
      <main className="welcome-box">
        <h1>Welcome to Tuitix</h1>
        <p>Please log in or register to continue</p>
        <div className="button-group">
          <Link to="/login" className="btn">Login</Link>
          <Link to="/register" className="btn">Register</Link>
        </div>
      </main>
      </div>
    </div>
  );
};

export default WelcomePortal;

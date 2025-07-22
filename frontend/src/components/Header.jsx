import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/header.css';

const Header = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <header className="app-header">
      <h1 className="logo">Tuition Portal</h1>
      <nav className="nav-links">
        <Link to="/">Home</Link>

        {token && user?.role === 'student' && <Link to="/student">Student</Link>}
        {token && user?.role === 'admin' && <Link to="/admin">Admin</Link>}
        {token && user?.role === 'tutor' && <Link to="/tutor">Tutor</Link>}

        {token ? (
          <button className="logout-btn" onClick={handleLogout}>
              Logout
          </button>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;

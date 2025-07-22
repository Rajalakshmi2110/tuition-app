import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const Dashboard = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (!token || !user) {
      navigate('/login');
      return;
    }

    switch (user.role) {
      case 'admin':
        navigate('/admin');
        break;
      case 'tutor':
        navigate('/tutor');
        break;
      case 'student':
        navigate('/student');
        break;
      default:
        navigate('/login');
    }
  }, [navigate, token, user]);

  return <p>Redirecting to dashboard...</p>;
};

export default Dashboard;
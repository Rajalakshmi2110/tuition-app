import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const AuthSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');
    const role = searchParams.get('role');

    if (token && role) {
      // Store token and user info
      localStorage.setItem('token', token);
      localStorage.setItem('role', role);
      
      // Redirect based on role
      if (role === 'admin') navigate('/admin');
      else if (role === 'tutor') navigate('/tutor');
      else navigate('/student');
    } else {
      navigate('/login?error=auth_failed');
    }
  }, [navigate, searchParams]);

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      fontSize: '18px'
    }}>
      Signing you in...
    </div>
  );
};

export default AuthSuccess;
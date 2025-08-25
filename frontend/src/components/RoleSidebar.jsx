import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const RoleSidebar = ({ role }) => {
  const location = useLocation();

  const studentMenuItems = [
    { path: '/student', icon: '📊', label: 'Dashboard' },
    { path: '/student/performance', icon: '📈', label: 'My Performance' },
    { path: '/student/assignments', icon: '📝', label: 'My Assignments' },
    { path: '/student/files', icon: '📚', label: 'Study Materials' },
    { path: '/student/enroll', icon: '🎓', label: 'Enrolled Sessions' }
  ];

  const tutorMenuItems = [
    { path: '/tutor', icon: '📊', label: 'Dashboard' },
    { path: '/tutor/assignments', icon: '📝', label: 'Manage Assignments' },
    { path: '/tutor/sessions', icon: '👥', label: 'My Sessions' },
    { path: '/tutor/files', icon: '📁', label: 'File Management' },
    { path: '/tutor/student-progress', icon: '📊', label: 'Student Progress' }
  ];

  const menuItems = role === 'student' ? studentMenuItems : tutorMenuItems;

  const sidebarStyle = {
    width: '250px',
    backgroundColor: '#1f2937',
    minHeight: '100vh',
    padding: '1rem 0',
    position: 'fixed',
    left: 0,
    top: 0,
    zIndex: 1000,
    boxShadow: '2px 0 10px rgba(0,0,0,0.1)'
  };

  const menuItemStyle = (isActive) => ({
    display: 'flex',
    alignItems: 'center',
    padding: '0.75rem 1.5rem',
    color: isActive ? '#3b82f6' : '#d1d5db',
    textDecoration: 'none',
    transition: 'all 0.3s ease',
    backgroundColor: isActive ? '#374151' : 'transparent',
    borderRight: isActive ? '3px solid #3b82f6' : '3px solid transparent'
  });

  return (
    <div style={sidebarStyle}>
      <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid #374151', marginBottom: '1rem' }}>
        <h2 style={{ color: '#f9fafb', fontSize: '1.2rem', margin: 0, textTransform: 'capitalize' }}>
          {role} Portal
        </h2>
      </div>
      
      <nav>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              style={menuItemStyle(isActive)}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.target.style.backgroundColor = '#374151';
                  e.target.style.color = '#f9fafb';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.color = '#d1d5db';
                }
              }}
            >
              <span style={{ fontSize: '1.2rem', marginRight: '0.75rem' }}>{item.icon}</span>
              <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default RoleSidebar;
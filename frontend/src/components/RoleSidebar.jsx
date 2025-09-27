import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const RoleSidebar = ({ role, onWidthChange }) => {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Notify parent of width changes
  React.useEffect(() => {
    const width = isCollapsed ? 70 : 250;
    if (onWidthChange) {
      onWidthChange(width);
    }
  }, [isCollapsed, onWidthChange]);

  const studentMenuItems = [
    { path: '/student', icon: '📊', label: 'Dashboard' },
    { path: '/student/performance', icon: '📈', label: 'My Performance' },
    { path: '/student/ai-prediction', icon: '🤖', label: 'AI Prediction' },
    { path: '/student/assignments', icon: '📝', label: 'My Assignments' },
    { path: '/student/files', icon: '📚', label: 'Study Materials' },
    { path: '/student/enroll', icon: '🎓', label: 'Enrolled Sessions' },
    { path: '/student/achievements', icon: '🏆', label: 'Achievements' },
    { path: '/student/timer', icon: '⏲️', label: 'Timer & Stopwatch' },
    { path: '/student/payments', icon: '💳', label: 'Fee Payments' }
  ];

  const tutorMenuItems = [
    { path: '/tutor', icon: '📊', label: 'Dashboard' },
    { path: '/tutor/assignments', icon: '📝', label: 'Manage Assignments' },
    { path: '/tutor/sessions', icon: '👥', label: 'My Sessions' },
    { path: '/tutor/files', icon: '📁', label: 'File Management' },
    { path: '/tutor/student-progress', icon: '📊', label: 'Student Progress' },
    { path: '/tutor/analytics', icon: '📈', label: 'Performance Analytics' }
  ];

  const menuItems = role === 'student' ? studentMenuItems : tutorMenuItems;

  const sidebarStyle = {
    width: isCollapsed ? '70px' : '250px',
    backgroundColor: '#1f2937',
    minHeight: '100vh',
    padding: '1rem 0',
    position: 'fixed',
    left: 0,
    top: 0,
    zIndex: 1000,
    boxShadow: '2px 0 10px rgba(0,0,0,0.1)',
    transition: 'all 0.3s ease'
  };

  const menuItemStyle = (isActive) => ({
    display: 'flex',
    alignItems: 'center',
    padding: '0.75rem 1.5rem',
    color: isActive ? '#3b82f6' : '#d1d5db',
    textDecoration: 'none',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    backgroundColor: isActive ? '#374151' : 'transparent',
    borderRight: isActive ? '3px solid #3b82f6' : '3px solid transparent',
    transform: 'translateX(0)',
    position: 'relative',
    overflow: 'hidden'
  });

  return (
    <div style={sidebarStyle}>
      <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid #374151', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {!isCollapsed && (
            <h2 style={{ color: '#f9fafb', fontSize: '1.2rem', margin: 0, textTransform: 'capitalize' }}>
              {role} Portal
            </h2>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            style={{
              background: 'none',
              border: 'none',
              color: '#d1d5db',
              fontSize: '1.2rem',
              cursor: 'pointer',
              padding: '0.25rem',
              borderRadius: '4px',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#374151'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
          >
            {isCollapsed ? '→' : '←'}
          </button>
        </div>
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
                  e.target.style.transform = 'translateX(5px)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.color = '#d1d5db';
                  e.target.style.transform = 'translateX(0)';
                }
              }}
            >
              <span style={{ fontSize: '1.2rem', marginRight: isCollapsed ? '0' : '0.75rem', transition: 'all 0.3s ease' }}>{item.icon}</span>
              {!isCollapsed && (
                <span style={{ fontSize: '0.9rem', fontWeight: '500', opacity: 1, transition: 'opacity 0.3s ease' }}>{item.label}</span>
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default RoleSidebar;
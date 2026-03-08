import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import kalviLogo from '../assets/logo.png';

const RoleSidebar = ({ role, onWidthChange }) => {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (!mobile) setMobileOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (isMobile) {
      onWidthChange?.(0);
    } else {
      onWidthChange?.(isCollapsed ? 70 : 260);
    }
  }, [isCollapsed, isMobile, onWidthChange]);

  // Close mobile drawer on navigation
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const studentMenuItems = [
    { path: '/student', icon: '◇', label: 'Dashboard' },
    { path: '/student/performance', icon: '△', label: 'My Performance' },
    { path: '/student/ai-prediction', icon: '⟡', label: 'AI Prediction' },
    { path: '/student/assignments', icon: '☰', label: 'My Assignments' },
    { path: '/student/files', icon: '▣', label: 'Study Materials' },
    { path: '/student/resources', icon: '📚', label: 'Resource Library' },
    { path: '/student/enroll', icon: '○', label: 'Enrolled Sessions' },
    { path: '/student/achievements', icon: '☆', label: 'Achievements' },
    { path: '/student/timer', icon: '◎', label: 'Timer & Stopwatch' },
    { path: '/student/payments', icon: '◈', label: 'Fee Payments' }
  ];

  const tutorMenuItems = [
    { path: '/tutor', icon: '◇', label: 'Dashboard' },
    { path: '/tutor/assignments', icon: '☰', label: 'Manage Assignments' },
    { path: '/tutor/sessions', icon: '○', label: 'My Sessions' },
    { path: '/tutor/files', icon: '▣', label: 'File Management' },
    { path: '/tutor/resources', icon: '📚', label: 'Resource Library' },
    { path: '/tutor/student-progress', icon: '△', label: 'Student Progress' },
    { path: '/tutor/analytics', icon: '⟡', label: 'Performance Analytics' }
  ];

  const menuItems = role === 'student' ? studentMenuItems : tutorMenuItems;
  const showSidebar = isMobile ? mobileOpen : true;
  const sidebarWidth = isMobile ? '280px' : (isCollapsed ? '70px' : '260px');

  return (
    <>
      {/* Mobile hamburger button */}
      {isMobile && !mobileOpen && (
        <button
          onClick={() => setMobileOpen(true)}
          style={{
            position: 'fixed', top: '1rem', left: '1rem', zIndex: 1001,
            width: '44px', height: '44px', borderRadius: '12px',
            background: 'linear-gradient(135deg, #0f172a 0%, #064e3b 100%)',
            border: 'none', cursor: 'pointer',
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            justifyContent: 'center', gap: '4px',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)'
          }}
          aria-label="Open menu"
        >
          <span style={{ display: 'block', width: '18px', height: '2px', background: 'white', borderRadius: '2px' }} />
          <span style={{ display: 'block', width: '18px', height: '2px', background: 'white', borderRadius: '2px' }} />
          <span style={{ display: 'block', width: '18px', height: '2px', background: 'white', borderRadius: '2px' }} />
        </button>
      )}

      {/* Mobile backdrop */}
      {isMobile && mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)', zIndex: 999,
            animation: 'fadeInOverlay 0.2s ease'
          }}
        />
      )}

      {/* Sidebar */}
      {showSidebar && (
        <div style={{
          width: sidebarWidth,
          background: 'linear-gradient(180deg, #0f172a 0%, #064e3b 100%)',
          minHeight: '100vh',
          padding: '1rem 0',
          position: 'fixed',
          left: 0, top: 0,
          zIndex: 1000,
          boxShadow: '4px 0 20px rgba(0, 0, 0, 0.15)',
          transition: isMobile ? 'none' : 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          display: 'flex',
          flexDirection: 'column',
          animation: isMobile ? 'slideInFromLeft 0.3s ease' : 'none'
        }}>
          {/* Header */}
          <div style={{
            padding: (isCollapsed && !isMobile) ? '1rem 0.5rem' : '1rem 1.5rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            marginBottom: '1rem'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: (isCollapsed && !isMobile) ? 'center' : 'space-between',
              alignItems: 'center'
            }}>
              {(!isCollapsed || isMobile) && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <img src={kalviLogo} alt="Kalvi Logo" style={{ width: '36px', height: '36px', objectFit: 'contain' }} />
                  <h2 style={{ color: 'white', fontSize: '1rem', fontWeight: 700, margin: 0, textTransform: 'capitalize' }}>
                    {role} Portal
                  </h2>
                </div>
              )}
              <button
                onClick={() => isMobile ? setMobileOpen(false) : setIsCollapsed(!isCollapsed)}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)', border: 'none', color: '#94a3b8',
                  width: '32px', height: '32px', borderRadius: '8px', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.2s ease', fontSize: '0.9rem'
                }}
                onMouseEnter={(e) => { e.target.style.background = 'rgba(16, 185, 129, 0.2)'; e.target.style.color = '#10b981'; }}
                onMouseLeave={(e) => { e.target.style.background = 'rgba(255, 255, 255, 0.1)'; e.target.style.color = '#94a3b8'; }}
              >
                {isMobile ? '✕' : (isCollapsed ? '→' : '←')}
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav style={{ flex: 1, padding: '0 0.5rem', overflowY: 'auto' }}>
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              const collapsed = isCollapsed && !isMobile;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '0.75rem',
                    padding: collapsed ? '0.75rem' : '0.75rem 1rem',
                    margin: '0.25rem 0', borderRadius: '10px',
                    color: isActive ? 'white' : '#94a3b8',
                    textDecoration: 'none',
                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                    background: isActive
                      ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.3) 0%, rgba(16, 185, 129, 0.1) 100%)'
                      : 'transparent',
                    borderLeft: isActive ? '3px solid #10b981' : '3px solid transparent',
                    justifyContent: collapsed ? 'center' : 'flex-start',
                    position: 'relative', overflow: 'hidden'
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                      e.currentTarget.style.color = 'white';
                      e.currentTarget.style.transform = 'translateX(4px)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.color = '#94a3b8';
                      e.currentTarget.style.transform = 'translateX(0)';
                    }
                  }}
                  title={collapsed ? item.label : ''}
                >
                  <span style={{ fontSize: '1.1rem', width: '24px', textAlign: 'center', flexShrink: 0 }}>
                    {item.icon}
                  </span>
                  {!collapsed && (
                    <span style={{ fontSize: '0.9rem', fontWeight: 500, whiteSpace: 'nowrap' }}>
                      {item.label}
                    </span>
                  )}
                  {isActive && (
                    <div style={{
                      position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)',
                      width: '3px', height: '60%', background: '#10b981',
                      borderRadius: '0 3px 3px 0', boxShadow: '0 0 10px rgba(16, 185, 129, 0.5)'
                    }} />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div style={{
            padding: (isCollapsed && !isMobile) ? '1rem 0.5rem' : '1rem 1.5rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            marginTop: 'auto'
          }}>
            <Link to="/" style={{
              display: 'flex', alignItems: 'center', gap: '0.75rem',
              padding: '0.75rem', borderRadius: '10px', color: '#94a3b8',
              textDecoration: 'none', transition: 'all 0.2s ease',
              justifyContent: (isCollapsed && !isMobile) ? 'center' : 'flex-start'
            }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'; e.currentTarget.style.color = 'white'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#94a3b8'; }}
              title={(isCollapsed && !isMobile) ? 'Back to Home' : ''}
            >
              <span style={{ fontSize: '1.1rem' }}>⌂</span>
              {(!isCollapsed || isMobile) && <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>Back to Home</span>}
            </Link>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeInOverlay { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideInFromLeft { from { transform: translateX(-100%); } to { transform: translateX(0); } }
      `}</style>
    </>
  );
};

export default RoleSidebar;

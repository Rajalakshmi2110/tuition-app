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
    { path: '/student', label: 'Dashboard', icon: (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg>) },
    { path: '/student/performance', label: 'My Performance', icon: (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></svg>) },
    { path: '/student/ai-prediction', label: 'AI Prediction', icon: (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" /></svg>) },
    { path: '/student/assignments', label: 'My Assignments', icon: (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></svg>) },
    { path: '/student/resources', label: 'Study Materials', icon: (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></svg>) },
    { path: '/student/enroll', label: 'Enrolled Sessions', icon: (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>) },
    { path: '/student/achievements', label: 'Achievements', icon: (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="7" /><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" /></svg>) },
    { path: '/student/ask-ai', label: 'Ask AI Doubt', icon: (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>) },
    { path: '/student/timer', label: 'Timer & Stopwatch', icon: (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>) },
    { path: '/student/payments', label: 'Fee Payments', icon: (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2" /><line x1="1" y1="10" x2="23" y2="10" /></svg>) },
    { path: '/student/profile', label: 'My Profile', icon: (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>) }
  ];

  const tutorMenuItems = [
    { path: '/tutor', label: 'Dashboard', icon: (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg>) },
    { path: '/tutor/assignments', label: 'Manage Assignments', icon: (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></svg>) },
    { path: '/tutor/sessions', label: 'My Sessions', icon: (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>) },
    { path: '/tutor/resources', label: 'Study Materials', icon: (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></svg>) },
    { path: '/tutor/student-progress', label: 'Student Progress', icon: (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>) },
    { path: '/tutor/analytics', label: 'Performance Analytics', icon: (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></svg>) },
    { path: '/tutor/profile', label: 'My Profile', icon: (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>) }
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
                {isMobile ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                ) : isCollapsed ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6" /></svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6" /></svg>
                )}
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
                  <span style={{ width: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
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
              <span style={{ width: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
              </span>
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

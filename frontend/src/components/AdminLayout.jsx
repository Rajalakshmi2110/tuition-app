import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import kalviLogo from '../assets/logo.png';

const AdminLayout = ({ children, showAnnouncementForm, setShowAnnouncementForm }) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

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
    setMobileOpen(false);
  }, [location.pathname]);

  const menuItems = [
    { path: '/admin', label: 'Dashboard', icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
      </svg>
    )},
    { path: '/admin/files', label: 'View All Files', icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
      </svg>
    )},
    { path: '/admin/classes', label: 'View Sessions', icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    )},
    { path: '/admin/create-class', label: 'Create Session', icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="16" />
        <line x1="8" y1="12" x2="16" y2="12" />
      </svg>
    )},
    { path: '/admin/feedback', label: 'Manage Feedback', icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    )},
    { path: '/admin/gallery', label: 'Gallery', icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        <circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" />
      </svg>
    )},
    { path: '/admin/payments', label: 'Payment Management', icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
        <line x1="1" y1="10" x2="23" y2="10" />
      </svg>
    )},
    { path: '/admin/reports', label: 'Reports & Analytics', icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
      </svg>
    )}
  ];

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      localStorage.removeItem('userId');
      navigate('/');
    }
  };

  const showSidebar = isMobile ? mobileOpen : true;
  const sidebarWidth = isMobile ? '280px' : (isMinimized ? '70px' : '260px');

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f1f5f9' }}>

      {/* Mobile hamburger */}
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
          padding: '1rem 0',
          position: 'fixed', left: 0, top: 0, bottom: 0,
          zIndex: 1000,
          boxShadow: '4px 0 20px rgba(0, 0, 0, 0.15)',
          transition: isMobile ? 'none' : 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          display: 'flex', flexDirection: 'column',
          animation: isMobile ? 'slideInFromLeft 0.3s ease' : 'none'
        }}>
          {/* Header */}
          <div style={{
            padding: (isMinimized && !isMobile) ? '1rem 0.5rem' : '1rem 1.5rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            marginBottom: '1rem'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: (isMinimized && !isMobile) ? 'center' : 'space-between',
              alignItems: 'center'
            }}>
              {(!isMinimized || isMobile) && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <img src={kalviLogo} alt="Kalvi Logo" style={{ width: '36px', height: '36px', objectFit: 'contain' }} />
                  <h2 style={{ color: 'white', fontSize: '1rem', fontWeight: 700, margin: 0 }}>Admin Panel</h2>
                </div>
              )}
              <button
                onClick={() => isMobile ? setMobileOpen(false) : setIsMinimized(!isMinimized)}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)', border: 'none', color: '#94a3b8',
                  width: '32px', height: '32px', borderRadius: '8px', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.2s ease', fontSize: '0.9rem'
                }}
                onMouseEnter={(e) => { e.target.style.background = 'rgba(16, 185, 129, 0.2)'; e.target.style.color = '#10b981'; }}
                onMouseLeave={(e) => { e.target.style.background = 'rgba(255, 255, 255, 0.1)'; e.target.style.color = '#94a3b8'; }}
              >
                {isMobile ? '✕' : (isMinimized ? '→' : '←')}
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav style={{ flex: 1, padding: '0 0.5rem', overflowY: 'auto' }}>
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              const collapsed = isMinimized && !isMobile;
              return (
                <Link key={item.path} to={item.path} style={{
                  display: 'flex', alignItems: 'center', gap: '0.75rem',
                  padding: collapsed ? '0.75rem' : '0.75rem 1rem',
                  margin: '0.25rem 0', borderRadius: '10px',
                  color: isActive ? 'white' : '#94a3b8', textDecoration: 'none',
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  background: isActive ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.3) 0%, rgba(16, 185, 129, 0.1) 100%)' : 'transparent',
                  borderLeft: isActive ? '3px solid #10b981' : '3px solid transparent',
                  justifyContent: collapsed ? 'center' : 'flex-start'
                }}
                  onMouseEnter={(e) => { if (!isActive) { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'; e.currentTarget.style.color = 'white'; } }}
                  onMouseLeave={(e) => { if (!isActive) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#94a3b8'; } }}
                  title={collapsed ? item.label : ''}
                >
                  <span style={{ width: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{item.icon}</span>
                  {!collapsed && <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>{item.label}</span>}
                </Link>
              );
            })}

            {/* Post Announcement */}
            <button
              onClick={() => {
                setMobileOpen(false);
                if (setShowAnnouncementForm) setShowAnnouncementForm(true);
                else window.location.href = '/admin';
              }}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.75rem',
                padding: (isMinimized && !isMobile) ? '0.75rem' : '0.75rem 1rem',
                margin: '0.25rem 0', borderRadius: '10px', color: '#fbbf24',
                background: 'rgba(251, 191, 36, 0.1)', border: 'none', cursor: 'pointer',
                transition: 'all 0.2s ease',
                justifyContent: (isMinimized && !isMobile) ? 'center' : 'flex-start',
                width: '100%', textAlign: 'left'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(251, 191, 36, 0.2)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(251, 191, 36, 0.1)'; }}
              title={(isMinimized && !isMobile) ? 'Post Announcement' : ''}
            >
              <span style={{ width: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                </svg>
              </span>
              {(!isMinimized || isMobile) && <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>Post Announcement</span>}
            </button>
          </nav>

          {/* Footer */}
          <div style={{
            padding: (isMinimized && !isMobile) ? '1rem 0.5rem' : '1rem 1.5rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)', marginTop: 'auto'
          }}>
            <Link to="/" style={{
              display: 'flex', alignItems: 'center', gap: '0.75rem',
              padding: '0.75rem', borderRadius: '10px', color: '#94a3b8',
              textDecoration: 'none', transition: 'all 0.2s ease',
              justifyContent: (isMinimized && !isMobile) ? 'center' : 'flex-start',
              marginBottom: '0.5rem'
            }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'; e.currentTarget.style.color = 'white'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#94a3b8'; }}
            >
              <span style={{ width: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
              </span>
              {(!isMinimized || isMobile) && <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>Back to Home</span>}
            </Link>

            <button onClick={handleLogout} style={{
              display: 'flex', alignItems: 'center', gap: '0.75rem',
              padding: '0.75rem', borderRadius: '10px', color: '#ef4444',
              background: 'rgba(239, 68, 68, 0.1)', border: 'none', cursor: 'pointer',
              transition: 'all 0.2s ease',
              justifyContent: (isMinimized && !isMobile) ? 'center' : 'flex-start',
              width: '100%'
            }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'; }}
            >
              <span style={{ width: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
                </svg>
              </span>
              {(!isMinimized || isMobile) && <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>Logout</span>}
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div style={{
        flex: 1,
        marginLeft: isMobile ? 0 : (isMinimized ? '70px' : '260px'),
        transition: isMobile ? 'none' : 'margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        display: 'flex', flexDirection: 'column', minHeight: '100vh'
      }}>
        {/* Top Header */}
        <header style={{
          background: 'white',
          padding: isMobile ? '1rem 1rem 1rem 4rem' : '1rem 2rem',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          position: 'sticky', top: 0, zIndex: 100,
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
          flexWrap: 'wrap', gap: '0.5rem'
        }}>
          <div>
            <h1 style={{ fontSize: isMobile ? '1.2rem' : '1.5rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
              Admin Dashboard
            </h1>
            {!isMobile && (
              <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0 }}>Manage your tuition platform</p>
            )}
          </div>
          {!isMobile && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: '0.75rem',
              padding: '0.5rem 1rem', background: '#f8fafc',
              borderRadius: '12px', border: '1px solid #e2e8f0'
            }}>
              <div style={{
                width: '36px', height: '36px',
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <path d="M9 12l2 2 4-4" />
                </svg>
              </div>
              <div>
                <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: 600, color: '#0f172a' }}>Administrator</p>
                <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748b' }}>Full Access</p>
              </div>
            </div>
          )}
        </header>

        {/* Content Area */}
        <main style={{ flex: 1, padding: isMobile ? '1rem' : '2rem', overflowY: 'auto' }}>
          <div style={{ animation: 'fadeIn 0.4s ease-out' }}>
            {children}
          </div>
        </main>

        {/* Footer */}
        <footer style={{
          padding: '1rem 2rem', background: 'white',
          borderTop: '1px solid #e2e8f0', textAlign: 'center'
        }}>
          <p style={{ margin: 0, fontSize: '0.85rem', color: '#94a3b8' }}>
            © {new Date().getFullYear()} Kalvi Admin Panel
          </p>
        </footer>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeInOverlay { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideInFromLeft { from { transform: translateX(-100%); } to { transform: translateX(0); } }
      `}</style>
    </div>
  );
};

export default AdminLayout;

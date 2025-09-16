import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import RoleSidebar from './RoleSidebar';
import Header from './Header';

const RoleLayout = ({ role }) => {
  const [sidebarWidth, setSidebarWidth] = useState(250);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleSidebarChange = () => {
      const sidebar = document.querySelector('[data-sidebar] > div');
      if (sidebar) {
        const width = sidebar.offsetWidth;
        setSidebarWidth(width);
      }
    };

    // Initial check
    setTimeout(handleSidebarChange, 100);
    
    // Listen for sidebar changes
    const interval = setInterval(handleSidebarChange, 100);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', position: 'relative' }}>
      {/* Mobile Menu Button */}
      <button 
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        style={{
          display: 'none',
          position: 'fixed',
          top: '1rem',
          left: '1rem',
          zIndex: 1002,
          backgroundColor: '#20205c',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          padding: '0.75rem',
          cursor: 'pointer',
          fontSize: '1.2rem'
        }}
        className="mobile-menu-btn"
      >
        ☰
      </button>
      <div data-sidebar style={{ position: 'fixed', zIndex: 1000 }} className={`role-sidebar ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
        <RoleSidebar role={role} onWidthChange={setSidebarWidth} />
      </div>
      <div style={{ 
        flex: 1, 
        marginLeft: `${sidebarWidth}px`,
        transition: 'margin-left 0.3s ease',
        width: `calc(100% - ${sidebarWidth}px)`
      }}>
        <Header />
        <main style={{ 
          padding: '2rem', 
          backgroundColor: '#f9fafb', 
          minHeight: 'calc(100vh - 80px)',
          marginTop: '80px'
        }} className="role-content">
          <div style={{
            animation: 'fadeIn 0.5s ease-in-out'
          }}>
            <Outlet />
          </div>
        </main>
      </div>
      
      <style>{`
        @media (max-width: 768px) {
          .mobile-menu-btn { display: block !important; }
          .role-sidebar {
            left: -250px;
            transition: left 0.3s ease;
          }
          .role-sidebar.mobile-open {
            left: 0;
          }
          .role-content {
            padding: 1rem !important;
            margin-top: 60px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default RoleLayout;
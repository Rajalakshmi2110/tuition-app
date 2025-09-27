import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import RoleSidebar from './RoleSidebar';
import Header from './Header';

const RoleLayout = ({ role }) => {
  const [sidebarWidth, setSidebarWidth] = useState(250);

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
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <div data-sidebar style={{ position: 'fixed', zIndex: 1000 }}>
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
        }}>
          <div style={{
            animation: 'fadeIn 0.5s ease-in-out'
          }}>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default RoleLayout;
import React from 'react';
import { Outlet } from 'react-router-dom';
import RoleSidebar from './RoleSidebar';
import Header from './Header';

const RoleLayout = ({ role }) => {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <RoleSidebar role={role} />
      <div style={{ flex: 1, marginLeft: '250px' }}>
        <Header />
        <main style={{ 
          padding: '2rem', 
          backgroundColor: '#f9fafb', 
          minHeight: 'calc(100vh - 80px)',
          marginTop: '80px'
        }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default RoleLayout;
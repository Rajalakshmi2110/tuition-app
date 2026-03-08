import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import '../styles/layout.css';

const Layout = () => {
  return (
    <>
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <Header />
      <main id="main-content">
        <Outlet /> 
      </main>
      <Footer />
    </>
  );
};

export default Layout;

import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import '../styles/layout.css';

const Layout = () => {
  return (
    <>
      <Header />
      <main>
        <Outlet /> {/* This is where the page content loads */}
      </main>
      <Footer />
    </>
  );
};

export default Layout;


import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/header.css';

const Header = () => {
  return (
    <header className="app-header">
      <div className="logo">MyTuition</div>
      <nav className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        {/* <Link to="/contact">Contact</Link> */}
        <Link to="/" onClick={() => {
          setTimeout(() => {
            document.getElementById("footer")?.scrollIntoView({ behavior: "smooth" });
          }, 100);
        }}>Contact</Link>

      </nav>
    </header>
  );
};

export default Header;

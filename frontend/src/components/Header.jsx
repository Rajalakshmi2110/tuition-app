import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/header.css';



const Header = () => {
  return (
    <>
      <style>{`
        .nav-links {
          margin-left: 40px; /* pushes links slightly right */
        }
        .my-account-link {
          margin-left: 10px; /* small gap after Contact */
        }
      `}</style>

      <header className="app-header">
        <div className="logo">MyTuition</div>
        <nav className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link
            to="/"
            onClick={(e) => {
              e.preventDefault();
              setTimeout(() => {
                document.getElementById("footer")?.scrollIntoView({ behavior: "smooth" });
              }, 100);
            }}
          >
            Contact
          </Link>
          <Link to="/account" className="my-account-link">
            My Account
          </Link>
        </nav>
      </header>
    </>
  );
};

export default Header;

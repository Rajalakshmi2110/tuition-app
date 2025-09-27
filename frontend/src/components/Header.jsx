import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/header.css';

const Header = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  
  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('token');
      navigate('/');
    }
    setShowDropdown(false);
  };
  return (
    <>
      <style>{`
        .nav-links {
          margin-left: 40px; /* pushes links slightly right */
        }
        .my-account-link {
          margin-left: 10px; /* small gap after Contact */
          position: relative;
        }
        .account-dropdown {
          position: absolute;
          top: calc(100% + 8px);
          right: 0;
          background: white;
          border: none;
          border-radius: 12px;
          box-shadow: 0 8px 25px rgba(0,0,0,0.15);
          min-width: 180px;
          z-index: 1000;
          overflow: hidden;
          animation: dropdownFade 0.2s ease-out;
        }
        @keyframes dropdownFade {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .dropdown-item {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 14px 18px;
          color: #374151;
          text-decoration: none;
          border: none;
          background: none;
          width: 100%;
          text-align: left;
          cursor: pointer;
          transition: all 0.2s ease;
          font-size: 14px;
          font-weight: 500;
        }
        .dropdown-item:hover {
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
          color: #1e293b;
        }
        .logout-btn {
          color: #ef4444;
          border-top: 1px solid #f1f5f9;
        }
        .logout-btn:hover {
          background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
          color: #dc2626;
        }
        .account-btn {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 25px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 600;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
        }
        .account-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
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
          {token ? (
            <div className="my-account-link">
              <button 
                onClick={() => setShowDropdown(!showDropdown)}
                className="account-btn"
              >
                👤 My Account
              </button>
              {showDropdown && (
                <>
                  <div 
                    style={{
                      position: 'fixed',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      zIndex: 999
                    }}
                    onClick={() => setShowDropdown(false)}
                  />
                  <div className="account-dropdown">
                    <Link to="/profile" className="dropdown-item">
                      👤 <span>Profile</span>
                    </Link>
                    <button 
                      onClick={handleLogout} 
                      className="dropdown-item logout-btn"
                    >
                      🚪 <span>Logout</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <Link to="/login" className="my-account-link">
              Login
            </Link>
          )}
        </nav>
      </header>
    </>
  );
};

export default Header;

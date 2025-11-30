import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import kalviyagamLogo from '../assets/logo.png';

const Header = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      localStorage.removeItem('userId');
      navigate('/');
    }
    setShowDropdown(false);
  };

  const getDashboardLink = () => {
    if (role === 'admin') return '/admin';
    if (role === 'tutor') return '/tutor';
    return '/student';
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header style={{
      background: 'linear-gradient(135deg, #064e3b 0%, #0f172a 100%)',
      padding: '1rem 2rem',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        {/* Logo */}
        <Link to="/" style={{
          textDecoration: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <img 
            src={kalviyagamLogo} 
            alt="Kalviyagam Logo" 
            style={{
              width: '40px',
              height: '40px',
              objectFit: 'contain'
            }}
          />
          <span style={{
            fontSize: '1.5rem',
            fontWeight: 800,
            color: 'white',
            letterSpacing: '-0.02em'
          }}>
            Kalviyagam
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <NavLink to="/" active={isActive('/')}>Home</NavLink>
          <NavLink to="/about" active={isActive('/about')}>About</NavLink>
          <button
            onClick={() => {
              const footer = document.getElementById("footer");
              if (footer) {
                footer.scrollIntoView({ behavior: "smooth" });
              } else {
                navigate('/');
                setTimeout(() => {
                  document.getElementById("footer")?.scrollIntoView({ behavior: "smooth" });
                }, 300);
              }
            }}
            style={{
              color: 'rgba(255, 255, 255, 0.8)',
              textDecoration: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              fontSize: '0.95rem',
              fontWeight: 500,
              transition: 'all 0.2s ease',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.target.style.color = 'white';
              e.target.style.background = 'rgba(255, 255, 255, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.target.style.color = 'rgba(255, 255, 255, 0.8)';
              e.target.style.background = 'transparent';
            }}
          >
            Contact
          </button>

          {token ? (
            <div style={{ position: 'relative', marginLeft: '0.5rem' }}>
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  color: 'white',
                  border: 'none',
                  padding: '0.6rem 1.2rem',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-1px)';
                  e.target.style.boxShadow = '0 6px 16px rgba(16, 185, 129, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.3)';
                }}
              >
                <span style={{
                  width: '24px',
                  height: '24px',
                  background: 'rgba(255, 255, 255, 0.2)',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.7rem',
                  fontWeight: 600
                }}>
                  A
                </span>
                My Account
                <span style={{ fontSize: '0.7rem', transition: 'transform 0.2s ease', transform: showDropdown ? 'rotate(180deg)' : 'rotate(0)' }}>▼</span>
              </button>

              {showDropdown && (
                <>
                  {/* Backdrop */}
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
                  
                  {/* Dropdown Menu */}
                  <div style={{
                    position: 'absolute',
                    top: 'calc(100% + 8px)',
                    right: 0,
                    background: 'white',
                    borderRadius: '12px',
                    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)',
                    minWidth: '200px',
                    zIndex: 1000,
                    overflow: 'hidden',
                    animation: 'dropdownFade 0.2s ease-out',
                    border: '1px solid rgba(0, 0, 0, 0.05)'
                  }}>
                    <Link
                      to={getDashboardLink()}
                      onClick={() => setShowDropdown(false)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        padding: '0.9rem 1.2rem',
                        color: '#374151',
                        textDecoration: 'none',
                        fontSize: '0.9rem',
                        fontWeight: 500,
                        transition: 'all 0.2s ease',
                        borderBottom: '1px solid #f1f5f9'
                      }}
                      onMouseEnter={(e) => e.target.style.background = '#f8fafc'}
                      onMouseLeave={(e) => e.target.style.background = 'transparent'}
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={handleLogout}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        padding: '0.9rem 1.2rem',
                        color: '#ef4444',
                        background: 'none',
                        border: 'none',
                        width: '100%',
                        textAlign: 'left',
                        cursor: 'pointer',
                        fontSize: '0.9rem',
                        fontWeight: 500,
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => e.target.style.background = '#fef2f2'}
                      onMouseLeave={(e) => e.target.style.background = 'transparent'}
                    >
                      Logout
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              style={{
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: 'white',
                padding: '0.6rem 1.5rem',
                borderRadius: '10px',
                textDecoration: 'none',
                fontSize: '0.9rem',
                fontWeight: 600,
                marginLeft: '0.5rem',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
                display: 'inline-block'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-1px)';
                e.target.style.boxShadow = '0 6px 16px rgba(16, 185, 129, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.3)';
              }}
            >
              Login
            </Link>
          )}
        </nav>
      </div>

      {/* Animation styles */}
      <style>{`
        @keyframes dropdownFade {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </header>
  );
};

// Nav Link Component
const NavLink = ({ to, active, children }) => (
  <Link
    to={to}
    style={{
      color: active ? 'white' : 'rgba(255, 255, 255, 0.8)',
      textDecoration: 'none',
      padding: '0.5rem 1rem',
      borderRadius: '8px',
      fontSize: '0.95rem',
      fontWeight: 500,
      background: active ? 'rgba(16, 185, 129, 0.2)' : 'transparent',
      transition: 'all 0.2s ease'
    }}
    onMouseEnter={(e) => {
      if (!active) {
        e.target.style.color = 'white';
        e.target.style.background = 'rgba(255, 255, 255, 0.1)';
      }
    }}
    onMouseLeave={(e) => {
      if (!active) {
        e.target.style.color = 'rgba(255, 255, 255, 0.8)';
        e.target.style.background = 'transparent';
      }
    }}
  >
    {children}
  </Link>
);

export default Header;

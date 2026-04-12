import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import kalviyagamLogo from '../assets/logo.png';

const Header = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setShowDropdown(false);
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('userId');
    navigate('/');
    setShowDropdown(false);
    setMobileMenuOpen(false);
  };

  const getDashboardLink = () => {
    if (role === 'admin') return '/admin';
    if (role === 'tutor') return '/tutor';
    return '/student';
  };

  const isActive = (path) => location.pathname === path;

  const scrollToFooter = () => {
    setMobileMenuOpen(false);
    const footer = document.getElementById("footer");
    if (footer) {
      footer.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate('/');
      setTimeout(() => {
        document.getElementById("footer")?.scrollIntoView({ behavior: "smooth" });
      }, 300);
    }
  };

  return (
    <>
      <header style={{
        background: 'linear-gradient(135deg, #064e3b 0%, #0f172a 100%)',
        padding: '1rem 1.5rem',
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
              style={{ width: '40px', height: '40px', objectFit: 'contain' }}
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
          {!isMobile && (
            <nav style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <NavLink to="/" active={isActive('/')}>Home</NavLink>
              <NavLink to="/about" active={isActive('/about')}>About</NavLink>
              <button onClick={scrollToFooter} style={{
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
                onMouseEnter={(e) => { e.target.style.color = 'white'; e.target.style.background = 'rgba(255, 255, 255, 0.1)'; }}
                onMouseLeave={(e) => { e.target.style.color = 'rgba(255, 255, 255, 0.8)'; e.target.style.background = 'transparent'; }}
              >
                Contact
              </button>

              {token ? (
                <div style={{ position: 'relative', marginLeft: '0.5rem' }}>
                  <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '0.5rem',
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      color: 'white', border: 'none', padding: '0.6rem 1.2rem',
                      borderRadius: '10px', cursor: 'pointer', fontSize: '0.9rem',
                      fontWeight: 600, transition: 'all 0.3s ease',
                      boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
                    }}
                  >
                    <span style={{
                      width: '24px', height: '24px', background: 'rgba(255, 255, 255, 0.2)',
                      borderRadius: '6px', display: 'flex', alignItems: 'center',
                      justifyContent: 'center', fontSize: '0.7rem', fontWeight: 600
                    }}>{(role || 'U')[0].toUpperCase()}</span>
                    My Account
                    <span style={{ fontSize: '0.7rem', transition: 'transform 0.2s ease', transform: showDropdown ? 'rotate(180deg)' : 'rotate(0)' }}>▼</span>
                  </button>
                  {showDropdown && (
                    <>
                      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 999 }} onClick={() => setShowDropdown(false)} />
                      <div style={{
                        position: 'absolute', top: 'calc(100% + 8px)', right: 0,
                        background: 'var(--bg-primary)', borderRadius: '12px',
                        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)',
                        minWidth: '200px', zIndex: 1000, overflow: 'hidden',
                        animation: 'dropdownFade 0.2s ease-out',
                        border: '1px solid rgba(0, 0, 0, 0.05)'
                      }}>
                        <Link to={getDashboardLink()} onClick={() => setShowDropdown(false)}
                          style={{
                            display: 'flex', alignItems: 'center', gap: '0.75rem',
                            padding: '0.9rem 1.2rem', color: 'var(--text-primary)', textDecoration: 'none',
                            fontSize: '0.9rem', fontWeight: 500, transition: 'all 0.2s ease',
                            borderBottom: '1px solid var(--border-light)'
                          }}
                          onMouseEnter={(e) => e.target.style.background = 'var(--bg-secondary)'}
                          onMouseLeave={(e) => e.target.style.background = 'transparent'}
                        >Dashboard</Link>
                        <button onClick={handleLogout}
                          style={{
                            display: 'flex', alignItems: 'center', gap: '0.75rem',
                            padding: '0.9rem 1.2rem', color: '#ef4444', background: 'none',
                            border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer',
                            fontSize: '0.9rem', fontWeight: 500, transition: 'all 0.2s ease'
                          }}
                          onMouseEnter={(e) => e.target.style.background = '#fef2f2'}
                          onMouseLeave={(e) => e.target.style.background = 'transparent'}
                        >Logout</button>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <Link to="/login" style={{
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  color: 'white', padding: '0.6rem 1.5rem', borderRadius: '10px',
                  textDecoration: 'none', fontSize: '0.9rem', fontWeight: 600,
                  marginLeft: '0.5rem', transition: 'all 0.3s ease',
                  boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)', display: 'inline-block'
                }}>Login</Link>
              )}
            </nav>
          )}

          {/* Mobile Hamburger */}
          {isMobile && (
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                padding: '0.5rem', display: 'flex', flexDirection: 'column',
                gap: '5px', zIndex: 1002
              }}
              aria-label="Toggle menu"
            >
              <span style={{
                display: 'block', width: '24px', height: '2px', background: 'var(--bg-primary)',
                transition: 'all 0.3s ease', borderRadius: '2px',
                transform: mobileMenuOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none'
              }} />
              <span style={{
                display: 'block', width: '24px', height: '2px', background: 'var(--bg-primary)',
                transition: 'all 0.3s ease', borderRadius: '2px',
                opacity: mobileMenuOpen ? 0 : 1
              }} />
              <span style={{
                display: 'block', width: '24px', height: '2px', background: 'var(--bg-primary)',
                transition: 'all 0.3s ease', borderRadius: '2px',
                transform: mobileMenuOpen ? 'rotate(-45deg) translate(5px, -5px)' : 'none'
              }} />
            </button>
          )}
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobile && mobileMenuOpen && (
        <>
          <div
            style={{
              position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
              background: 'rgba(0, 0, 0, 0.5)', zIndex: 998,
              animation: 'fadeInOverlay 0.2s ease'
            }}
            onClick={() => setMobileMenuOpen(false)}
          />
          <nav style={{
            position: 'fixed', top: '72px', left: 0, right: 0,
            background: 'linear-gradient(180deg, #0f172a 0%, #064e3b 100%)',
            padding: '1.5rem', zIndex: 999,
            animation: 'slideDown 0.3s ease',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
            display: 'flex', flexDirection: 'column', gap: '0.5rem',
            maxHeight: 'calc(100vh - 72px)', overflowY: 'auto'
          }}>
            <MobileNavLink to="/" active={isActive('/')} onClick={() => setMobileMenuOpen(false)}>Home</MobileNavLink>
            <MobileNavLink to="/about" active={isActive('/about')} onClick={() => setMobileMenuOpen(false)}>About</MobileNavLink>
            <button onClick={scrollToFooter} style={{
              color: 'rgba(255, 255, 255, 0.8)', background: 'transparent',
              border: 'none', padding: '0.875rem 1rem', borderRadius: '10px',
              fontSize: '1rem', fontWeight: 500, textAlign: 'left', cursor: 'pointer'
            }}>Contact</button>

            <div style={{ height: '1px', background: 'rgba(255, 255, 255, 0.1)', margin: '0.5rem 0' }} />

            {token ? (
              <>
                <MobileNavLink to={getDashboardLink()} onClick={() => setMobileMenuOpen(false)}>Dashboard</MobileNavLink>
                <button onClick={handleLogout} style={{
                  color: '#ef4444', background: 'rgba(239, 68, 68, 0.1)',
                  border: 'none', padding: '0.875rem 1rem', borderRadius: '10px',
                  fontSize: '1rem', fontWeight: 600, textAlign: 'left', cursor: 'pointer',
                  width: '100%'
                }}>Logout</button>
              </>
            ) : (
              <Link to="/login" onClick={() => setMobileMenuOpen(false)} style={{
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: 'white', padding: '0.875rem 1rem', borderRadius: '10px',
                textDecoration: 'none', fontSize: '1rem', fontWeight: 600,
                textAlign: 'center', display: 'block'
              }}>Login</Link>
            )}
          </nav>
        </>
      )}

      <style>{`
        @keyframes dropdownFade {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInOverlay {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
};

const NavLink = ({ to, active, children }) => (
  <Link to={to} style={{
    color: active ? 'white' : 'rgba(255, 255, 255, 0.8)',
    textDecoration: 'none', padding: '0.5rem 1rem', borderRadius: '8px',
    fontSize: '0.95rem', fontWeight: 500,
    background: active ? 'rgba(16, 185, 129, 0.2)' : 'transparent',
    transition: 'all 0.2s ease'
  }}
    onMouseEnter={(e) => { if (!active) { e.target.style.color = 'white'; e.target.style.background = 'rgba(255, 255, 255, 0.1)'; } }}
    onMouseLeave={(e) => { if (!active) { e.target.style.color = 'rgba(255, 255, 255, 0.8)'; e.target.style.background = 'transparent'; } }}
  >{children}</Link>
);

const MobileNavLink = ({ to, active, onClick, children }) => (
  <Link to={to} onClick={onClick} style={{
    color: active ? 'white' : 'rgba(255, 255, 255, 0.8)',
    textDecoration: 'none', padding: '0.875rem 1rem', borderRadius: '10px',
    fontSize: '1rem', fontWeight: 500, display: 'block',
    background: active ? 'rgba(16, 185, 129, 0.2)' : 'transparent'
  }}>{children}</Link>
);

export default Header;

import React from 'react';
import kalviyagamLogo from '../assets/logo.png';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer 
      id="footer"
      style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #064e3b 100%)',
        color: 'white',
        padding: '3rem 1.5rem 1.5rem'
      }}
    >
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {/* Main Content */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '2rem',
          marginBottom: '2rem'
        }}>
          {/* Brand */}
          <div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '0.75rem'
            }}>
              <img 
                src={kalviyagamLogo} 
                alt="Kalviyagam Logo" 
                style={{
                  width: '36px',
                  height: '36px',
                  objectFit: 'contain'
                }}
              />
              <span style={{
                fontSize: '1.3rem',
                fontWeight: 700,
                letterSpacing: '-0.02em'
              }}>
                Kalviyagam
              </span>
            </div>
            <p style={{
              color: '#94a3b8',
              fontSize: '0.85rem',
              lineHeight: 1.6,
              margin: 0
            }}>
              Smart tuition platform connecting students with expert tutors.
            </p>
          </div>

          {/* Contact Info */}
          <div id="contact">
            <h4 style={{
              fontSize: '0.9rem',
              fontWeight: 600,
              marginBottom: '1rem',
              color: 'white'
            }}>
              Contact Us
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <a href="mailto:rajirathinam7@gmail.com" style={{ color: '#94a3b8', fontSize: '0.85rem', textDecoration: 'none', transition: 'color 0.2s ease' }} onMouseEnter={(e) => e.target.style.color = '#10b981'} onMouseLeave={(e) => e.target.style.color = '#94a3b8'}>rajirathinam7@gmail.com</a>
              <a href="tel:+918220297989" style={{ color: '#94a3b8', fontSize: '0.85rem', textDecoration: 'none', transition: 'color 0.2s ease' }} onMouseEnter={(e) => e.target.style.color = '#10b981'} onMouseLeave={(e) => e.target.style.color = '#94a3b8'}>+91 8220297989</a>
              <span style={{ color: '#10b981', fontSize: '0.85rem', fontWeight: 500 }}>Available 24/7</span>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div style={{
          height: '1px',
          background: 'rgba(255,255,255,0.1)',
          marginBottom: '1.5rem'
        }} />

        {/* Copyright */}
        <p style={{
          color: '#64748b',
          fontSize: '0.8rem',
          margin: 0,
          textAlign: 'center'
        }}>
          © {currentYear} Kalviyagam. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;

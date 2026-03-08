import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Header from '../components/Header';
import Footer from '../components/Footer';
import FeedbackForm from '../components/FeedbackForm';
import API_CONFIG from '../config/apiConfig';

const Home = () => {
  const navigate = useNavigate();
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [galleryImages, setGalleryImages] = useState([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const fetchGalleryImages = async () => {
      try {
        const res = await api.get(`/gallery`);
        setGalleryImages(res.data.slice(0, 3));
      } catch (err) {
      }
    };
    fetchGalleryImages();
  }, []);

  const features = [
    {
      title: 'Smart Class Management',
      description: 'Automated scheduling, easy enrollment, and seamless class organization for better learning.',
      gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="16" y1="2" x2="16" y2="6"></line>
          <line x1="8" y1="2" x2="8" y2="6"></line>
          <line x1="3" y1="10" x2="21" y2="10"></line>
          <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01M16 18h.01"></path>
        </svg>
      )
    },
    {
      title: 'Expert Tutors',
      description: 'Learn from verified, experienced educators passionate about helping you succeed.',
      gradient: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
          <circle cx="9" cy="7" r="4"></circle>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>
      )
    },
    {
      title: 'Real-time Updates',
      description: 'Stay connected with instant notifications, announcements, and progress tracking.',
      gradient: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
          <line x1="12" y1="2" x2="12" y2="4"></line>
        </svg>
      )
    }
  ];

  const steps = [
    { number: '01', title: 'Enquire & Register', description: 'Reach out to us, discuss your learning needs, and get registered for your preferred program.', color: '#10b981' },
    { number: '02', title: 'Choose Your Mode', description: 'Pick what suits you best - institution classes, online sessions, or home tuition.', color: '#fbbf24' },
    { number: '03', title: 'Start Learning', description: 'Begin your personalized learning journey with expert tutors and track your progress.', color: '#3b82f6' }
  ];

  const services = [
    {
      title: 'Institution Classes',
      description: 'Join our well-equipped classrooms with small batch sizes for personalized attention. Experience interactive learning with peers in a focused academic environment.',
      gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
          <polyline points="9 22 9 12 15 12 15 22"></polyline>
        </svg>
      ),
      highlights: ['Small batch sizes', 'Modern facilities', 'Peer learning']
    },
    {
      title: 'Online Classes',
      description: 'One-on-one live sessions via Zoom, Google Meet, or any platform of your choice. Get personalized attention from expert tutors without leaving your home.',
      gradient: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
          <line x1="8" y1="21" x2="16" y2="21"></line>
          <line x1="12" y1="17" x2="12" y2="21"></line>
          <path d="M10 9l4 2-4 2V9z"></path>
        </svg>
      ),
      highlights: ['1-on-1 live sessions', 'Any platform', 'Learn from home']
    },
    {
      title: 'Home Tuition',
      description: 'Get personalized one-on-one attention with our home tuition services. Our verified tutors come to your home, providing customized learning tailored to your pace.',
      gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>
      ),
      highlights: ['1-on-1 attention', 'Home convenience', 'Custom pace']
    }
  ];


  return (
    <div style={{ backgroundColor: 'var(--bg-secondary)', minHeight: '100vh' }}>
      <Header />
      
      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(135deg, #064e3b 0%, #0f172a 50%, #1e293b 100%)',
        color: 'white',
        position: 'relative',
        overflow: 'hidden',
        paddingTop: '4rem',
        paddingBottom: '6rem'
      }}>
        {/* Animated Background Elements */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          overflow: 'hidden',
          pointerEvents: 'none'
        }}>
          <div style={{
            position: 'absolute',
            top: '10%',
            left: '5%',
            width: '300px',
            height: '300px',
            background: 'radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, transparent 70%)',
            borderRadius: '50%',
            animation: 'pulse 4s ease-in-out infinite'
          }} />
          <div style={{
            position: 'absolute',
            bottom: '20%',
            right: '10%',
            width: '400px',
            height: '400px',
            background: 'radial-gradient(circle, rgba(251, 191, 36, 0.1) 0%, transparent 70%)',
            borderRadius: '50%',
            animation: 'pulse 5s ease-in-out infinite 1s'
          }} />
        </div>

        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 2rem',
          position: 'relative',
          zIndex: 1
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '3rem',
            alignItems: 'center'
          }}>
            {/* Left Content */}
            <div style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
              transition: 'all 0.8s ease-out'
            }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: 'rgba(16, 185, 129, 0.2)',
                padding: '0.5rem 1rem',
                borderRadius: '9999px',
                marginBottom: '1.5rem',
                border: '1px solid rgba(16, 185, 129, 0.3)'
              }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>Smart Learning Platform</span>
              </div>

              <h1 style={{
                fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                fontWeight: 800,
                lineHeight: 1.1,
                marginBottom: '1.5rem',
                letterSpacing: '-0.02em'
              }}>
                Learn Smarter,
                <br />
                <span style={{
                  background: 'linear-gradient(135deg, #10b981 0%, #fbbf24 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>
                  Achieve More
                </span>
              </h1>

              <p style={{
                fontSize: '1.2rem',
                color: '#94a3b8',
                lineHeight: 1.6,
                marginBottom: '2rem',
                maxWidth: '500px'
              }}>
                Premium tuition services offering institution classes, online sessions, and home tuition. 
                Personalized learning with expert tutors, progress tracking, and gamified achievements.
              </p>

              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <button
                  onClick={() => navigate('/register')}
                  style={{
                    padding: '1rem 2rem',
                    fontSize: '1rem',
                    fontWeight: 600,
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 20px rgba(16, 185, 129, 0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 8px 30px rgba(16, 185, 129, 0.5)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 4px 20px rgba(16, 185, 129, 0.4)';
                  }}
                >
                  Join Kalviyagam
                  <span>→</span>
                </button>

                <button
                  onClick={() => navigate('/about')}
                  style={{
                    padding: '1rem 2rem',
                    fontSize: '1rem',
                    fontWeight: 600,
                    background: 'rgba(255, 255, 255, 0.1)',
                    color: 'white',
                    border: '2px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    backdropFilter: 'blur(10px)'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'rgba(255, 255, 255, 0.2)';
                    e.target.style.borderColor = 'rgba(255, 255, 255, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                    e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                  }}
                >
                  Learn More
                </button>
              </div>
            </div>

            {/* Right Content - Hero Illustration */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0) scale(1)' : 'translateY(30px) scale(0.95)',
              transition: 'all 0.8s ease-out 0.2s',
              animation: 'float 3s ease-in-out infinite'
            }}>
              <svg width="420" height="380" viewBox="0 0 420 380" fill="none" style={{ maxWidth: '100%', height: 'auto', filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.3))' }}>
                {/* Desk */}
                <rect x="60" y="260" width="300" height="12" rx="6" fill="#1e3a5f" />
                <rect x="90" y="272" width="12" height="80" rx="4" fill="#1e3a5f" />
                <rect x="318" y="272" width="12" height="80" rx="4" fill="#1e3a5f" />
                {/* Monitor */}
                <rect x="120" y="140" width="180" height="120" rx="10" fill="#0f172a" stroke="#10b981" strokeWidth="2" />
                <rect x="130" y="150" width="160" height="95" rx="4" fill="#064e3b" />
                {/* Screen content - dashboard */}
                <rect x="140" y="160" width="60" height="8" rx="4" fill="#10b981" opacity="0.8" />
                <rect x="140" y="175" width="140" height="3" rx="1.5" fill="#10b981" opacity="0.3" />
                <rect x="140" y="185" width="40" height="25" rx="4" fill="#10b981" opacity="0.4" />
                <rect x="185" y="185" width="40" height="25" rx="4" fill="#fbbf24" opacity="0.4" />
                <rect x="230" y="185" width="40" height="25" rx="4" fill="#3b82f6" opacity="0.4" />
                <rect x="140" y="218" width="130" height="3" rx="1.5" fill="#10b981" opacity="0.2" />
                <rect x="140" y="226" width="90" height="3" rx="1.5" fill="#10b981" opacity="0.2" />
                <rect x="140" y="234" width="110" height="3" rx="1.5" fill="#10b981" opacity="0.2" />
                {/* Monitor stand */}
                <rect x="195" y="250" width="30" height="12" rx="2" fill="#1e3a5f" />
                <rect x="180" y="256" width="60" height="6" rx="3" fill="#1e3a5f" />
                {/* Book stack left */}
                <rect x="70" y="240" width="45" height="8" rx="2" fill="#10b981" transform="rotate(-3 70 240)" />
                <rect x="72" y="232" width="42" height="8" rx="2" fill="#059669" transform="rotate(1 72 232)" />
                <rect x="69" y="224" width="46" height="8" rx="2" fill="#fbbf24" transform="rotate(-2 69 224)" />
                {/* Coffee mug right */}
                <rect x="330" y="238" width="22" height="24" rx="4" fill="#374151" />
                <rect x="352" y="244" width="8" height="12" rx="4" fill="none" stroke="#374151" strokeWidth="3" />
                <ellipse cx="341" cy="238" rx="12" ry="2" fill="#4b5563" />
                {/* Steam */}
                <path d="M336 230 Q334 222 338 218" stroke="#94a3b8" strokeWidth="1.5" fill="none" opacity="0.5" strokeLinecap="round" />
                <path d="M342 228 Q340 220 344 214" stroke="#94a3b8" strokeWidth="1.5" fill="none" opacity="0.4" strokeLinecap="round" />
                {/* Pencil */}
                <rect x="310" y="245" width="6" height="16" rx="1" fill="#fbbf24" transform="rotate(15 310 245)" />
                <polygon points="310,261 313,270 316,261" fill="#f5d0a9" transform="rotate(15 313 265)" />
                {/* Person - body */}
                <circle cx="210" cy="85" r="28" fill="#fcd9b6" />
                {/* Hair */}
                <path d="M182 80 Q182 55 210 52 Q238 55 238 80" fill="#1e293b" />
                <path d="M182 80 Q180 70 185 65" fill="#1e293b" />
                {/* Eyes */}
                <circle cx="200" cy="88" r="3" fill="#0f172a" />
                <circle cx="220" cy="88" r="3" fill="#0f172a" />
                <circle cx="201" cy="87" r="1" fill="white" />
                <circle cx="221" cy="87" r="1" fill="white" />
                {/* Smile */}
                <path d="M203 98 Q210 104 217 98" stroke="#c2856e" strokeWidth="2" fill="none" strokeLinecap="round" />
                {/* Body / shirt */}
                <path d="M185 113 Q185 130 170 155 L170 260 L250 260 L250 155 Q235 130 235 113 Q225 108 210 108 Q195 108 185 113Z" fill="#10b981" />
                {/* Collar */}
                <path d="M195 113 L210 125 L225 113" stroke="#059669" strokeWidth="2" fill="none" />
                {/* Arms */}
                <path d="M170 155 Q145 175 155 210 L165 210 Q160 180 180 165" fill="#10b981" />
                <path d="M250 155 Q275 175 265 210 L255 210 Q260 180 240 165" fill="#10b981" />
                {/* Hands on desk */}
                <ellipse cx="160" cy="255" rx="14" ry="8" fill="#fcd9b6" />
                <ellipse cx="260" cy="255" rx="14" ry="8" fill="#fcd9b6" />
                {/* Graduation cap */}
                <polygon points="210,42 170,58 210,68 250,58" fill="#0f172a" />
                <rect x="207" y="35" width="6" height="10" fill="#0f172a" />
                <rect x="205" y="32" width="10" height="5" rx="2" fill="#fbbf24" />
                <line x1="250" y1="58" x2="255" y2="72" stroke="#0f172a" strokeWidth="2" />
                <circle cx="255" cy="74" r="3" fill="#fbbf24" />
                {/* Floating elements */}
                <g opacity="0.6">
                  <circle cx="50" cy="100" r="6" fill="#10b981" opacity="0.4" />
                  <circle cx="370" cy="80" r="4" fill="#fbbf24" opacity="0.5" />
                  <circle cx="380" cy="180" r="5" fill="#3b82f6" opacity="0.4" />
                  <circle cx="40" cy="200" r="3" fill="#fbbf24" opacity="0.4" />
                  <rect x="355" y="130" width="12" height="12" rx="2" fill="#10b981" opacity="0.3" transform="rotate(15 361 136)" />
                  <polygon points="55,160 60,148 65,160" fill="#fbbf24" opacity="0.3" />
                </g>
                {/* Light bulb idea */}
                <g transform="translate(290, 70)">
                  <circle cx="0" cy="0" r="16" fill="#fbbf24" opacity="0.2" />
                  <circle cx="0" cy="0" r="10" fill="#fbbf24" opacity="0.3" />
                  <path d="M-5 5 Q-5 12 -3 14 L3 14 Q5 12 5 5" stroke="#fbbf24" strokeWidth="1.5" fill="none" />
                  <path d="M0 -8 L0 2 M-5 -3 L0 2 L5 -3" stroke="#fbbf24" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                  <line x1="-3" y1="16" x2="3" y2="16" stroke="#fbbf24" strokeWidth="1" />
                  <line x1="-2" y1="18" x2="2" y2="18" stroke="#fbbf24" strokeWidth="1" />
                </g>
              </svg>
            </div>
          </div>
        </div>

        {/* Wave Divider */}
        <div style={{
          position: 'absolute',
          bottom: -2,
          left: 0,
          width: '100%',
          overflow: 'hidden',
          lineHeight: 0
        }}>
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" style={{ width: '100%', height: '80px' }}>
            <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" fill="var(--bg-secondary)" opacity=".8"></path>
            <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" fill="var(--bg-secondary)" opacity=".5"></path>
            <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" fill="var(--bg-secondary)"></path>
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section style={{ padding: '5rem 2rem', backgroundColor: 'var(--bg-secondary)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <span style={{
              display: 'inline-block',
              background: 'var(--primary-100)',
              color: 'var(--primary-700)',
              padding: '0.5rem 1rem',
              borderRadius: '9999px',
              fontSize: '0.85rem',
              fontWeight: 600,
              marginBottom: '1rem'
            }}>
              Why Choose Us
            </span>
            <h2 style={{
              fontSize: '2.5rem',
              fontWeight: 800,
              color: 'var(--text-primary)',
              marginBottom: '1rem',
              letterSpacing: '-0.02em'
            }}>
              Everything You Need to Excel
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
              Our platform provides all the tools students and tutors need for effective learning and teaching.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.5rem'
          }}>
            {features.map((feature, index) => (
              <div
                key={index}
                style={{
                  background: 'var(--bg-primary)',
                  borderRadius: '20px',
                  padding: '2rem',
                  boxShadow: 'var(--shadow-md)',
                  border: '1px solid var(--border-light)',
                  transition: 'all 0.3s ease',
                  cursor: 'default'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-xl)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                }}
              >
                <div style={{
                  width: '60px',
                  height: '60px',
                  background: feature.gradient,
                  borderRadius: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.5rem',
                  boxShadow: `0 8px 20px ${feature.gradient.includes('10b981') ? 'rgba(16, 185, 129, 0.3)' : feature.gradient.includes('fbbf24') ? 'rgba(251, 191, 36, 0.3)' : 'rgba(59, 130, 246, 0.3)'}`
                }}>
                  {feature.icon}
                </div>
                <h3 style={{
                  fontSize: '1.3rem',
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                  marginBottom: '0.75rem'
                }}>
                  {feature.title}
                </h3>
                <p style={{
                  color: 'var(--text-muted)',
                  lineHeight: 1.6
                }}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section style={{ 
        padding: '5rem 2rem', 
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Background decorative elements */}
        <div style={{
          position: 'absolute',
          top: '10%',
          right: '5%',
          width: '300px',
          height: '300px',
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.1) 0%, transparent 70%)',
          borderRadius: '50%',
          pointerEvents: 'none'
        }} />
        <div style={{
          position: 'absolute',
          bottom: '10%',
          left: '5%',
          width: '250px',
          height: '250px',
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)',
          borderRadius: '50%',
          pointerEvents: 'none'
        }} />

        <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <span style={{
              display: 'inline-block',
              background: 'rgba(16, 185, 129, 0.2)',
              color: '#10b981',
              padding: '0.5rem 1rem',
              borderRadius: '9999px',
              fontSize: '0.85rem',
              fontWeight: 600,
              marginBottom: '1rem',
              border: '1px solid rgba(16, 185, 129, 0.3)'
            }}>
              Our Services
            </span>
            <h2 style={{
              fontSize: '2.5rem',
              fontWeight: 800,
              color: 'white',
              marginBottom: '1rem',
              letterSpacing: '-0.02em'
            }}>
              Choose Your Learning Mode
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
              We offer flexible learning options to suit your preferences. Pick the mode that works best for you.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.5rem'
          }}>
            {services.map((service, index) => (
              <div
                key={index}
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '24px',
                  padding: '2rem',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  transition: 'all 0.4s ease',
                  cursor: 'default',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px)';
                  e.currentTarget.style.border = '1px solid rgba(255, 255, 255, 0.2)';
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.border = '1px solid rgba(255, 255, 255, 0.1)';
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                }}
              >
                <div style={{
                  width: '70px',
                  height: '70px',
                  background: service.gradient,
                  borderRadius: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.5rem',
                  boxShadow: `0 10px 30px ${service.gradient.includes('10b981') ? 'rgba(16, 185, 129, 0.3)' : service.gradient.includes('3b82f6') ? 'rgba(59, 130, 246, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`
                }}>
                  {service.icon}
                </div>
                <h3 style={{
                  fontSize: '1.4rem',
                  fontWeight: 700,
                  color: 'white',
                  marginBottom: '1rem'
                }}>
                  {service.title}
                </h3>
                <p style={{
                  color: '#94a3b8',
                  lineHeight: 1.7,
                  marginBottom: '1.5rem',
                  fontSize: '0.95rem'
                }}>
                  {service.description}
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {service.highlights.map((highlight, i) => (
                    <span
                      key={i}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.3rem',
                        background: 'rgba(255, 255, 255, 0.1)',
                        padding: '0.4rem 0.8rem',
                        borderRadius: '9999px',
                        fontSize: '0.8rem',
                        color: '#e2e8f0',
                        fontWeight: 500
                      }}
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      {highlight}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Enquiry CTA */}
          <div style={{
            marginTop: '3rem',
            textAlign: 'center',
            padding: '2rem',
            background: 'rgba(16, 185, 129, 0.1)',
            borderRadius: '16px',
            border: '1px solid rgba(16, 185, 129, 0.2)'
          }}>
            <p style={{ color: '#94a3b8', marginBottom: '1rem', fontSize: '1rem' }}>
              Not sure which mode is right for you? We're here to help!
            </p>
            <button
              onClick={() => {
                const footer = document.getElementById('footer');
                if (footer) footer.scrollIntoView({ behavior: 'smooth' });
              }}
              style={{
                padding: '0.8rem 1.5rem',
                fontSize: '0.95rem',
                fontWeight: 600,
                background: 'transparent',
                color: '#10b981',
                border: '2px solid #10b981',
                borderRadius: '10px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = '#10b981';
                e.target.style.color = 'white';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'transparent';
                e.target.style.color = '#10b981';
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
              Contact Us
            </button>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section style={{ padding: '5rem 2rem', backgroundColor: 'var(--bg-primary)' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <span style={{
              display: 'inline-block',
              background: 'var(--accent-100)',
              color: 'var(--accent-700)',
              padding: '0.5rem 1rem',
              borderRadius: '9999px',
              fontSize: '0.85rem',
              fontWeight: 600,
              marginBottom: '1rem'
            }}>
              Getting Started
            </span>
            <h2 style={{
              fontSize: '2.5rem',
              fontWeight: 800,
              color: 'var(--text-primary)',
              letterSpacing: '-0.02em'
            }}>
              How It Works
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
            {steps.map((step, index) => (
              <div key={index} style={{ textAlign: 'center', position: 'relative' }}>
                <div style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  background: `linear-gradient(135deg, ${step.color}20 0%, ${step.color}10 100%)`,
                  border: `3px solid ${step.color}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.5rem',
                  position: 'relative'
                }}>
                  <span style={{
                    fontSize: '1.5rem',
                    fontWeight: 800,
                    color: step.color
                  }}>
                    {step.number}
                  </span>
                </div>
                <h3 style={{
                  fontSize: '1.2rem',
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                  marginBottom: '0.75rem'
                }}>
                  {step.title}
                </h3>
                <p style={{
                  color: 'var(--text-muted)',
                  lineHeight: 1.6,
                  fontSize: '0.95rem'
                }}>
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section style={{ padding: '5rem 2rem', backgroundColor: 'var(--bg-secondary)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{
              fontSize: '2.5rem',
              fontWeight: 800,
              color: 'var(--text-primary)',
              marginBottom: '1rem',
              letterSpacing: '-0.02em'
            }}>
              Our Learning Environment
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
            {galleryImages.length === 0 ? (
              // Placeholder cards
              [
                { title: 'Modern Classrooms', desc: 'State-of-the-art learning spaces', gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' },
                { title: 'Student Success', desc: 'Celebrating achievements', gradient: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)' },
                { title: 'Interactive Learning', desc: 'Engaging group activities', gradient: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' }
              ].map((item, index) => (
                <div
                  key={index}
                  style={{
                    borderRadius: '20px',
                    overflow: 'hidden',
                    boxShadow: 'var(--shadow-lg)',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-8px)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  <div style={{
                    height: '200px',
                    background: item.gradient,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                      <circle cx="8.5" cy="8.5" r="1.5"></circle>
                      <polyline points="21 15 16 10 5 21"></polyline>
                    </svg>
                  </div>
                  <div style={{ padding: '1.5rem', backgroundColor: 'var(--bg-primary)' }}>
                    <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-primary)', fontWeight: 700 }}>{item.title}</h3>
                    <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>{item.desc}</p>
                  </div>
                </div>
              ))
            ) : (
              galleryImages.map((image) => (
                <div
                  key={image._id}
                  style={{
                    borderRadius: '20px',
                    overflow: 'hidden',
                    boxShadow: 'var(--shadow-lg)',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-8px)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  <img
                    src={`${API_CONFIG.BASE_URL}${image.imageUrl}`}
                    alt={image.title}
                    style={{
                      width: '100%',
                      height: '220px',
                      objectFit: 'cover',
                      display: 'block'
                    }}
                  />
                  <div style={{ padding: '1.5rem', backgroundColor: 'var(--bg-primary)' }}>
                    <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-primary)', fontWeight: 700 }}>{image.title}</h3>
                    <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>{image.description || `Our ${image.category}`}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{
        padding: '5rem 2rem',
        background: 'linear-gradient(135deg, #064e3b 0%, #0f172a 100%)',
        color: 'white',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
            fontWeight: 800,
            marginBottom: '1rem',
            letterSpacing: '-0.02em'
          }}>
            Ready to Start Your Learning Journey?
          </h2>
          <p style={{
            fontSize: '1.2rem',
            marginBottom: '2.5rem',
            opacity: 0.9,
            color: '#cbd5e1'
          }}>
            Be part of our growing learning community. Start your journey today.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={() => navigate('/register')}
              style={{
                padding: '1rem 2rem',
                fontSize: '1rem',
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 20px rgba(16, 185, 129, 0.4)'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 8px 30px rgba(16, 185, 129, 0.5)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 20px rgba(16, 185, 129, 0.4)';
              }}
            >
              Join as Student
            </button>
            <button
              onClick={() => navigate('/about')}
              style={{
                padding: '1rem 2rem',
                fontSize: '1rem',
                background: 'transparent',
                color: 'white',
                border: '2px solid rgba(255,255,255,0.3)',
                borderRadius: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(255,255,255,0.1)';
                e.target.style.borderColor = 'rgba(255,255,255,0.5)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'transparent';
                e.target.style.borderColor = 'rgba(255,255,255,0.3)';
              }}
            >
              Learn More
            </button>
            <button
              onClick={() => setShowFeedbackForm(true)}
              style={{
                padding: '1rem 2rem',
                fontSize: '1rem',
                background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                color: '#0f172a',
                border: 'none',
                borderRadius: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 20px rgba(251, 191, 36, 0.4)'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 8px 30px rgba(251, 191, 36, 0.5)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 20px rgba(251, 191, 36, 0.4)';
              }}
            >
              Share Feedback
            </button>
          </div>
        </div>
      </section>

      <Footer />

      {showFeedbackForm && (
        <FeedbackForm onClose={() => setShowFeedbackForm(false)} />
      )}

      {/* Animation styles */}
      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.5; }
          50% { transform: scale(1.1); opacity: 0.8; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
        @media (max-width: 768px) {
          section { padding-left: 1rem !important; padding-right: 1rem !important; }
        }
      `}</style>
    </div>
  );
};

export default Home;

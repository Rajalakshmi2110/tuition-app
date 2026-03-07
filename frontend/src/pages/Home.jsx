import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Header from '../components/Header';
import Footer from '../components/Footer';
import FeedbackForm from '../components/FeedbackForm';
import bookImage from '../assets/book.png';
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
        console.error('Error fetching gallery:', err);
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

            {/* Right Content - Hero Image */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0) scale(1)' : 'translateY(30px) scale(0.95)',
              transition: 'all 0.8s ease-out 0.2s'
            }}>
              <img
                src={bookImage}
                alt="Learning illustration"
                style={{
                  maxWidth: '100%',
                  width: '400px',
                  height: 'auto',
                  filter: 'drop-shadow(0 20px 40px rgba(0, 0, 0, 0.3))',
                  animation: 'float 3s ease-in-out infinite'
                }}
              />
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
              onClick={() => navigate('/about')}
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
              Contact Us for Enquiries
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
                    <div style={{
                      width: '80px',
                      height: '80px',
                      borderRadius: '20px',
                      background: 'rgba(255,255,255,0.2)',
                      backdropFilter: 'blur(10px)'
                    }} />
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
            Join thousands of students and tutors who are already part of our learning community.
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
              onClick={() => navigate('/register')}
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
              Become a Tutor
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

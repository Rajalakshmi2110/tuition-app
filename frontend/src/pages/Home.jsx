import React, { useState, useEffect } from 'react';
import '../styles/home.css';
import booksImage from '../assets/book.png';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import FeedbackForm from '../components/FeedbackForm';
import axios from 'axios';

const Home = () => {
  const navigate = useNavigate();
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [galleryImages, setGalleryImages] = useState([]);
  const handleGetStarted = () => navigate('/welcomeportal');

  useEffect(() => {
    const fetchGalleryImages = async () => {
      try {
        const res = await axios.get('https://tuitionapp-yq06.onrender.com/api/gallery');
        setGalleryImages(res.data.slice(0, 3)); // Show only first 3 images
      } catch (err) {
        console.error('Error fetching gallery:', err);
      }
    };
    fetchGalleryImages();
  }, []);

  return (
    <div style={{ 
        background: 'linear-gradient(-45deg, #1e293b, #20205c, #3b82f6, #10b981)', 
        backgroundSize: '400% 400%',
        animation: 'gradientShift 15s ease infinite',
        minHeight: '100vh', 
        position: 'relative' 
      }}>
      <style>{`
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
      <Header />
      <main className="hero-content">
        <section className="text-content">
          <h1 style={{ color: 'white' }}>Learn Smarter, Learn Better!</h1>
          <p style={{ color: 'rgba(255,255,255,0.9)' }}>
            Join our real-time tuition platform with the best tutors and
            personalized learning tools.
          </p>
          <button className="btn btn-primary" onClick={handleGetStarted}>
            Get Started
          </button>
        </section>

        <aside className="image-content">
          <img src={booksImage} alt="Books representing learning" />
        </aside>
      </main>
      <div className="wave-background"></div>
      
      {/* Features Section */}
      <section style={{ padding: '4rem 1rem', backgroundColor: '#f8fafc' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '3rem' }}>Why Choose Tuitix?</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
            <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📚</div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#1e293b', marginBottom: '1rem' }}>Smart Class Management</h3>
              <p style={{ color: '#64748b', lineHeight: '1.6' }}>Automated scheduling, easy enrollment, and seamless class organization for better learning experience.</p>
            </div>
            <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>👨🏫</div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#1e293b', marginBottom: '1rem' }}>Expert Tutors</h3>
              <p style={{ color: '#64748b', lineHeight: '1.6' }}>Learn from verified, experienced educators who are passionate about helping you succeed.</p>
            </div>
            <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📱</div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#1e293b', marginBottom: '1rem' }}>Real-time Updates</h3>
              <p style={{ color: '#64748b', lineHeight: '1.6' }}>Stay connected with instant notifications, announcements, and progress tracking.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section style={{ padding: '4rem 1rem', backgroundColor: 'white' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '3rem' }}>How It Works</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
            <div style={{ padding: '1.5rem' }}>
              <div style={{ 
                width: '60px', 
                height: '60px', 
                backgroundColor: '#3b82f6', 
                borderRadius: '50%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                margin: '0 auto 1rem', 
                color: 'white', 
                fontSize: '1.5rem', 
                fontWeight: 'bold' 
              }}>1</div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: '600', color: '#1e293b', marginBottom: '1rem' }}>Register & Get Verified</h3>
              <p style={{ color: '#64748b', lineHeight: '1.6' }}>Sign up as a student or tutor and get verified by our admin team for a secure learning environment.</p>
            </div>
            <div style={{ padding: '1.5rem' }}>
              <div style={{ 
                width: '60px', 
                height: '60px', 
                backgroundColor: '#10b981', 
                borderRadius: '50%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                margin: '0 auto 1rem', 
                color: 'white', 
                fontSize: '1.5rem', 
                fontWeight: 'bold' 
              }}>2</div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: '600', color: '#1e293b', marginBottom: '1rem' }}>Join or Create Classes</h3>
              <p style={{ color: '#64748b', lineHeight: '1.6' }}>Browse available classes to enroll or create your own classes to teach your expertise.</p>
            </div>
            <div style={{ padding: '1.5rem' }}>
              <div style={{ 
                width: '60px', 
                height: '60px', 
                backgroundColor: '#f59e0b', 
                borderRadius: '50%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                margin: '0 auto 1rem', 
                color: 'white', 
                fontSize: '1.5rem', 
                fontWeight: 'bold' 
              }}>3</div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: '600', color: '#1e293b', marginBottom: '1rem' }}>Learn & Track Progress</h3>
              <p style={{ color: '#64748b', lineHeight: '1.6' }}>Access study materials, attend classes, and monitor your learning progress in real-time.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Gallery Section */}
      <section style={{ padding: '4rem 1rem', backgroundColor: '#f1f5f9' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '3rem' }}>Our Learning Environment</h2>
          {galleryImages.length === 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
              {/* Placeholder images when no gallery images */}
              <div style={{ borderRadius: '16px', overflow: 'hidden', boxShadow: '0 8px 25px rgba(0,0,0,0.1)' }}>
                <div style={{ 
                  height: '200px', 
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '3rem'
                }}>📚</div>
                <div style={{ padding: '1rem', backgroundColor: 'white' }}>
                  <h3 style={{ margin: '0 0 0.5rem 0', color: '#1e293b' }}>Modern Classrooms</h3>
                  <p style={{ margin: '0', color: '#64748b', fontSize: '0.9rem' }}>State-of-the-art learning spaces</p>
                </div>
              </div>
              <div style={{ borderRadius: '16px', overflow: 'hidden', boxShadow: '0 8px 25px rgba(0,0,0,0.1)' }}>
                <div style={{ 
                  height: '200px', 
                  background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '3rem'
                }}>🎓</div>
                <div style={{ padding: '1rem', backgroundColor: 'white' }}>
                  <h3 style={{ margin: '0 0 0.5rem 0', color: '#1e293b' }}>Student Success</h3>
                  <p style={{ margin: '0', color: '#64748b', fontSize: '0.9rem' }}>Celebrating achievements</p>
                </div>
              </div>
              <div style={{ borderRadius: '16px', overflow: 'hidden', boxShadow: '0 8px 25px rgba(0,0,0,0.1)' }}>
                <div style={{ 
                  height: '200px', 
                  background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '3rem'
                }}>👥</div>
                <div style={{ padding: '1rem', backgroundColor: 'white' }}>
                  <h3 style={{ margin: '0 0 0.5rem 0', color: '#1e293b' }}>Interactive Learning</h3>
                  <p style={{ margin: '0', color: '#64748b', fontSize: '0.9rem' }}>Engaging group activities</p>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
              {galleryImages.map((image) => (
                <div key={image._id} style={{ borderRadius: '16px', overflow: 'hidden', boxShadow: '0 8px 25px rgba(0,0,0,0.1)' }}>
                  <img 
                    src={`https://tuitionapp-yq06.onrender.com${image.imageUrl}`}
                    alt={image.title}
                    style={{ 
                      width: '100%', 
                      height: '250px', 
                      objectFit: 'cover',
                      objectPosition: 'center',
                      display: 'block'
                    }}
                  />
                  <div style={{ padding: '1rem', backgroundColor: 'white' }}>
                    <h3 style={{ margin: '0 0 0.5rem 0', color: '#1e293b' }}>{image.title}</h3>
                    <p style={{ margin: '0', color: '#64748b', fontSize: '0.9rem' }}>{image.description || `Our ${image.category}`}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
      
      {/* CTA Section */}
      <section style={{ padding: '4rem 1rem', backgroundColor: '#1e293b', color: 'white', textAlign: 'center' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>Ready to Start Your Learning Journey?</h2>
          <p style={{ fontSize: '1.2rem', marginBottom: '2rem', opacity: '0.9' }}>Join thousands of students and tutors who are already part of our learning community.</p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button 
              onClick={() => navigate('/register')} 
              style={{
                padding: '1rem 2rem',
                fontSize: '1.1rem',
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#2563eb'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#3b82f6'}
            >
              Join as Student
            </button>
            <button 
              onClick={() => navigate('/register')} 
              style={{
                padding: '1rem 2rem',
                fontSize: '1.1rem',
                backgroundColor: 'transparent',
                color: 'white',
                border: '2px solid white',
                borderRadius: '12px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = 'white';
                e.target.style.color = '#1e293b';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.color = 'white';
              }}
            >
              Become a Tutor
            </button>
            <button 
              onClick={() => setShowFeedbackForm(true)} 
              style={{
                padding: '1rem 2rem',
                fontSize: '1.1rem',
                backgroundColor: '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#059669'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#10b981'}
            >
              💬 Share Feedback
            </button>
          </div>
        </div>
      </section>

      <style>{`
        .btn {
          padding: 12px 20px;
          font-size: 16px;
          border-radius: 8px;
          border: none;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease-in-out;
        }
        .btn-primary {
          background-color: #2563eb;
          color: white;
        }
        .btn-primary:hover {
          background-color: #1e40af;
        }
      `}</style>
      
      <Footer />
      
      {showFeedbackForm && (
        <FeedbackForm onClose={() => setShowFeedbackForm(false)} />
      )}
    </div>
  );
};

export default Home;

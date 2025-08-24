import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import axios from 'axios';

const About = () => {
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/feedback/approved');
        setTestimonials(res.data);
      } catch (err) {
        console.error('Error fetching testimonials:', err);
      }
    };
    fetchTestimonials();
  }, []);

  return (
    <div style={{ backgroundColor: '#f8fafc' }}>
      <Header />
      
      {/* Hero Section */}
      <section style={{ padding: '4rem 2rem', backgroundColor: '#1e293b', color: 'white', textAlign: 'center' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '1rem' }}>About Tuitix</h1>
          <p style={{ fontSize: '1.3rem', opacity: '0.9', lineHeight: '1.6' }}>
            Revolutionizing education through smart tuition management and personalized learning experiences.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section style={{ padding: '4rem 2rem', backgroundColor: 'white' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '2rem' }}>Our Mission</h2>
          <p style={{ fontSize: '1.2rem', color: '#64748b', lineHeight: '1.8', marginBottom: '3rem' }}>
            To bridge the gap between students and quality education by creating a seamless, technology-driven platform 
            that connects learners with expert tutors, making personalized learning accessible to everyone.
          </p>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
            <div style={{ padding: '2rem', backgroundColor: '#f1f5f9', borderRadius: '16px' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎯</div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#1e293b', marginBottom: '1rem' }}>Quality Education</h3>
              <p style={{ color: '#64748b', lineHeight: '1.6' }}>Committed to providing the highest standard of educational support through verified, experienced tutors.</p>
            </div>
            <div style={{ padding: '2rem', backgroundColor: '#f1f5f9', borderRadius: '16px' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🌍</div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#1e293b', marginBottom: '1rem' }}>Accessibility</h3>
              <p style={{ color: '#64748b', lineHeight: '1.6' }}>Making quality education accessible to students from all backgrounds and locations.</p>
            </div>
            <div style={{ padding: '2rem', backgroundColor: '#f1f5f9', borderRadius: '16px' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🚀</div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#1e293b', marginBottom: '1rem' }}>Innovation</h3>
              <p style={{ color: '#64748b', lineHeight: '1.6' }}>Leveraging cutting-edge technology to create smarter, more effective learning experiences.</p>
            </div>
          </div>
        </div>
      </section>

      {/* What Makes Us Different */}
      <section style={{ padding: '4rem 2rem', backgroundColor: '#f8fafc' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '3rem', textAlign: 'center' }}>
            What Makes Tuitix Different
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🤖</div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#1e293b', marginBottom: '1rem' }}>Smart Technology</h3>
              <p style={{ color: '#64748b', lineHeight: '1.6' }}>
                AI-powered class matching, automated scheduling, and intelligent progress tracking for optimal learning outcomes.
              </p>
            </div>
            
            <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#1e293b', marginBottom: '1rem' }}>Verified Tutors</h3>
              <p style={{ color: '#64748b', lineHeight: '1.6' }}>
                Rigorous screening process ensures only qualified, experienced educators join our platform.
              </p>
            </div>
            
            <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚡</div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#1e293b', marginBottom: '1rem' }}>Real-time Platform</h3>
              <p style={{ color: '#64748b', lineHeight: '1.6' }}>
                Instant notifications, live progress tracking, and seamless communication between students and tutors.
              </p>
            </div>
            
            <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎨</div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#1e293b', marginBottom: '1rem' }}>Personalized Learning</h3>
              <p style={{ color: '#64748b', lineHeight: '1.6' }}>
                Tailored learning paths and customized study materials based on individual student needs and goals.
              </p>
            </div>
            
            <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔒</div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#1e293b', marginBottom: '1rem' }}>Trust & Safety</h3>
              <p style={{ color: '#64748b', lineHeight: '1.6' }}>
                Secure platform with verified users, safe payment processing, and comprehensive privacy protection.
              </p>
            </div>
            
            <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📊</div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#1e293b', marginBottom: '1rem' }}>Progress Tracking</h3>
              <p style={{ color: '#64748b', lineHeight: '1.6' }}>
                Comprehensive analytics and reporting to monitor learning progress and identify areas for improvement.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Student Testimonials */}
      <section style={{ padding: '3rem 2rem', backgroundColor: '#1e293b', color: 'white' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem' }}>What Our Students Say</h2>
          
          {testimonials.length === 0 ? (
            <p style={{ textAlign: 'center', fontSize: '1.2rem', opacity: '0.8' }}>No testimonials available yet. Be the first to share your experience!</p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
              {testimonials.map((testimonial, index) => {
                const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];
                const bgColor = colors[index % colors.length];
                
                return (
                  <div key={testimonial._id} style={{ 
                    backgroundColor: 'rgba(255,255,255,0.1)', 
                    padding: '1.5rem', 
                    borderRadius: '12px',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.2)'
                  }}>
                    <div style={{ fontSize: '1.5rem', marginBottom: '1rem', display: 'flex' }}>
                      {[...Array(5)].map((_, i) => (
                        <span key={i} style={{ 
                          color: i < testimonial.rating ? '#f59e0b' : 'rgba(255,255,255,0.3)',
                          marginRight: '2px'
                        }}>★</span>
                      ))}
                    </div>
                    <p style={{ fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '1.5rem', fontStyle: 'italic' }}>
                      "{testimonial.message}"
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
                      <div style={{
                        width: '50px',
                        height: '50px',
                        backgroundColor: bgColor,
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.5rem',
                        fontWeight: 'bold',
                        color: 'white'
                      }}>
                        {testimonial.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p style={{ margin: '0', fontWeight: '600', fontSize: '1.1rem' }}>{testimonial.name}</p>
                        <p style={{ margin: '0', opacity: '0.8', fontSize: '0.9rem' }}>{testimonial.role}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Contact Section */}
      <section style={{ padding: '3rem 2rem', backgroundColor: 'white' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '1rem' }}>Get in Touch</h2>
          <p style={{ fontSize: '1rem', color: '#64748b', marginBottom: '2rem' }}>
            Have questions about Tuitix? We'd love to help you get started.
          </p>
          
          <div style={{ display: 'flex', justifyContent: 'center', gap: '3rem', flexWrap: 'wrap' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>📧</div>
              <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#1e293b', marginBottom: '0.25rem' }}>Email</h3>
              <p style={{ color: '#64748b', fontSize: '0.9rem' }}>support@tuitix.com</p>
            </div>
            
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>📞</div>
              <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#1e293b', marginBottom: '0.25rem' }}>Phone</h3>
              <p style={{ color: '#64748b', fontSize: '0.9rem' }}>+1 (555) 123-4567</p>
            </div>
            
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🕒</div>
              <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#1e293b', marginBottom: '0.25rem' }}>Hours</h3>
              <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Mon-Fri: 9AM-6PM</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
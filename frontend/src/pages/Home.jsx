import React from 'react';
import '../styles/home.css';
import booksImage from '../assets/book.png';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';

const Home = () => {
  const navigate = useNavigate();
  const handleGetStarted = () => navigate('/welcomeportal');

  return (
    <div className="hero-section">
      <Header />
      <main className="hero-content">
        <section className="text-content">
          <h1>Learn Smarter, Learn Better!</h1>
          <p>
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
    </div>
  );
};

export default Home;

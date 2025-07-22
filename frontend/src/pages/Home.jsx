import React from 'react';
import '../styles/home.css';
import booksImage from '../assets/book.png';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/welcomeportal');
  };

  return (
    <div className="hero-section">
      <div className="wave-background"></div>

      <nav className="navbar">
        <h2 className="logo">MyTuition</h2>
        <div className="nav-links">
          <a href="/">Home</a>
          <a href="/about">About</a>
          <a href="/contact">Contact</a>
        </div>
      </nav>

      <main className="hero-content">
        <section className="text-content">
          <h1>Learn Smarter, Learn Better!</h1>
          <p>
            Join our real-time tuition platform with the best tutors and
            personalized learning tools.
          </p>
          <button onClick={handleGetStarted} aria-label="Get started with MyTuition">
            Get Started
          </button>
        </section>

        <aside className="image-content">
          <img src={booksImage} alt="Books representing learning" />
        </aside>
      </main>
    


    </div>
  );
};

export default Home;

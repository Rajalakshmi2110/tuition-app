import React from 'react';
import '../styles/home.css';
import booksImage from '../assets/book.png';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
// import Footer from '../components/Footer';

const Home = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/welcomeportal');
  };

  return (
    <div className="hero-section">
      <div>
      <Header />
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
      <div className="wave-background"></div>
      </div>
     {/* <Footer />  */}
     
    </div>
  );
};

export default Home;
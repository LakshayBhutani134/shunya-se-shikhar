import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import authService from '../services/auth';

const Home = () => {
  const [currentUser, setCurrentUser] = useState(null);
  
  useEffect(() => {
    const user = authService.getCurrentUser();
    setCurrentUser(user);
  }, []);
  
  return (
    <div className="home-container">
      <section className="hero">
        <h1>Welcome to Shunya Se Shikhar</h1>
        <p className="subtitle">Master problem-solving and improve your coding skills</p>
        
        {!currentUser ? (
          <div className="cta-buttons">
            <Link href="/signup">
              <button className="btn primary-btn">Get Started</button>
            </Link>
            <Link href="/login">
              <button className="btn secondary-btn">Login</button>
            </Link>
          </div>
        ) : (
          <div className="welcome-back">
            <h2>Welcome back, {currentUser.username}!</h2>
            <p>Current Rating: {currentUser.rating_score}</p>
            <Link href="/problems">
              <button className="btn primary-btn">Continue Practicing</button>
            </Link>
          </div>
        )}
      </section>
      
      <section className="features">
        <h2>What We Offer</h2>
        
        <div className="feature-grid">
          <div className="feature-card">
            <h3>Extensive Problem Bank</h3>
            <p>Practice with hundreds of coding challenges across various difficulty levels.</p>
          </div>
          
          <div className="feature-card">
            <h3>Skill-Based Learning</h3>
            <p>Improve systematically with problems organized by concepts and algorithms.</p>
          </div>
          
          <div className="feature-card">
            <h3>Performance Analytics</h3>
            <p>Track your progress with detailed statistics and performance metrics.</p>
          </div>
          
          <div className="feature-card">
            <h3>Community Support</h3>
            <p>Learn from peers and discuss problem solutions with our community.</p>
          </div>
        </div>
      </section>
      
      <section className="how-it-works">
        <h2>How It Works</h2>
        
        <div className="steps">
          <div className="step">
            <div className="step-number">1</div>
            <h3>Create an Account</h3>
            <p>Sign up for a free account to track your progress and save your solutions.</p>
          </div>
          
          <div className="step">
            <div className="step-number">2</div>
            <h3>Solve Problems</h3>
            <p>Browse our problem library and start solving challenges of varying difficulty.</p>
          </div>
          
          <div className="step">
            <div className="step-number">3</div>
            <h3>Improve Your Skills</h3>
            <p>Learn from your mistakes, practice regularly, and watch your rating climb!</p>
          </div>
        </div>
      </section>
      
      <style jsx>{`
        .home-container {
          max-width: 1200px;
          margin: 0 auto;
        }
        
        .hero {
          text-align: center;
          padding: 4rem 1rem;
          background: linear-gradient(to right, #f8f9fa, #e9ecef);
          border-radius: 8px;
          margin-bottom: 3rem;
        }
        
        h1 {
          font-size: 2.5rem;
          margin-bottom: 1rem;
          color: #2c3e50;
        }
        
        .subtitle {
          font-size: 1.2rem;
          color: #7f8c8d;
          margin-bottom: 2rem;
        }
        
        .cta-buttons {
          display: flex;
          justify-content: center;
          gap: 1rem;
        }
        
        .btn {
          padding: 0.75rem 1.5rem;
          border-radius: 4px;
          font-weight: 600;
          cursor: pointer;
          font-size: 1rem;
          border: none;
        }
        
        .primary-btn {
          background-color: #3498db;
          color: white;
        }
        
        .secondary-btn {
          background-color: white;
          color: #3498db;
          border: 1px solid #3498db;
        }
        
        .welcome-back {
          background-color: #f1f9ff;
          padding: 1.5rem;
          border-radius: 8px;
          border-left: 4px solid #3498db;
        }
        
        .features, .how-it-works {
          padding: 3rem 1rem;
        }
        
        h2 {
          text-align: center;
          margin-bottom: 2rem;
          color: #2c3e50;
        }
        
        .feature-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
        }
        
        .feature-card {
  background-color: var(--card-bg); // Change from "white" to use a CSS variable
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px var(--shadow-color);
  transition: transform 0.3s ease;
}

// Make sure all text elements use variable colors:
.feature-card h3 {
  color: var(--text-color);
  margin-bottom: 0.5rem;
}

.feature-card p {
  color: var(--text-color);
}
        
        .feature-card:hover {
          transform: translateY(-5px);
        }
        
        .steps {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-around;
          gap: 1.5rem;
        }
        
        .step {
          flex: 1;
          min-width: 250px;
          text-align: center;
          padding: 1.5rem;
        }
        
        .step-number {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 50px;
          height: 50px;
          background-color: #3498db;
          color: white;
          border-radius: 50%;
          margin: 0 auto 1rem auto;
          font-size: 1.5rem;
          font-weight: bold;
        }
      `}</style>
    </div>
  );
};

export default Home;
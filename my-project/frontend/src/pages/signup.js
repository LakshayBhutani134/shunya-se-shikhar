import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import authService from '../services/auth';

const Signup = () => {
  const router = useRouter();
  const [userData, setUserData] = useState({
    username: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validate passwords match
    if (userData.password !== userData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    // Validate password strength
    if (userData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    
    setLoading(true);
    
    try {
      // Send only username and password to API
      const { username, password } = userData;
      await authService.signup({ username, password });
      
      // Redirect to login
      router.push('/login?registered=true');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Join Shunya Se Shikhar</h1>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={userData.username}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={userData.password}
              onChange={handleChange}
              required
              minLength={6}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={userData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>
          
          <button 
            type="submit" 
            className="auth-button"
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>
        
        <div className="auth-footer">
          Already have an account? <Link href="/login"><span className="auth-link">Login here</span></Link>
        </div>
      </div>
      
      <style jsx>{`
        .auth-container {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 2rem;
        }
        
        .auth-card {
    background-color: var(--card-bg);
    border-radius: 8px;
    box-shadow: 0 4px 12px var(--shadow-color);
    padding: 2rem;
    width: 100%;
    max-width: 400px;
  }
        
        h1 {
    text-align: center;
    margin-bottom: 1.5rem;
    color: var(--text-color);
  }
        
        .form-group {
          margin-bottom: 1.2rem;
        }
        
        label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
    color: var(--text-color);
  }
        
        input {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid var(--input-border);
    border-radius: 4px;
    font-size: 1rem;
    background-color: var(--input-bg);
    color: var(--text-color);
  }
        
        .auth-button {
          width: 100%;
          padding: 0.75rem;
          background-color: #3498db;
          color: white;
          border: none;
          border-radius: 4px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          margin-top: 1rem;
        }
        
        .auth-button:hover {
          background-color: #2980b9;
        }
        
        .auth-button:disabled {
          background-color: #95a5a6;
          cursor: not-allowed;
        }
        
        .auth-footer {
          text-align: center;
          margin-top: 1.5rem;
        }
        
        .auth-link {
          color: #3498db;
          cursor: pointer;
          text-decoration: underline;
        }
        
        .error-message {
          background-color: #ffebee;
          color: #c62828;
          padding: 0.75rem;
          border-radius: 4px;
          margin-bottom: 1rem;
          text-align: center;
        }
      `}</style>
    </div>
  );
};

export default Signup;
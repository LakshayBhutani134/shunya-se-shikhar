import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import authService from '../services/auth';

const Login = () => {
  const router = useRouter();
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({
      ...credentials,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await authService.login(credentials);
      router.push('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Login to Shunya Se Shikhar</h1>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={credentials.username}
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
              value={credentials.password}
              onChange={handleChange}
              required
            />
          </div>
          
          <button 
            type="submit" 
            className="auth-button"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        
        <div className="auth-footer">
          Don't have an account? <Link href="/signup"><span className="auth-link">Sign up here</span></Link>
        </div>
        <div className="forgot-password">
            <Link href="/reset-password"><span className="auth-link">Forgot password?</span></Link>
        </div>
      </div>
      
      <style jsx>{`

      
        .forgot-password {
        margin-top: 0.5rem;
        font-size: 0.9rem;
        }
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

export default Login;
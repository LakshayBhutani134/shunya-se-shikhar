import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import authService from '../services/auth';
import { useTheme } from '../contexts/ThemeContext';

const Layout = ({ children }) => {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState(null);
  const { mounted } = useTheme(); // Only need to know if mounted
  
  useEffect(() => {
    const user = authService.getCurrentUser();
    setCurrentUser(user);
  }, []);
  
  const handleLogout = () => {
    authService.logout();
    setCurrentUser(null);
    router.push('/');
  };
  
  return (
    <div className="layout">
      <header className="navbar">
        <div className="logo">
          <Link href="/">
            <span className="site-title">Shunya Se Shikhar</span>
          </Link>
        </div>
        
        <nav className="nav-links">
          <Link href="/problems">
            <span className={router.pathname === '/problems' ? 'active' : ''}>Problems</span>
          </Link>
          
          <Link href="/learn">
            <span className={router.pathname === '/learn' ? 'active' : ''}>Learn</span>
          </Link>
          
          {/* Theme toggle button removed */}
          
          {currentUser ? (
            <>
              <Link href="/profile">
                <span className={router.pathname === '/profile' ? 'active' : ''}>
                  {currentUser.username} ({currentUser.rating_score})
                </span>
              </Link>
              <button onClick={handleLogout} className="logout-btn">Logout</button>
            </>
          ) : (
            <>
              <Link href="/login">
                <span className={router.pathname === '/login' ? 'active' : ''}>Login</span>
              </Link>
              
              <Link href="/signup">
                <span className={router.pathname === '/signup' ? 'active' : ''}>Sign Up</span>
              </Link>
            </>
          )}
        </nav>
      </header>
      
      <main className="content">
        {children}
      </main>
      
      <footer className="footer">
        <p>&copy; {new Date().getFullYear()} Shunya Se Shikhar. All rights reserved.</p>
      </footer>
      
      <style jsx>{`
        .layout {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }
        
        .navbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 2rem;
          height: 60px;
          background-color: var(--navbar-bg);
          color: var(--navbar-text);
          box-shadow: 0 2px 4px var(--shadow-color);
        }
        
        .site-title {
          font-size: 1.5rem;
          font-weight: bold;
          color: var(--primary-color);
          cursor: pointer;
        }
        
        .nav-links {
          display: flex;
          gap: 1.5rem;
          align-items: center;
        }
        
        .nav-links span {
          cursor: pointer;
          font-weight: 500;
          padding: 0.5rem;
          border-radius: 4px;
        }
        
        .active {
          color: var(--primary-color);
        }
        
        .content {
          flex: 1;
          padding: 2rem;
          max-width: 1200px;
          margin: 0 auto;
          width: 100%;
          background-color: var(--bg-color);
          color: var(--text-color);
        }
        
        .footer {
          text-align: center;
          padding: 1.5rem;
          background-color: var(--footer-bg);
          color: var(--footer-text);
          margin-top: auto;
        }
        
        .logout-btn {
          background-color: var(--danger-color);
          color: white;
          border: none;
          padding: 0.4rem 0.8rem;
          border-radius: 4px;
          cursor: pointer;
          font-weight: 500;
        }
      `}</style>
    </div>
  );
};

export default Layout;
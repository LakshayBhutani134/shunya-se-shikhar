import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';
import authService from '../services/auth';
import api from '../services/api';

const ProfilePage = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profileImage, setProfileImage] = useState('/sss.jpeg');

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      router.push('/login');
      return;
    }
    
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        
        // Fetch user profile
        try {
          console.log('Fetching user with ID:', currentUser.userid);
          const userData = await api.getUser(currentUser.userid);
          setUser(userData);
          
          // Set profile image if it exists
          if (userData.profileImage) {
            setProfileImage(userData.profileImage);
          }
        } catch (err) {
          console.error('API call failed:', err);
          // Fallback to using currentUser data from localStorage if API fails
          setUser({
            username: currentUser.username,
            userid: currentUser.userid,
            rating_score: currentUser.rating_score || 0
          });
          
          if (err.message === 'Network Error') {
            setError('Cannot connect to the server. Please make sure the backend is running.');
          } else {
            setError(`Error: ${err.message}`);
          }
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserProfile();
  }, [router]);
  
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading profile...</p>
      </div>
    );
  }
  
  if (!user && error) {
    return (
      <div className="error-container">
        <h2>Error Loading Profile</h2>
        <p>{error}</p>
        <Link href="/">
          <button className="btn primary-btn">Return to Home</button>
        </Link>
      </div>
    );
  }
  
  return (
    <div className="profile-container">
      {error && <div className="error-banner">{error}</div>}
      
      <div className="profile-header">
        <div className="profile-image-container">
          <div className="profile-image">
            <Image 
              src={profileImage}
              alt={`${user.username}'s profile`}
              width={150}
              height={150}
              layout="responsive"
              objectFit="cover"
            />
          </div>
          <button className="change-photo-btn">Change Photo</button>
        </div>
        
        <div className="profile-info">
          <h1>{user.username}</h1>
          <div className="rating-badge">
            <span className="rating-label">Rating:</span>
            <span className="rating-value">{user.rating_score || 0}</span>
          </div>
          
          <div className="profile-actions">
            <Link href="/problems">
              <button className="btn primary-btn">Solve Problems</button>
            </Link>
          </div>
        </div>
      </div>
      
      <div className="profile-content">
        <div className="profile-section">
          <h2>Your Stats</h2>
          <div className="stats-container">
            <div className="stat-item">
              <span className="stat-label">Problems Solved</span>
              <span className="stat-value">0</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Rank</span>
              <span className="stat-value">Beginner</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Joined</span>
              <span className="stat-value">2025</span>
            </div>
          </div>
        </div>
        
        <div className="profile-section">
          <h2>Recent Activity</h2>
          <div className="empty-section">
            <p>You haven't solved any problems yet.</p>
            <Link href="/problems">
              <button className="btn secondary-btn">Start Solving</button>
            </Link>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .profile-container {
          max-width: 1000px;
          margin: 0 auto;
          padding: 2rem 1rem;
        }
        
        .error-banner {
          background-color: #ffebee;
          color: #c62828;
          padding: 0.75rem;
          border-radius: 4px;
          margin-bottom: 1rem;
          text-align: center;
        }
        
        .profile-header {
          display: flex;
          gap: 2rem;
          margin-bottom: 2rem;
          padding: 1.5rem;
          background-color: var(--card-bg);
          border-radius: 8px;
          box-shadow: 0 2px 8px var(--shadow-color);
          flex-wrap: wrap;
        }
        
        .profile-image-container {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        
        .profile-image {
          width: 150px;
          height: 150px;
          border-radius: 50%;
          overflow: hidden;
          border: 3px solid var(--primary-color, #3498db);
          background-color: var(--card-bg);
        }
        
        .change-photo-btn {
          margin-top: 0.75rem;
          padding: 0.5rem 1rem;
          background-color: transparent;
          color: var(--primary-color, #3498db);
          border: 1px solid var(--primary-color, #3498db);
          border-radius: 4px;
          cursor: pointer;
          font-size: 0.875rem;
          transition: all 0.2s;
        }
        
        .change-photo-btn:hover {
          background-color: var(--primary-color, #3498db);
          color: white;
        }
        
        .profile-info {
          flex: 1;
        }
        
        .profile-info h1 {
          font-size: 2.5rem;
          margin-bottom: 0.5rem;
          color: var(--text-color);
        }
        
        .rating-badge {
          display: inline-block;
          padding: 0.5rem 1rem;
          background-color: var(--card-bg);
          border: 1px solid var(--border-color, #ddd);
          border-radius: 4px;
          margin-bottom: 1rem;
        }
        
        .rating-label {
          color: var(--text-color);
          margin-right: 0.5rem;
          font-weight: bold;
        }
        
        .rating-value {
          color: var(--primary-color, #3498db);
          font-size: 1.2rem;
          font-weight: bold;
        }
        
        .profile-actions {
          margin-top: 1rem;
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
          background-color: var(--primary-color, #3498db);
          color: white;
        }
        
        .secondary-btn {
          background-color: transparent;
          color: var(--primary-color, #3498db);
          border: 1px solid var(--primary-color, #3498db);
        }
        
        .profile-content {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.5rem;
        }
        
        .profile-section {
          background-color: var(--card-bg);
          border-radius: 8px;
          box-shadow: 0 2px 8px var(--shadow-color);
          padding: 1.5rem;
          margin-bottom: 1.5rem;
        }
        
        .profile-section h2 {
          font-size: 1.5rem;
          margin-bottom: 1.5rem;
          color: var(--text-color);
          border-bottom: 1px solid var(--border-color, #ddd);
          padding-bottom: 0.5rem;
        }
        
        .stats-container {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
          gap: 1.5rem;
        }
        
        .stat-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }
        
        .stat-label {
          color: var(--text-color);
          font-size: 0.875rem;
          margin-bottom: 0.25rem;
        }
        
        .stat-value {
          color: var(--text-color);
          font-size: 1.25rem;
          font-weight: bold;
        }
        
        .empty-section {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          background-color: var(--hover-color, #f5f5f5);
          border-radius: 4px;
          text-align: center;
        }
        
        .empty-section p {
          margin-bottom: 1rem;
          color: var(--text-color);
        }
        
        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 50vh;
        }
        
        .loading-spinner {
          border: 4px solid rgba(0, 0, 0, 0.1);
          border-left-color: var(--primary-color, #3498db);
          border-radius: 50%;
          width: 40px;
          height: 40px;
          animation: spin 1s linear infinite;
          margin-bottom: 1rem;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .error-container {
          max-width: 600px;
          margin: 3rem auto;
          padding: 2rem;
          text-align: center;
          background-color: var(--card-bg);
          border-radius: 8px;
          box-shadow: 0 2px 8px var(--shadow-color);
        }
        
        .error-container h2 {
          color: #c62828;
          margin-bottom: 1rem;
        }
        
        .error-container p {
          margin-bottom: 1.5rem;
          color: var(--text-color);
        }
        
        @media (max-width: 768px) {
          .profile-header {
            flex-direction: column;
            align-items: center;
            text-align: center;
          }
          
          .profile-info {
            display: flex;
            flex-direction: column;
            align-items: center;
          }
        }
      `}</style>
    </div>
  );
};

export default ProfilePage;
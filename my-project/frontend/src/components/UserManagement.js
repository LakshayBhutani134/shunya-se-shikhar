import React, { useState, useEffect } from 'react';
import api from '../services/api';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    rating_score: 0
  });

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await api.getUsers();
      setUsers(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch users. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'rating_score' ? parseFloat(value) : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.createUser(formData);
      setFormData({ username: '', rating_score: 0 });
      fetchUsers(); // Refresh the list
    } catch (err) {
      setError('Failed to create user. Please try again.');
      console.error(err);
    }
  };

  const handleDelete = async (userId) => {
    try {
      await api.deleteUser(userId);
      fetchUsers(); // Refresh the list
    } catch (err) {
      setError('Failed to delete user. Please try again.');
      console.error(err);
    }
  };

  return (
    <div className="container">
      <h1>User Management System</h1>
      
      {/* Add User Form */}
      <div className="form-container">
        <h2>Add New User</h2>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="rating_score">Rating Score:</label>
            <input
              type="number"
              id="rating_score"
              name="rating_score"
              value={formData.rating_score}
              onChange={handleInputChange}
              required
              step="0.1"
              min="0"
              max="10"
            />
          </div>
          <button type="submit" className="btn">Add User</button>
        </form>
      </div>
      
      {/* User List */}
      <div className="user-list">
        <h2>Users</h2>
        {loading ? (
          <p>Loading users...</p>
        ) : users.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>User ID</th>
                <th>Username</th>
                <th>Rating Score</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.userid}>
                  <td>{user.userid}</td>
                  <td>{user.username}</td>
                  <td>{user.rating_score}</td>
                  <td>
                    <button 
                      onClick={() => handleDelete(user.userid)} 
                      className="delete-btn"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No users found. Add a new user to get started.</p>
        )}
      </div>
    </div>
  );
};

export default UserManagement;
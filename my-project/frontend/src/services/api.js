import axios from 'axios';

const API_URL = 'http://localhost:5000';

const api = {
  // Get all users
  getUsers: async () => {
    try {
      const response = await axios.get(`${API_URL}/users`);
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },

  // Get a specific user
  getUser: async (userId) => {
    try {
      console.log(`Attempting to fetch user with ID: ${userId}`);
      const response = await axios.get(`${API_URL}/users/${userId}`);
      console.log('User data received:', response.data);
      return response.data;
    } catch (error) {
      console.error(`Error fetching user ${userId}:`, error);
      throw error;
    }
  },

  // Create a new user
  createUser: async (userData) => {
    try {
      const response = await axios.post(`${API_URL}/users`, userData);
      return response.data;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },

  // Update a user
  updateUser: async (userId, userData) => {
    try {
      const response = await axios.put(`${API_URL}/users/${userId}`, userData);
      return response.data;
    } catch (error) {
      console.error(`Error updating user ${userId}:`, error);
      throw error;
    }
  },

  // Delete a user
  deleteUser: async (userId) => {
    try {
      const response = await axios.delete(`${API_URL}/users/${userId}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting user ${userId}:`, error);
      throw error;
    }
  },

  // Get user rating history
  getUserRatingHistory: async (userId) => {
    try {
      const response = await axios.get(`${API_URL}/users/${userId}/rating-history`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching rating history for user ${userId}:`, error);
      throw error;
    }
  },

  // Upload user profile image
  uploadProfileImage: async (userId, imageFile) => {
    try {
      const formData = new FormData();
      formData.append('profile_image', imageFile);

      const response = await axios.post(
        `${API_URL}/users/${userId}/profile-image`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error(`Error uploading profile image for user ${userId}:`, error);
      throw error;
    }
  },

  // Get all problems with optional filtering
  getProblems: async (filters = {}) => {
    try {
      const queryParams = new URLSearchParams();
      if (filters.difficulty) queryParams.append('difficulty', filters.difficulty);
      if (filters.type) queryParams.append('type', filters.type);

      const response = await axios.get(`${API_URL}/problems?${queryParams.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching problems:', error);
      throw error;
    }
  },

  // Get a specific problem
  getProblem: async (problemId) => {
    try {
      const response = await axios.get(`${API_URL}/problems/${problemId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching problem ${problemId}:`, error);
      throw error;
    }
  },

  // Submit a solution with image
  submitSolution: async (problemId, userId, imageFile) => {
    try {
      const formData = new FormData();
      formData.append('file', imageFile);
      formData.append('user_id', userId);

      const response = await axios.post(
        `${API_URL}/problems/${problemId}/submit`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error(`Error submitting solution for problem ${problemId}:`, error);
      throw error;
    }
  },

  // Upload a file (generic function for file uploads)
  uploadFile: async (formData) => {
    try {
      const response = await axios.post(`${API_URL}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  },
};

export default api;
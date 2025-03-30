import axios from 'axios';

const API_URL = 'http://localhost:5000';

const authService = {
//   login: async (credentials) => {
//     try {
//       const response = await axios.post(`${API_URL}/auth/login`, credentials);
//       const { user } = response.data;
      
//       // Store user in localStorage
//       localStorage.setItem('user', JSON.stringify(user));
      
//       return user;
//     } catch (error) {
//       console.error('Login error:', error);
//       throw error;
//     }
//   },
  // Find your login function in the auth service:

login: async (credentials) => {
    try {
      // Add this console log to debug credentials
      console.log("Sending login request with username:", credentials.username);
      
      const response = await axios.post(`${API_URL}/auth/login`, credentials);
      const { user } = response.data;
      
      // Store user in localStorage
      localStorage.setItem('user', JSON.stringify(user));
      
      return user;
    } catch (error) {
      // Add detailed error logging
      console.error('Login error:', error);
      console.error('Response:', error.response?.data);
      
      throw error;
    }
  },
  signup: async (userData) => {
    try {
      const response = await axios.post(`${API_URL}/auth/signup`, userData);
      return response.data;
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  },
  
  resetPassword: async (username, newPassword) => {
    try {
      const response = await axios.post(`${API_URL}/auth/reset-password`, {
        username,
        password: newPassword
      });
      return response.data;
    } catch (error) {
      console.error('Password reset error:', error);
      throw error;
    }
  },
  
  logout: () => {
    localStorage.removeItem('user');
  },
  
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    return JSON.parse(userStr);
  }
};

export default authService;
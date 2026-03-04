import axios from 'axios';

// For Vite, use import.meta.env instead of process.env
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    // FIXED: Use 'codecircle_token' instead of 'token'
    const token = localStorage.getItem('codecircle_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('✅ Token attached to:', config.url);
    } else {
      console.log('❌ No token found for:', config.url);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.log('🔒 401 Unauthorized - Token might be invalid');
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem('codecircle_token');
      localStorage.removeItem('codecircle_user');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

export default api;
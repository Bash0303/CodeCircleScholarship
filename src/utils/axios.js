import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

console.log('🔧 Axios initialized with API_URL:', API_URL);

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 60000,
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('codecircle_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle timeout errors
    if (error.code === 'ECONNABORTED') {
      console.log('⏰ Request timeout - server took too long to respond');
    }
    
    // Handle 401 Unauthorized - BUT EXCLUDE public endpoints
    if (error.response?.status === 401) {
      const url = error.config?.url || '';
      
      // Don't redirect for settings endpoint - it's public
      if (url.includes('/settings')) {
        console.log('ℹ️ 401 on settings endpoint - treating as public');
        return Promise.reject(error);
      }
      
      console.log('🔒 401 Unauthorized - clearing storage');
      localStorage.removeItem('codecircle_token');
      localStorage.removeItem('codecircle_user');
      
      const path = window.location.pathname;
      const publicPages = ['/', '/login', '/register', '/admin/login', '/forgot-password', '/registration-success'];
      
      if (!publicPages.includes(path)) {
        if (path.includes('/admin')) {
          window.location.href = '/admin/login';
        } else {
          window.location.href = '/login';
        }
      }
    }
    
    // Handle 403 Forbidden - DO NOT REDIRECT
    if (error.response?.status === 403) {
      console.log('🚫 403 Forbidden - Business logic error (e.g., registration closed)');
      // Don't redirect, just pass the error through
    }
    
    return Promise.reject(error);
  }
);

export default api;
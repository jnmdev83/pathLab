import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';
import { getTokenFromStorage, removeTokenFromStorage } from './storage';

// Create an axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Function to setup API interceptors
export const setupApiInterceptors = (tokenToSet) => {
  // Add a request interceptor
  api.interceptors.request.use(
    (config) => {
      // Get the token from local storage or from parameter
      const token = tokenToSet || getTokenFromStorage();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Add a response interceptor
  api.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      // If unauthorized (401) or forbidden (403), remove token and maybe redirect
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        console.error('Unauthorized access. Clearing token.');
        removeTokenFromStorage();
        // Redirect to login if needed. This is usually handled better in components,
        // but removing the token is a good safeguard.
        if (window.location.pathname !== '/login') {
             window.location.href = '/login';
        }
      } else if (error.response && error.response.status >= 500) {
        console.error('Server error occurred:', error.response.data);
      }
      return Promise.reject(error);
    }
  );
};

// Initialize interceptors right away
setupApiInterceptors();

// Login API call
export const fetchAdminLogin = async (email, password) => {
  const response = await api.post('/auth/admin-login', { email, password });
  return response.data;
};

export default api;

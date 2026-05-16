import { saveTokenToStorage, getTokenFromStorage, removeTokenFromStorage } from './storage';
import { setupApiInterceptors } from './api';

// Set auth token when user logs in
export const setAuthToken = (token) => {
  saveTokenToStorage(token);
  // Also update axios headers
  setupApiInterceptors(token);
};

// Get auth token
export const getAuthToken = () => {
  return getTokenFromStorage();
};

// Clear auth token when user logs out
export const clearAuthToken = () => {
  removeTokenFromStorage();
  setupApiInterceptors(null);
};

// Check if user is authenticated
export const isAuthenticated = () => {
  const token = getAuthToken();
  return token !== null && token !== undefined;
};

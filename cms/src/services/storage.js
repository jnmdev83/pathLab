import { TOKEN_KEY } from '../utils/constants';

// Save token to local storage
export const saveTokenToStorage = (token) => {
  localStorage.setItem(TOKEN_KEY, token);
};

// Get token from local storage
export const getTokenFromStorage = () => {
  return localStorage.getItem(TOKEN_KEY);
};

// Remove token from local storage
export const removeTokenFromStorage = () => {
  localStorage.removeItem(TOKEN_KEY);
};

// Constants for the CMS application

// Define the API base URL from environment variables, fallback to local
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Other constants can be added here
export const TOKEN_KEY = 'adminToken';

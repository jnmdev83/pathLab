// Constants for the CMS application

// Define the API base URL from environment variables, fallback to local
export const API_BASE_URL = 
  (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'))
    ? 'http://localhost:5000/api'
    : 'https://pathlab-5ktj.onrender.com/api';


// Other constants can be added here
export const TOKEN_KEY = 'adminToken';

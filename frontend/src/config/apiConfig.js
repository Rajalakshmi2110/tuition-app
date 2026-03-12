// API Configuration
// Automatically switches between development and production

const isDevelopment = process.env.NODE_ENV === 'development' || process.env.REACT_APP_USE_LOCAL === 'true';

const API_CONFIG = {
  BASE_URL: isDevelopment 
    ? 'http://localhost:5000'
    : 'https://tuitionapp-yq06.onrender.com',  // Backend stays on 5000, frontend on 3005
};

export default API_CONFIG;
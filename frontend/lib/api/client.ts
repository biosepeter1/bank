import axios from 'axios';

// Helper to get the correct API URL regardless of environment variables
const getBaseUrl = () => {
  // 1. Explicit environment variable always wins
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }

  // 2. In browser: Check current hostname
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    // If running solely on specific local domains, use local API
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return 'http://localhost:3001/api';
    }
    // Otherwise assume production (VPS IP or domain)
    return 'http://64.227.45.177/api';
  }

  // 3. Server-side / Build-time fallback
  return process.env.NODE_ENV === 'production'
    ? 'http://64.227.45.177/api'
    : 'http://localhost:3001/api';
};

const apiClient = axios.create({
  baseURL: getBaseUrl(),
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - add auth token
apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('accessToken');
      // Only log in development mode
      if (process.env.NODE_ENV === 'development') {
        console.log('API Request:', {
          url: config.url,
          method: config.method,
          hasToken: !!token
        });
      }
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle errors
apiClient.interceptors.response.use(
  (response) => {
    // Only log successful responses in development
    if (process.env.NODE_ENV === 'development') {
      console.log('✓ API Success:', response.config.url, response.status);
    }
    return response;
  },
  async (error) => {
    // Handle network errors (backend not reachable)
    if (!error.response) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('⚠ Network Error:', error.config?.url, '- Backend may be down');
      }

      // Create a more user-friendly error
      const apiUrl = getBaseUrl();
      const networkError = new Error(
        `Cannot connect to server at ${apiUrl}. Please check your connection.`
      );
      return Promise.reject(networkError);
    }

    // Only log non-404 errors (404s are expected for missing endpoints during fallback logic)
    if (error.response?.status !== 404 || process.env.NODE_ENV === 'development') {
      const emoji = error.response?.status === 401 ? '🔒' :
        error.response?.status === 404 ? '🔍' : '❌';
      console.warn(`${emoji} API ${error.response?.status}:`, error.config?.url,
        error.response?.data?.message || error.message);
    }

    if (error.response?.status === 401) {
      // Token expired - try to refresh or logout
      if (typeof window !== 'undefined') {
        console.log('🔒 Unauthorized - redirecting to login');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;

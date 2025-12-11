import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
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
      const networkError = new Error(
        'Cannot connect to server. Please ensure the backend is running on http://localhost:3001'
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

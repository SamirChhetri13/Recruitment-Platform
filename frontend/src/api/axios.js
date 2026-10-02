import axios from 'axios';
import { toast } from 'react-hot-toast';

const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: attach token from localStorage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle 401 & display automatic toast messages
api.interceptors.response.use(
  (response) => {
    // Show success message if backend sends a message string on mutations
    if (response.data?.message && response.config.method !== 'get') {
      toast.success(response.data.message);
    }
    return response;
  },
  (error) => {
    const status = error.response?.status;
    const message = error.response?.data?.message || error.message || 'An error occurred';
    const requestUrl = error.config?.url || '';

    if (status === 401) {
      const hadToken = Boolean(localStorage.getItem('token'));
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.dispatchEvent(new Event('auth:unauthorized'));

      if (requestUrl.includes('/auth/login')) {
        toast.error(message || 'Invalid email or password');
      } else if (hadToken && !requestUrl.includes('/auth/me')) {
        toast.error('Session expired. Please log in again.');
      }
    } else if (status >= 400 && status < 500) {
      toast.error(message);
    } else if (status >= 500) {
      toast.error('Server error. Please try again later.');
    }

    return Promise.reject(error);
  }
);

export default api;

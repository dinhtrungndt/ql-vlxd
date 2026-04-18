import axios from 'axios';
import config from '../config';
import { loadSession, clearSession } from '../utils/storage';

// Tạo axios instance với base URL
const api = axios.create({
  baseURL: config.API_V1,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: tự động gắn token vào header
api.interceptors.request.use(
  (requestConfig) => {
    const session = loadSession();
    if (session && session.token) {
      requestConfig.headers['Authorization'] = `Bearer ${session.token}`;
    }
    return requestConfig;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: xử lý lỗi 401 (token hết hạn)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      clearSession();
      // Redirect về login nếu không phải đang ở trang login
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;

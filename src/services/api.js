import axios from 'axios';
import toast from 'react-hot-toast';
import config from '../config';
import { clearSession, loadSession } from '../utils/storage';

const api = axios.create({
  baseURL: config.API_V1,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

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

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // 1. Xử lý lỗi mất kết nối mạng hoặc Backend sập
    if (!error.response) {
      toast.error('Không thể kết nối đến máy chủ. Vui lòng kiểm tra mạng!');
      return Promise.reject(error);
    }

    // 2. Xử lý lỗi 401 (Token hết hạn hoặc sai)
    if (error.response.status === 401) {
      clearSession();
      if (window.location.pathname !== '/login') {
        toast.error('Phiên đăng nhập đã hết hạn!');
        setTimeout(() => {
          window.location.href = '/login';
        }, 1000);
      }
    }

    // 3. Xử lý lỗi 403 (Không đủ quyền)
    if (error.response.status === 403) {
      toast.error('Bạn không có quyền thực hiện thao tác này!');
    }

    // 4. Xử lý lỗi 500 (Lỗi server nội bộ)
    if (error.response.status >= 500) {
      toast.error('Hệ thống đang gặp sự cố, vui lòng thử lại sau.');
    }

    return Promise.reject(error);
  }
);

export default api;

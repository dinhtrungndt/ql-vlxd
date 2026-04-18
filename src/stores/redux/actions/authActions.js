import toast from 'react-hot-toast';
import api from '../../../services/api';
import { clearSession, saveSession } from '../../../utils/storage';
import {
  AUTH_GET_ME_FAILURE, AUTH_GET_ME_REQUEST,
  AUTH_GET_ME_SUCCESS, AUTH_LOGIN_FAILURE, AUTH_LOGIN_REQUEST,
  AUTH_LOGIN_SUCCESS, AUTH_LOGOUT
} from '../actionTypes';

// Đăng nhập
export const loginAction = (username, password) => async (dispatch) => {
  dispatch({ type: AUTH_LOGIN_REQUEST });
  try {
    // FastAPI OAuth2PasswordRequestForm nhận form-urlencoded
    const formData = new URLSearchParams();
    formData.append('username', username);
    formData.append('password', password);

    const { data } = await api.post('/auth/login', formData, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });

    const token = data.access_token;

    // Lưu token mã hóa vào localStorage
    saveSession({ token });

    dispatch({ type: AUTH_LOGIN_SUCCESS, payload: { token } });

    // Lấy thông tin user sau khi đăng nhập
    dispatch(getMeAction());
  } catch (err) {
    const message =
      err.response?.data?.detail || 'Đăng nhập thất bại. Kiểm tra lại tài khoản / mật khẩu.';
    dispatch({ type: AUTH_LOGIN_FAILURE, payload: message });
    toast.error(message);
  }
};

// Lấy thông tin người dùng hiện tại
export const getMeAction = () => async (dispatch) => {
  dispatch({ type: AUTH_GET_ME_REQUEST });
  try {
    const { data } = await api.get('/auth/me');
    dispatch({ type: AUTH_GET_ME_SUCCESS, payload: data });
  } catch (err) {
    dispatch({ type: AUTH_GET_ME_FAILURE });
    dispatch(logoutAction());
  }
};

// Đăng xuất
export const logoutAction = () => (dispatch) => {
  clearSession();
  dispatch({ type: AUTH_LOGOUT });
};

// Tạo tài khoản nhân viên (Admin/Manager)
export const createEmployeeAction = (userData) => async (dispatch) => {
  try {
    const { data } = await api.post('/auth/create-employee', userData);
    toast.success(`Đã tạo tài khoản "${data.username}" thành công!`);
    return { success: true, data };
  } catch (err) {
    const message = err.response?.data?.detail || 'Tạo tài khoản thất bại';
    toast.error(message);
    return { success: false, message };
  }
};

import toast from 'react-hot-toast';
import api from '../../../services/api';
import { clearSession, saveSession } from '../../../utils/storage';
import {
  AUTH_GET_ME_FAILURE, AUTH_GET_ME_REQUEST, AUTH_GET_ME_SUCCESS,
  AUTH_LOGIN_FAILURE, AUTH_LOGIN_REQUEST, AUTH_LOGIN_SUCCESS, AUTH_LOGOUT, USER_UPDATE_PROFILE_FAILURE, USER_UPDATE_PROFILE_REQUEST, USER_UPDATE_PROFILE_SUCCESS
} from '../actionTypes';

// Đăng nhập
export const loginAction = (username, password) => async (dispatch) => {
  dispatch({ type: AUTH_LOGIN_REQUEST });
  try {
    const formData = new URLSearchParams();
    formData.append('username', username);
    formData.append('password', password);

    const { data } = await api.post('/auth/login', formData, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });

    const token = data.access_token;
    saveSession({ token });
    dispatch({ type: AUTH_LOGIN_SUCCESS, payload: { token } });
    dispatch(getMeAction());
  } catch (err) {
    const message = err.response?.data?.detail || 'Đăng nhập thất bại. Kiểm tra lại tài khoản / mật khẩu.';
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

// Admin Cập nhật thông tin nhân viên
export const updateEmployeeAction = (id, userData) => async (dispatch) => {
  try {
    const { data } = await api.put(`/auth/users/${id}`, userData);
    toast.success('Cập nhật thông tin thành công');
    return { success: true, data };
  } catch (err) {
    const message = err.response?.data?.detail || 'Cập nhật thất bại';
    toast.error(message);
    return { success: false, message };
  }
};

// Admin Khóa / Mở khóa tài khoản
export const toggleUserStatusAction = (id) => async (dispatch) => {
  try {
    const { data } = await api.put(`/auth/users/${id}/toggle-status`);
    toast.success(data.message || 'Đã thay đổi trạng thái tài khoản');
    return { success: true };
  } catch (err) {
    const message = err.response?.data?.detail || 'Thao tác thất bại';
    toast.error(message);
    return { success: false, message };
  }
};

// Người dùng TỰ cập nhật hồ sơ & đổi mật khẩu
export const updateProfileAction = (profileData) => async (dispatch) => {
  dispatch({ type: USER_UPDATE_PROFILE_REQUEST });
  try {
    const { data } = await api.put('/auth/me', profileData);
    dispatch({ type: USER_UPDATE_PROFILE_SUCCESS, payload: data });
    dispatch({ type: AUTH_GET_ME_SUCCESS, payload: data });
    toast.success('Cập nhật hồ sơ thành công');
    return { success: true };
  } catch (err) {
    const message = err.response?.data?.detail || 'Cập nhật thất bại';
    dispatch({ type: USER_UPDATE_PROFILE_FAILURE, payload: message });
    toast.error(message);
    return { success: false, message };
  }
};

import toast from 'react-hot-toast';
import api from '../../../services/api';
import {
  EXPENSE_CREATE_FAILURE, EXPENSE_CREATE_REQUEST,
  EXPENSE_CREATE_SUCCESS, EXPENSE_HIDE_FAILURE, EXPENSE_HIDE_REQUEST,
  EXPENSE_HIDE_SUCCESS, EXPENSE_LIST_FAILURE, EXPENSE_LIST_REQUEST,
  EXPENSE_LIST_SUCCESS
} from '../actionTypes';

// Lấy danh sách chi phí
export const getExpensesAction = () => async (dispatch) => {
  dispatch({ type: EXPENSE_LIST_REQUEST });
  try {
    const { data } = await api.get('/expenses/');
    dispatch({ type: EXPENSE_LIST_SUCCESS, payload: data });
  } catch (err) {
    const message = err.response?.data?.detail || 'Lỗi khi tải danh sách chi phí';
    dispatch({ type: EXPENSE_LIST_FAILURE, payload: message });
    toast.error(message);
  }
};

// Tạo khoản chi
export const createExpenseAction = (formData) => async (dispatch) => {
  dispatch({ type: EXPENSE_CREATE_REQUEST });
  try {
    const { data } = await api.post('/expenses/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    dispatch({ type: EXPENSE_CREATE_SUCCESS, payload: data });
    toast.success('Tạo khoản chi thành công');
    return { success: true, data };
  } catch (err) {
    const message = err.response?.data?.detail || 'Lỗi khi tạo khoản chi';
    dispatch({ type: EXPENSE_CREATE_FAILURE, payload: message });
    toast.error(message);
    return { success: false, message };
  }
};

// Ẩn chi phí
export const hideExpenseAction = (id) => async (dispatch) => {
  dispatch({ type: EXPENSE_HIDE_REQUEST });
  try {
    await api.put(`/expenses/${id}/hide`);
    dispatch({ type: EXPENSE_HIDE_SUCCESS, payload: id });
    toast.success('Đã ẩn khoản chi');
    return { success: true };
  } catch (err) {
    const message = err.response?.data?.detail || 'Lỗi khi ẩn khoản chi';
    dispatch({ type: EXPENSE_HIDE_FAILURE, payload: message });
    toast.error(message);
    return { success: false, message };
  }
};

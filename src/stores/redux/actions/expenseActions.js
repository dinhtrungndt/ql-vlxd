import toast from 'react-hot-toast';
import api from '../../../services/api';
import {
  EXPENSE_CREATE_FAILURE, EXPENSE_CREATE_REQUEST, EXPENSE_CREATE_SUCCESS, EXPENSE_HIDDEN_LIST_FAILURE, EXPENSE_HIDDEN_LIST_REQUEST, EXPENSE_HIDDEN_LIST_SUCCESS, EXPENSE_HIDE_FAILURE, EXPENSE_HIDE_REQUEST, EXPENSE_HIDE_SUCCESS,
  EXPENSE_LIST_FAILURE, EXPENSE_LIST_REQUEST, EXPENSE_LIST_SUCCESS, EXPENSE_RESTORE_FAILURE, EXPENSE_RESTORE_REQUEST, EXPENSE_RESTORE_SUCCESS, EXPENSE_UPDATE_FAILURE, EXPENSE_UPDATE_REQUEST, EXPENSE_UPDATE_SUCCESS
} from '../actionTypes';

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

export const getHiddenExpensesAction = () => async (dispatch) => {
  dispatch({ type: EXPENSE_HIDDEN_LIST_REQUEST });
  try {
    const { data } = await api.get('/expenses/hidden');
    dispatch({ type: EXPENSE_HIDDEN_LIST_SUCCESS, payload: data });
  } catch (err) {
    const message = err.response?.data?.detail || 'Lỗi khi tải chi phí ẩn';
    dispatch({ type: EXPENSE_HIDDEN_LIST_FAILURE, payload: message });
    toast.error(message);
  }
};

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

export const updateExpenseAction = (id, formData) => async (dispatch) => {
  dispatch({ type: EXPENSE_UPDATE_REQUEST });
  try {
    const { data } = await api.put(`/expenses/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    dispatch({ type: EXPENSE_UPDATE_SUCCESS, payload: data });
    toast.success('Cập nhật khoản chi thành công');
    return { success: true, data };
  } catch (err) {
    const message = err.response?.data?.detail || 'Lỗi khi cập nhật khoản chi';
    dispatch({ type: EXPENSE_UPDATE_FAILURE, payload: message });
    toast.error(message);
    return { success: false, message };
  }
};

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

export const restoreExpenseAction = (id) => async (dispatch) => {
  dispatch({ type: EXPENSE_RESTORE_REQUEST });
  try {
    await api.put(`/expenses/${id}/restore`);
    dispatch({ type: EXPENSE_RESTORE_SUCCESS, payload: id });
    toast.success('Đã khôi phục khoản chi');
    return { success: true };
  } catch (err) {
    const message = err.response?.data?.detail || 'Lỗi khi khôi phục khoản chi';
    dispatch({ type: EXPENSE_RESTORE_FAILURE, payload: message });
    toast.error(message);
    return { success: false, message };
  }
};

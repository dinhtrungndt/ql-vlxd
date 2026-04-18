import toast from 'react-hot-toast';
import api from '../../../services/api';
import {
  INVENTORY_ADJUST_FAILURE, INVENTORY_ADJUST_REQUEST,
  INVENTORY_ADJUST_SUCCESS, INVENTORY_EXPORT_FAILURE, INVENTORY_EXPORT_REQUEST,
  INVENTORY_EXPORT_SUCCESS, INVENTORY_IMPORT_FAILURE, INVENTORY_IMPORT_REQUEST,
  INVENTORY_IMPORT_SUCCESS, INVENTORY_TRANSACTIONS_FAILURE, INVENTORY_TRANSACTIONS_REQUEST,
  INVENTORY_TRANSACTIONS_SUCCESS
} from '../actionTypes';

// Nhập kho
export const importStockAction = (payload) => async (dispatch) => {
  dispatch({ type: INVENTORY_IMPORT_REQUEST });
  try {
    const { data } = await api.post('/inventory/import', payload);
    dispatch({ type: INVENTORY_IMPORT_SUCCESS, payload: data });
    toast.success(`Nhập kho thành công: ${data.new_stock}`);
    return { success: true, data };
  } catch (err) {
    const message = err.response?.data?.detail || 'Lỗi khi nhập kho';
    dispatch({ type: INVENTORY_IMPORT_FAILURE, payload: message });
    toast.error(message);
    return { success: false, message };
  }
};

// Xuất kho
export const exportStockAction = (payload) => async (dispatch) => {
  dispatch({ type: INVENTORY_EXPORT_REQUEST });
  try {
    const { data } = await api.post('/inventory/export', payload);
    dispatch({ type: INVENTORY_EXPORT_SUCCESS, payload: data });
    toast.success(`Xuất kho thành công: ${data.new_stock}`);
    return { success: true, data };
  } catch (err) {
    const message = err.response?.data?.detail || 'Lỗi khi xuất kho';
    dispatch({ type: INVENTORY_EXPORT_FAILURE, payload: message });
    toast.error(message);
    return { success: false, message };
  }
};

// Điều chỉnh tồn kho
export const adjustStockAction = (payload) => async (dispatch) => {
  dispatch({ type: INVENTORY_ADJUST_REQUEST });
  try {
    const { data } = await api.post('/inventory/adjust', payload);
    dispatch({ type: INVENTORY_ADJUST_SUCCESS, payload: data });
    toast.success(`Điều chỉnh thành công: ${data.new_stock}`);
    return { success: true, data };
  } catch (err) {
    const message = err.response?.data?.detail || 'Lỗi khi điều chỉnh tồn kho';
    dispatch({ type: INVENTORY_ADJUST_FAILURE, payload: message });
    toast.error(message);
    return { success: false, message };
  }
};

// Lấy lịch sử giao dịch kho
export const getTransactionsAction = (productId = '') => async (dispatch) => {
  dispatch({ type: INVENTORY_TRANSACTIONS_REQUEST });
  try {
    const params = productId ? { product_id: productId } : {};
    const { data } = await api.get('/inventory/transactions', { params });
    dispatch({ type: INVENTORY_TRANSACTIONS_SUCCESS, payload: data });
  } catch (err) {
    const message = err.response?.data?.detail || 'Lỗi khi tải lịch sử giao dịch';
    dispatch({ type: INVENTORY_TRANSACTIONS_FAILURE, payload: message });
    toast.error(message);
  }
};

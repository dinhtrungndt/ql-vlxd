import toast from 'react-hot-toast';
import api from '../../../services/api';
import {
  REPORT_DASHBOARD_FAILURE, REPORT_DASHBOARD_REQUEST,
  REPORT_DASHBOARD_SUCCESS, REPORT_INVENTORY_FAILURE, REPORT_INVENTORY_REQUEST,
  REPORT_INVENTORY_SUCCESS
} from '../actionTypes';

// Lấy dashboard report
export const getDashboardReportAction = () => async (dispatch) => {
  dispatch({ type: REPORT_DASHBOARD_REQUEST });
  try {
    const { data } = await api.get('/reports/dashboard');
    dispatch({ type: REPORT_DASHBOARD_SUCCESS, payload: data });
  } catch (err) {
    const message = err.response?.data?.detail || 'Lỗi khi tải báo cáo tổng quan';
    dispatch({ type: REPORT_DASHBOARD_FAILURE, payload: message });
    toast.error(message);
  }
};

// Lấy báo cáo tồn kho chi tiết
export const getInventoryReportAction = (category = '') => async (dispatch) => {
  dispatch({ type: REPORT_INVENTORY_REQUEST });
  try {
    const params = category ? { category } : {};
    const { data } = await api.get('/reports/inventory', { params });
    dispatch({ type: REPORT_INVENTORY_SUCCESS, payload: data });
  } catch (err) {
    const message = err.response?.data?.detail || 'Lỗi khi tải báo cáo tồn kho';
    dispatch({ type: REPORT_INVENTORY_FAILURE, payload: message });
    toast.error(message);
  }
};

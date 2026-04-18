import toast from 'react-hot-toast';
import api from '../../../services/api';
import {
  PRODUCT_CREATE_FAILURE, PRODUCT_CREATE_REQUEST,
  PRODUCT_CREATE_SUCCESS, PRODUCT_DETAIL_FAILURE, PRODUCT_DETAIL_REQUEST,
  PRODUCT_DETAIL_SUCCESS, PRODUCT_HIDDEN_LIST_FAILURE, PRODUCT_HIDDEN_LIST_REQUEST,
  PRODUCT_HIDDEN_LIST_SUCCESS, PRODUCT_HIDE_FAILURE, PRODUCT_HIDE_REQUEST,
  PRODUCT_HIDE_SUCCESS, PRODUCT_LIST_FAILURE, PRODUCT_LIST_REQUEST,
  PRODUCT_LIST_SUCCESS, PRODUCT_RESTORE_FAILURE, PRODUCT_RESTORE_REQUEST,
  PRODUCT_RESTORE_SUCCESS, PRODUCT_UPDATE_FAILURE, PRODUCT_UPDATE_REQUEST,
  PRODUCT_UPDATE_SUCCESS
} from '../actionTypes';

// Lấy danh sách sản phẩm
export const getProductsAction = (params = {}) => async (dispatch) => {
  dispatch({ type: PRODUCT_LIST_REQUEST });
  try {
    const { data } = await api.get('/products', { params });
    dispatch({ type: PRODUCT_LIST_SUCCESS, payload: data });
  } catch (err) {
    const message = err.response?.data?.detail || 'Lỗi khi tải danh sách sản phẩm';
    dispatch({ type: PRODUCT_LIST_FAILURE, payload: message });
    toast.error(message);
  }
};

// Lấy danh sách sản phẩm bị ẩn
export const getHiddenProductsAction = () => async (dispatch) => {
  dispatch({ type: PRODUCT_HIDDEN_LIST_REQUEST });
  try {
    const { data } = await api.get('/products/hidden');
    dispatch({ type: PRODUCT_HIDDEN_LIST_SUCCESS, payload: data });
  } catch (err) {
    const message = err.response?.data?.detail || 'Lỗi khi tải danh sách sản phẩm ẩn';
    dispatch({ type: PRODUCT_HIDDEN_LIST_FAILURE, payload: message });
    toast.error(message);
  }
};

// Xem chi tiết sản phẩm
export const getProductDetailAction = (id) => async (dispatch) => {
  dispatch({ type: PRODUCT_DETAIL_REQUEST });
  try {
    const { data } = await api.get(`/products/${id}`);
    dispatch({ type: PRODUCT_DETAIL_SUCCESS, payload: data });
  } catch (err) {
    const message = err.response?.data?.detail || 'Lỗi khi tải thông tin chi tiết';
    dispatch({ type: PRODUCT_DETAIL_FAILURE, payload: message });
    toast.error(message);
  }
};

// Tạo sản phẩm
export const createProductAction = (formData) => async (dispatch) => {
  dispatch({ type: PRODUCT_CREATE_REQUEST });
  try {
    const { data } = await api.post('/products/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    dispatch({ type: PRODUCT_CREATE_SUCCESS, payload: data });
    toast.success('Tạo vật tư thành công');
    return { success: true, data };
  } catch (err) {
    const message = err.response?.data?.detail || 'Lỗi khi tạo vật tư';
    dispatch({ type: PRODUCT_CREATE_FAILURE, payload: message });
    toast.error(message);
    return { success: false, message };
  }
};

// Cập nhật sản phẩm
export const updateProductAction = (id, formData) => async (dispatch) => {
  dispatch({ type: PRODUCT_UPDATE_REQUEST });
  try {
    const { data } = await api.put(`/products/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    dispatch({ type: PRODUCT_UPDATE_SUCCESS, payload: data });
    toast.success('Cập nhật vật tư thành công');
    return { success: true, data };
  } catch (err) {
    const message = err.response?.data?.detail || 'Lỗi khi cập nhật vật tư';
    dispatch({ type: PRODUCT_UPDATE_FAILURE, payload: message });
    toast.error(message);
    return { success: false, message };
  }
};

// Xóa mềm (ẩn) sản phẩm
export const hideProductAction = (id) => async (dispatch) => {
  dispatch({ type: PRODUCT_HIDE_REQUEST });
  try {
    await api.put(`/products/${id}/hide`);
    dispatch({ type: PRODUCT_HIDE_SUCCESS, payload: id });
    toast.success('Đã ẩn vật tư');
    return { success: true };
  } catch (err) {
    const message = err.response?.data?.detail || 'Lỗi khi ẩn vật tư';
    dispatch({ type: PRODUCT_HIDE_FAILURE, payload: message });
    toast.error(message);
    return { success: false, message };
  }
};

// Khôi phục sản phẩm
export const restoreProductAction = (id) => async (dispatch) => {
  dispatch({ type: PRODUCT_RESTORE_REQUEST });
  try {
    await api.put(`/products/${id}/restore`);
    dispatch({ type: PRODUCT_RESTORE_SUCCESS, payload: id });
    toast.success('Đã khôi phục vật tư');
    return { success: true };
  } catch (err) {
    const message = err.response?.data?.detail || 'Lỗi khi khôi phục vật tư';
    dispatch({ type: PRODUCT_RESTORE_FAILURE, payload: message });
    toast.error(message);
    return { success: false, message };
  }
};

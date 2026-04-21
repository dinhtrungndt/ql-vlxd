import toast from 'react-hot-toast';
import api from '../../../services/api';
import {
  CATEGORY_LIST_FAILURE, CATEGORY_LIST_REQUEST, CATEGORY_LIST_SUCCESS, PRODUCT_CREATE_FAILURE, PRODUCT_CREATE_REQUEST,
  PRODUCT_CREATE_SUCCESS, PRODUCT_DETAIL_FAILURE, PRODUCT_DETAIL_REQUEST,
  PRODUCT_DETAIL_SUCCESS, PRODUCT_HIDDEN_LIST_FAILURE, PRODUCT_HIDDEN_LIST_REQUEST,
  PRODUCT_HIDDEN_LIST_SUCCESS, PRODUCT_HIDE_FAILURE, PRODUCT_HIDE_REQUEST,
  PRODUCT_HIDE_SUCCESS, PRODUCT_LIST_FAILURE, PRODUCT_LIST_REQUEST,
  PRODUCT_LIST_SUCCESS, PRODUCT_RESTORE_FAILURE, PRODUCT_RESTORE_REQUEST,
  PRODUCT_RESTORE_SUCCESS, PRODUCT_UPDATE_FAILURE, PRODUCT_UPDATE_REQUEST,
  PRODUCT_UPDATE_SUCCESS
} from '../actionTypes';

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

// ===================== CATEGORIES (FOREIGN KEY) =====================

export const getCategoriesAction = () => async (dispatch) => {
  dispatch({ type: CATEGORY_LIST_REQUEST });
  try {
    const { data } = await api.get('/products/categories');
    dispatch({ type: CATEGORY_LIST_SUCCESS, payload: data });
    return { success: true, data };
  } catch (err) {
    const message = err.response?.data?.detail || 'Lỗi khi tải danh sách danh mục';
    dispatch({ type: CATEGORY_LIST_FAILURE, payload: message });
    toast.error(message);
    return { success: false, message };
  }
};

// Đã cập nhật gửi data bằng chuẩn JSON
export const renameCategoryAction = (catId, newName) => async (dispatch) => {
  try {
    await api.put('/products/category/rename', {
      cat_id: catId,
      new_name: newName
    });
    toast.success('Đổi tên danh mục thành công!');
    dispatch(getCategoriesAction());
    dispatch(getProductsAction()); // Update lại bảng vật tư
    return { success: true };
  } catch (err) {
    toast.error(err.response?.data?.detail || 'Lỗi khi đổi tên danh mục');
    return { success: false };
  }
};

export const deleteCategoryAction = (catId) => async (dispatch) => {
  try {
    await api.delete(`/products/category/delete?cat_id=${catId}`);
    toast.success(`Đã xóa danh mục thành công`);
    dispatch(getCategoriesAction());
    dispatch(getProductsAction()); // Update lại bảng vật tư
    return { success: true };
  } catch (err) {
    toast.error(err.response?.data?.detail || 'Lỗi khi xóa danh mục');
    return { success: false };
  }
};

export const createCategoryAction = (categoryName) => async (dispatch) => {
  try {
    const { data } = await api.post('/products/category', { name: categoryName });
    toast.success('Thêm danh mục mới thành công!');
    dispatch(getCategoriesAction());
    return { success: true, data };
  } catch (err) {
    toast.error(err.response?.data?.detail || 'Lỗi khi thêm danh mục');
    return { success: false };
  }
};

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

const initialState = {
  products: [],
  hiddenProducts: [],
  productDetail: null,
  loading: false,
  error: null,
};

const productReducer = (state = initialState, action) => {
  switch (action.type) {
    case PRODUCT_LIST_REQUEST:
    case PRODUCT_DETAIL_REQUEST:
    case PRODUCT_CREATE_REQUEST:
    case PRODUCT_UPDATE_REQUEST:
    case PRODUCT_HIDE_REQUEST:
    case PRODUCT_RESTORE_REQUEST:
    case PRODUCT_HIDDEN_LIST_REQUEST:
      return { ...state, loading: true, error: null };

    case PRODUCT_LIST_SUCCESS:
      return { ...state, loading: false, products: action.payload };

    case PRODUCT_HIDDEN_LIST_SUCCESS:
      return { ...state, loading: false, hiddenProducts: action.payload };

    case PRODUCT_DETAIL_SUCCESS:
      return { ...state, loading: false, productDetail: action.payload };

    case PRODUCT_CREATE_SUCCESS:
      return {
        ...state,
        loading: false,
        products: [action.payload, ...state.products],
      };

    case PRODUCT_UPDATE_SUCCESS:
      return {
        ...state,
        loading: false,
        products: state.products.map((p) =>
          p.id === action.payload.id ? action.payload : p
        ),
        productDetail: state.productDetail?.id === action.payload.id ? action.payload : state.productDetail,
      };

    case PRODUCT_HIDE_SUCCESS:
      return {
        ...state,
        loading: false,
        products: state.products.filter((p) => p.id !== action.payload),
      };

    case PRODUCT_RESTORE_SUCCESS:
      return {
        ...state,
        loading: false,
        hiddenProducts: state.hiddenProducts.filter((p) => p.id !== action.payload),
      };

    case PRODUCT_LIST_FAILURE:
    case PRODUCT_DETAIL_FAILURE:
    case PRODUCT_CREATE_FAILURE:
    case PRODUCT_UPDATE_FAILURE:
    case PRODUCT_HIDE_FAILURE:
    case PRODUCT_RESTORE_FAILURE:
    case PRODUCT_HIDDEN_LIST_FAILURE:
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};

export default productReducer;

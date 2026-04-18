import {
  INVENTORY_ADJUST_FAILURE, INVENTORY_ADJUST_REQUEST,
  INVENTORY_ADJUST_SUCCESS, INVENTORY_EXPORT_FAILURE, INVENTORY_EXPORT_REQUEST,
  INVENTORY_EXPORT_SUCCESS, INVENTORY_IMPORT_FAILURE, INVENTORY_IMPORT_REQUEST,
  INVENTORY_IMPORT_SUCCESS, INVENTORY_TRANSACTIONS_FAILURE, INVENTORY_TRANSACTIONS_REQUEST,
  INVENTORY_TRANSACTIONS_SUCCESS
} from '../actionTypes';

const initialState = {
  transactions: [],
  loading: false,
  error: null,
};

const inventoryReducer = (state = initialState, action) => {
  switch (action.type) {
    case INVENTORY_TRANSACTIONS_REQUEST:
    case INVENTORY_IMPORT_REQUEST:
    case INVENTORY_EXPORT_REQUEST:
    case INVENTORY_ADJUST_REQUEST:
      return { ...state, loading: true, error: null };

    case INVENTORY_TRANSACTIONS_SUCCESS:
      return { ...state, loading: false, transactions: action.payload };

    case INVENTORY_IMPORT_SUCCESS:
    case INVENTORY_EXPORT_SUCCESS:
    case INVENTORY_ADJUST_SUCCESS:
      return { ...state, loading: false };

    case INVENTORY_TRANSACTIONS_FAILURE:
    case INVENTORY_IMPORT_FAILURE:
    case INVENTORY_EXPORT_FAILURE:
    case INVENTORY_ADJUST_FAILURE:
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};

export default inventoryReducer;

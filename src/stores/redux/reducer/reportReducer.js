import {
  REPORT_DASHBOARD_FAILURE, REPORT_DASHBOARD_REQUEST,
  REPORT_DASHBOARD_SUCCESS, REPORT_INVENTORY_FAILURE, REPORT_INVENTORY_REQUEST,
  REPORT_INVENTORY_SUCCESS
} from '../actionTypes';

const initialState = {
  dashboard: null,
  inventoryReport: null,
  loading: false,
  error: null,
};

const reportReducer = (state = initialState, action) => {
  switch (action.type) {
    case REPORT_DASHBOARD_REQUEST:
    case REPORT_INVENTORY_REQUEST:
      return { ...state, loading: true, error: null };

    case REPORT_DASHBOARD_SUCCESS:
      return { ...state, loading: false, dashboard: action.payload };

    case REPORT_INVENTORY_SUCCESS:
      return { ...state, loading: false, inventoryReport: action.payload };

    case REPORT_DASHBOARD_FAILURE:
    case REPORT_INVENTORY_FAILURE:
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};

export default reportReducer;

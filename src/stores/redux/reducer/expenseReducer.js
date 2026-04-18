import {
  EXPENSE_CREATE_FAILURE, EXPENSE_CREATE_REQUEST,
  EXPENSE_CREATE_SUCCESS, EXPENSE_HIDE_FAILURE, EXPENSE_HIDE_REQUEST,
  EXPENSE_HIDE_SUCCESS, EXPENSE_LIST_FAILURE, EXPENSE_LIST_REQUEST,
  EXPENSE_LIST_SUCCESS
} from '../actionTypes';

const initialState = {
  expenses: [],
  loading: false,
  error: null,
};

const expenseReducer = (state = initialState, action) => {
  switch (action.type) {
    case EXPENSE_LIST_REQUEST:
    case EXPENSE_CREATE_REQUEST:
    case EXPENSE_HIDE_REQUEST:
      return { ...state, loading: true, error: null };

    case EXPENSE_LIST_SUCCESS:
      return { ...state, loading: false, expenses: action.payload };

    case EXPENSE_CREATE_SUCCESS:
      return {
        ...state,
        loading: false,
        expenses: [action.payload, ...state.expenses],
      };

    case EXPENSE_HIDE_SUCCESS:
      return {
        ...state,
        loading: false,
        expenses: state.expenses.filter((e) => e.id !== action.payload),
      };

    case EXPENSE_LIST_FAILURE:
    case EXPENSE_CREATE_FAILURE:
    case EXPENSE_HIDE_FAILURE:
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};

export default expenseReducer;

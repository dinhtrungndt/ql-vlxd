import {
  EXPENSE_CREATE_FAILURE, EXPENSE_CREATE_REQUEST, EXPENSE_CREATE_SUCCESS, EXPENSE_HIDDEN_LIST_FAILURE, EXPENSE_HIDDEN_LIST_REQUEST, EXPENSE_HIDDEN_LIST_SUCCESS, EXPENSE_HIDE_FAILURE, EXPENSE_HIDE_REQUEST, EXPENSE_HIDE_SUCCESS,
  EXPENSE_LIST_FAILURE, EXPENSE_LIST_REQUEST, EXPENSE_LIST_SUCCESS, EXPENSE_RESTORE_FAILURE, EXPENSE_RESTORE_REQUEST, EXPENSE_RESTORE_SUCCESS, EXPENSE_UPDATE_FAILURE, EXPENSE_UPDATE_REQUEST, EXPENSE_UPDATE_SUCCESS
} from '../actionTypes';

const initialState = {
  expenses: [],
  hiddenExpenses: [],
  loading: false,
  error: null,
};

const expenseReducer = (state = initialState, action) => {
  switch (action.type) {
    case EXPENSE_LIST_REQUEST:
    case EXPENSE_HIDDEN_LIST_REQUEST:
    case EXPENSE_CREATE_REQUEST:
    case EXPENSE_UPDATE_REQUEST:
    case EXPENSE_HIDE_REQUEST:
    case EXPENSE_RESTORE_REQUEST:
      return { ...state, loading: true, error: null };

    case EXPENSE_LIST_SUCCESS:
      return { ...state, loading: false, expenses: action.payload };

    case EXPENSE_HIDDEN_LIST_SUCCESS:
      return { ...state, loading: false, hiddenExpenses: action.payload };

    case EXPENSE_CREATE_SUCCESS:
      return {
        ...state,
        loading: false,
        expenses: [action.payload, ...state.expenses],
      };

    case EXPENSE_UPDATE_SUCCESS:
      return {
        ...state,
        loading: false,
        expenses: state.expenses.map((e) =>
          e.id === action.payload.id ? action.payload : e
        ),
      };

    case EXPENSE_HIDE_SUCCESS:
      return {
        ...state,
        loading: false,
        expenses: state.expenses.filter((e) => e.id !== action.payload),
      };

    case EXPENSE_RESTORE_SUCCESS:
      return {
        ...state,
        loading: false,
        hiddenExpenses: state.hiddenExpenses.filter((e) => e.id !== action.payload),
      };

    case EXPENSE_LIST_FAILURE:
    case EXPENSE_HIDDEN_LIST_FAILURE:
    case EXPENSE_CREATE_FAILURE:
    case EXPENSE_UPDATE_FAILURE:
    case EXPENSE_HIDE_FAILURE:
    case EXPENSE_RESTORE_FAILURE:
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};

export default expenseReducer;

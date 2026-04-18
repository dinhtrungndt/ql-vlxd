import { combineReducers } from 'redux';
import authReducer from './authReducer';
import productReducer from './productReducer';
import inventoryReducer from './inventoryReducer';
import expenseReducer from './expenseReducer';
import reportReducer from './reportReducer';

const rootReducer = combineReducers({
  auth: authReducer,
  product: productReducer,
  inventory: inventoryReducer,
  expense: expenseReducer,
  report: reportReducer,
});

export default rootReducer;

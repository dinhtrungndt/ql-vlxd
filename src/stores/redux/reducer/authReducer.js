import { loadSession } from '../../../utils/storage';
import {
  AUTH_GET_ME_FAILURE, AUTH_GET_ME_REQUEST,
  AUTH_GET_ME_SUCCESS, AUTH_LOGIN_FAILURE, AUTH_LOGIN_REQUEST,
  AUTH_LOGIN_SUCCESS, AUTH_LOGOUT
} from '../actionTypes';

const session = loadSession();

const initialState = {
  user: null,
  token: session?.token || null,
  isAuthenticated: !!session?.token,
  loading: false,
  error: null,
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case AUTH_LOGIN_REQUEST:
    case AUTH_GET_ME_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case AUTH_LOGIN_SUCCESS:
      return {
        ...state,
        loading: false,
        isAuthenticated: true,
        token: action.payload.token,
        error: null,
      };

    case AUTH_GET_ME_SUCCESS:
      return {
        ...state,
        loading: false,
        isAuthenticated: true,
        user: action.payload,
        error: null,
      };

    case AUTH_LOGIN_FAILURE:
    case AUTH_GET_ME_FAILURE:
      return {
        ...state,
        loading: false,
        isAuthenticated: false,
        user: null,
        token: null,
        error: action.payload || 'Authentication failed',
      };

    case AUTH_LOGOUT:
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        error: null,
      };

    default:
      return state;
  }
};

export default authReducer;

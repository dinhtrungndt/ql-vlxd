const config = {
  API_URL: process.env.REACT_APP_API_URL || 'http://localhost:6111',
  API_V1: process.env.REACT_APP_API_URL + '/api/v1' || 'http://localhost:6111/api/v1',
  SECRET_KEY: process.env.REACT_APP_SECRET_KEY || 'dvnvlxd_2026_SECURE',
  STORAGE_KEY: 'dvn_vlxd_session',
  APP_NAME: 'Quản Lý Kho VLXD',
  COMPANY_NAME: 'Công Ty VLXD DVN',
};

export default config;

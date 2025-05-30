const isSecure = window.location.protocol === 'https:';
const WS_API_HOST = `${isSecure ? 'wss' : 'ws'}://${window.location.host}/ws/last-location/`;

const api = {
  BASE_URL: '/api/',
  API_URL: '/',
  API_ADMIN: '/admin/',
  WS_API_HOST,
  GET_POINTS: '/points/',
  GET_CLEAN_POINTS: '/clean/points/',
  GET_UNIQUE_YEARS: '/clean/unique-years/',
  LIST_FIELDS: '/fields/',
  GET_GRID_CELLS: '/fields/grid-cells/',
  LOGIN_URL: '/token/',
  TOKEN_REFRESH: '/token/refresh/',
  LIST_USER_GEO_DATA: '/user-data/geo-data/',
  CREATE_USER_GEO_DATA: '/user-data/geo-data-create/',
};

export default api;

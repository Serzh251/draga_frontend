// Определяем, в каком режиме работаем: разработка или продакшн
const isDevelopment = process.env.NODE_ENV === 'development';
const isSecure = window.location.protocol === 'https:';

// Базовый URL для API
const BASE_URL = isDevelopment
  ? 'http://localhost:2025/api/' // Прямой доступ к бэкенду
  : '/api/'; // Через nginx на проде

const WS_BASE_URL = isDevelopment
  ? 'ws://localhost:2025/ws'
  : `${isSecure ? 'wss' : 'ws'}://${window.location.host}/ws`;

const WS_LAST_LOCATION = `${WS_BASE_URL}/last-location/`;
const WS_NOTIFICATIONS = `${WS_BASE_URL}/notifications/`;

const api = {
  BASE_URL,
  WS_LAST_LOCATION,
  WS_NOTIFICATIONS,

  API_URL: '/',
  API_ADMIN: '/admin/',

  GET_POINTS: '/points/',
  GET_CLEAN_POINTS: '/clean/points/',
  GET_UNIQUE_YEARS: '/clean/unique-years/',
  LIST_FIELDS: '/fields/',
  GET_GRID_CELLS: '/fields/grid-cells/',
  LOGIN_URL: '/token/',
  TOKEN_REFRESH: '/token/refresh/',
  LIST_USER_GEO_DATA: '/user-data/geo-data/',
  CREATE_USER_GEO_DATA: '/user-data/geo-data-create/',
  SETUP_DEFAULT_MAP_CENTER: '/setup/default-center/',
  GET_TRACK_LIST: '/batymetry/tracks/',
  GET_TRACK_POINTS: '/batymetry/tracks/:id/points/',
  CREATE_POINT_MANYALLY: 'get-data/manual-save/',
};
export default api;

// Определяем, в каком режиме работаем: разработка или продакшн
const isDevelopment = process.env.NODE_ENV === 'development';
const isSecure = window.location.protocol === 'https:';

// Базовый URL для API
const BASE_URL = isDevelopment
  ? 'http://localhost:2025/api/' // Прямой доступ к бэкенду
  : '/api/'; // Через nginx на проде

// WebSocket URL
const WS_API_HOST = isDevelopment
  ? 'ws://localhost:2025/ws/last-location/' // Прямой WS
  : `${isSecure ? 'wss' : 'ws'}://${window.location.host}/ws/last-location/`;

const api = {
  BASE_URL,
  API_URL: '/', // может быть не нужен, если всё через BASE_URL
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
  SETUP_DEFAULT_MAP_CENTER: '/setup/default-center/',
};

export default api;

import { combineReducers } from 'redux';
import userReducer from './slices/userSlice';
import mapDataReducer from './slices/mapDataSlice';
import userGeoDataReducer from './slices/userGeoDataSlice';
import uiReducer from './slices/uiSlice';
import { configureStore } from '@reduxjs/toolkit';
import { composeWithDevTools } from '@redux-devtools/extension';
import { api } from '@/api/api';

const rootReducer = combineReducers({
  [api.reducerPath]: api.reducer,
  user: userReducer,
  mapData: mapDataReducer,
  userGeoData: userGeoDataReducer,
  ui: uiReducer,
});

export const store = configureStore(
  {
    reducer: rootReducer,
    devTools: true,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
        immutableCheck: false,
      }).concat(api.middleware),
  },
  composeWithDevTools()
);

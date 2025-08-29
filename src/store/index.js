import { combineReducers } from 'redux';
import userReducer from './slices/userSlice';
import mapDataReducer from './slices/mapDataSlice';
import userGeoDataReducer from './slices/userGeoDataSlice';
import { configureStore } from '@reduxjs/toolkit';
// import { thunk } from 'redux-thunk';
import { composeWithDevTools } from '@redux-devtools/extension';
import { api } from '../api/api';

const rootReducer = combineReducers({
  [api.reducerPath]: api.reducer,
  user: userReducer,
  mapData: mapDataReducer,
  userGeoData: userGeoDataReducer,
});

export const store = configureStore(
  {
    reducer: rootReducer,
    devTools: true,
    // middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk).concat(api.middleware),
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        // Настройте опции, если нужно
        serializableCheck: false, // Отключите, если передаёте несериализуемые объекты (например, Date, Set, Map)
        immutableCheck: false, // Отключите, если хотите сэкономить производительность
      }).concat(api.middleware),
  },
  composeWithDevTools()
);

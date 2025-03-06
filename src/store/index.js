import { combineReducers } from 'redux';
import userReducer from './slices/userSlice';
import { configureStore } from '@reduxjs/toolkit';
import { thunk } from 'redux-thunk';
import { composeWithDevTools } from '@redux-devtools/extension';
import { api } from '../api/api';

const rootReducer = combineReducers({
  [api.reducerPath]: api.reducer,
  user: userReducer,
});

export const store = configureStore(
  {
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk).concat(api.middleware),
  },
  composeWithDevTools()
);

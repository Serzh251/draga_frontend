import {combineReducers} from "redux";
import userReducer from "./slices/userSlice";
import {configureStore} from "@reduxjs/toolkit";
import { thunk } from "redux-thunk";
import {composeWithDevTools} from "@redux-devtools/extension";

const rootReducer = combineReducers({
  user: userReducer,
});

export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(thunk),
  },
  composeWithDevTools()
);
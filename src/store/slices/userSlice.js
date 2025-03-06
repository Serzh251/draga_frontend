import { createSlice } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';

const initialState = {
  accessToken: Cookies.get('accessToken') || null,
  refreshToken: Cookies.get('refreshToken') || null,
  currentUser: localStorage.getItem('currentUser'),
  firstName: localStorage.getItem('firstName'),
  isAuth: localStorage.getItem('isAuth'),
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action) {
      state.isAuth = action.payload.isAuth;
      state.currentUser = action.payload.currentUser;
      state.firstName = action.payload.firstName;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;

      localStorage.setItem('currentUser', action.payload.currentUser);
      localStorage.setItem('firstName', action.payload.firstName);
      localStorage.setItem('isAuth', 'true');

      Cookies.set('accessToken', action.payload.accessToken);
      Cookies.set('refreshToken', action.payload.refreshToken);
    },
    removeUser(state) {
      state.isAuth = false;
      state.currentUser = null;
      state.refreshToken = null;
      state.accessToken = null;

      localStorage.removeItem('currentUser');
      localStorage.removeItem('firstName');
      localStorage.removeItem('isAuth');

      Cookies.remove('accessToken');
      Cookies.remove('refreshToken');
    },
  },
});

export const { setUser, removeUser } = userSlice.actions;

export default userSlice.reducer;

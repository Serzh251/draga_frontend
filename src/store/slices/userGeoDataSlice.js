import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  userGeoData: null,
};

const userGeoDataSlice = createSlice({
  name: 'userGeoData',
  initialState,
  reducers: {
    setUserGeoData(state, action) {
      state.userGeoData = action.payload;
    },
    removeUserGeoData(state) {
      state.userGeoData = null;
    },
  },
});

export const { setUserGeoData, removeUserGeoData } = userGeoDataSlice.actions;

export default userGeoDataSlice.reducer;

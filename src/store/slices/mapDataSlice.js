import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  fieldsData: null,
  yearsData: null,
};

const mapDataSlice = createSlice({
  name: 'mapData',
  initialState,
  reducers: {
    setFieldsData(state, action) {
      state.fieldsData = action.payload;
    },
    setYearsData(state, action) {
      state.yearsData = action.payload;
    },
    removeMapData(state) {
      state.fieldsData = null;
      state.yearsData = null;
    },
  },
});

export const { setFieldsData, setYearsData, removeMapData } = mapDataSlice.actions;

export default mapDataSlice.reducer;

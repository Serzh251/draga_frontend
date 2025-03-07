import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  points: null,
  cleanPoints: null,
  fieldsData: null,
  yearsData: null,
};

const mapDataSlice = createSlice({
  name: 'mapData',
  initialState,
  reducers: {
    setPoints(state, action) {
      state.points = action.payload;
    },
    setCleanPoints(state, action) {
      state.cleanPoints = action.payload;
    },
    setFieldsData(state, action) {
      state.fieldsData = action.payload;
    },
    setYearsData(state, action) {
      state.yearsData = action.payload;
    },
    removeMapData(state) {
      state.points = null;
      state.cleanPoints = null;
      state.fieldsData = null;
      state.cleanPoints = null;
    },
  },
});

export const { setPoints, setCleanPoints, setFieldsData, setYearsData, removeMapData } = mapDataSlice.actions;

export default mapDataSlice.reducer;

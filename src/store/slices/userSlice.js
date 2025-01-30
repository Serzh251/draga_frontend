import {createSlice} from "@reduxjs/toolkit";


const initialState = {
  token: localStorage.getItem("token"),
  currentUser: localStorage.getItem("currentUser"),
  isAuth: localStorage.getItem("isAuth"),
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action) {
      state.isAuth = action.payload.isAuth
      state.token = action.payload.token;
      state.currentUser = action.payload.currentUser;
    },
    removeUser(state) {
      state.isAuth = false
      state.token = null
      state.currentUser = null
      localStorage.removeItem("token")
      localStorage.removeItem("currentUser")
      localStorage.removeItem("isAuth")
    },
  },
});

export const {setUser, removeUser} = userSlice.actions;

export default userSlice.reducer;
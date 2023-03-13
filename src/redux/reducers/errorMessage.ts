import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  errorMessage: null,
};

export const errorMessageSlice = createSlice({
  name: "errorMessage",
  initialState,
  reducers: {
    setErrorMessage: (state, action) => {
      state.errorMessage = action.payload;
    },
  },
});

export const { setErrorMessage } = errorMessageSlice.actions;

export default errorMessageSlice.reducer;
import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";

const initialState = {
  bookings: [],
  errorMessage: null,
};

export const bookingsSlice = createSlice({
  name: "bookings",
  initialState,
  reducers: {
    getBookingsByUserAction: (state, action) => {
      state.bookings = action.payload;
    },
    getBookingErrorMessage: (state, action) => {
      state.errorMessage = action.payload;
    },
  },
});

export const { getBookingsByUserAction, getBookingErrorMessage } = bookingsSlice.actions;

export const bookingsData = (state: RootState) => state?.bookings?.bookings;

export const bookingsErrorMessage = (state: RootState) => state?.bookings?.errorMessage;

export default bookingsSlice.reducer;

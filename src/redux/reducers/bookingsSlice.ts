import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";

const initialState = {
  bookings: [],
};

export const bookingsSlice = createSlice({
  name: "bookings",
  initialState,
  reducers: {
    getBookingsByUserAction: (state, action) => {
      state.bookings = action.payload;
    },
  },
});

export const { getBookingsByUserAction } = bookingsSlice.actions;

export const bookingsData = (state: RootState) => state?.bookings?.bookings;

export default bookingsSlice.reducer;

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

const initialState = {
  value: [],
  status: "bookings",
};

export const bookingsSlice = createSlice({
  name: "bookings",
  initialState,
  reducers: {
    bookings: (state) => {
      state.value = state.value;
    },
    setBookings: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { bookings, setBookings } = bookingsSlice.actions;

export const booking = (state:RootState) => state.bookings.value;

export default bookingsSlice.reducer;

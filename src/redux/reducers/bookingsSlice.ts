import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  allBookings: [],
  userBookings: []
};

const bookingsSlice = createSlice({
  name: "bookings",
  initialState,
  reducers: {
    setBookings: (state, action) => {
      state.allBookings = action.payload;
    },
    getAllBookingsByUser: (state, action) => {
      state.userBookings = action.payload;
    },
  },
});

export const { getAllBookingsByUser, setBookings } = bookingsSlice.actions;

export default bookingsSlice.reducer;

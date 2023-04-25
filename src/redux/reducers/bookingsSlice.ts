import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  allBookings: [],
  userBookings: [],
  isLoading: true,
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
    setIsLoading: (state, action) => {
      state.isLoading = action.payload
    }
  },
});

export const { getAllBookingsByUser, setBookings, setIsLoading } = bookingsSlice.actions;

export default bookingsSlice.reducer;

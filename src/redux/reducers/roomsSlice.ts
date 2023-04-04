import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";

const initialState = {
  rooms: [],
};

const roomsSlice = createSlice({
  name: "rooms",
  initialState,
  reducers: {
    getAllRooms: (state, action) => {
      state.rooms = action.payload;
    },
  },
});

export const { getAllRooms } = roomsSlice.actions;

export const roomsData = (state: RootState) => state?.rooms?.rooms;

export default roomsSlice.reducer;

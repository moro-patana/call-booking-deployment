import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

const initialState = {
  value: [],
  status: "rooms",
};

export const roomsSlice = createSlice({
  name: "rooms",
  initialState,
  reducers: {
    rooms: (state) => {
      state.value = state.value;
    },
    setRooms: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { rooms, setRooms } = roomsSlice.actions;

export const room = (state: RootState) => state.rooms.value;

export default roomsSlice.reducer;

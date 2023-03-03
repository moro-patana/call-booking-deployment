import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";

const initialState = {
  rooms: [],
  errorMessage: "",
};

export const roomsSlice = createSlice({
  name: "rooms",
  initialState,
  reducers: {
    getRoomsAction: (state, action) => {
      state.rooms = action.payload;
    },
    getRoomsErrorMessage: (state, action) => {
      state.errorMessage = action.payload;
    },
  },
});

export const { getRoomsAction, getRoomsErrorMessage } = roomsSlice.actions;

export const roomsData = (state: RootState) => state?.rooms?.rooms;

export const roomsErrorMessage = (state: RootState) => state?.rooms.errorMessage;

export default roomsSlice.reducer;

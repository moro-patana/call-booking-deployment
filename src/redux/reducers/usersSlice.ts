import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

const initialState = {
  value: [],
  status: "users",
};

export const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    users: (state) => {
      state.value = state.value;
    },
    setUsers: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { users, setUsers } = usersSlice.actions;

export const user = (state: RootState) => state.users.value;

export default usersSlice.reducer;

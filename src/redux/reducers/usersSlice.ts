import { createSlice } from "@reduxjs/toolkit";

interface UsersState {
  users: [];
  currentUser: {
    username: string;
    email?: string;
    id?: string;
    token?: string;
    isRegister: boolean;
    isLogin: boolean;
    login: {
      email: string;
      id: string;
      token: string;
      username: string;
    };
  };
}

const initialState: UsersState = {
  users: [],
  currentUser: {
    id: "",
    username: "",
    email: "",
    token: "",
    isRegister: false,
    isLogin: false,
    login: { email: "", id: "", token: "", username: "" },
  },
};

// TODO: handle diff async state with Redux Thunk
export const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    fetchUsers: (state, action) => {
      state.users = action.payload;
    },
    fetchCurrentUser: (state, action) => {
      state.currentUser = action.payload;
    },
    userLoggedIn: (state, action) => {
      state.currentUser.isLogin = action.payload;
    },
    userRegistered: (state, action) => {
      state.currentUser.isRegister = action.payload;
    },
    userLoggedout: (state, action) => {
      state.currentUser.isLogin = action.payload;
    },
  },
});

export const {
  fetchUsers,
  fetchCurrentUser,
  userLoggedIn,
  userRegistered,
  userLoggedout,
} = usersSlice.actions;

export default usersSlice.reducer;

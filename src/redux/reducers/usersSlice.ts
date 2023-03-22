import { createSlice } from "@reduxjs/toolkit";

type fetchUserRegisterError = {
  message: string
};

type FetchUserLoginError = {
  message: string
};

interface UsersState {
  users: [];
  currentUser: {
    username: string;
    email?: string;
    id?: string;
    access_token?: string;
    isLogin: boolean;
    registerError: fetchUserRegisterError | null;
    loginError: FetchUserLoginError | null;
    login: {
      email: string;
      id: string;
      access_token: string;
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
    access_token: "",
    isLogin: false,
    registerError: null,
    loginError: null,
    login: { email: "", id: "", access_token: "", username: "" },
  },
};

// TODO: handle diff async state with Redux Thunk
const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setUsers: (state, action) => {
      state.users = action.payload;
    },
    setCurrentUser: (state, action) => {
      state.currentUser = action.payload;
    },
    setUserLoggedIn: (state, action) => {
      state.currentUser.isLogin = action.payload;
    },
    userLoggedout: (state, action) => {
      state.currentUser.isLogin = action.payload;
    },
  },
});

export const { setUsers, setCurrentUser, setUserLoggedIn, userLoggedout } = usersSlice.actions;

export default usersSlice.reducer;
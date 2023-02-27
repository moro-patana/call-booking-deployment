import { createSlice } from "@reduxjs/toolkit";

type fetchUserRegisterError = {
  message: string
};

type FetchUserLoginError = {
  message: string
};

interface UsersState {
  users: [],
  currentUser: {
    username: string
    email?: string
    id?: string
    token?: string
    isRegister: boolean
    isLogin: boolean
    registerError: fetchUserRegisterError | null,
    loginError: FetchUserLoginError | null,
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
    registerError: null,
    loginError: null,
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

export const { fetchUsers, fetchCurrentUser, userLoggedIn, userRegistered, userLoggedout } = usersSlice.actions;

// const selectLoginError = (state: RootState) => state?.users?.loginError
// export const userErrorLogin = createSelector(
//   selectLoginError,
//   (loginError) => loginError
// )

export default usersSlice.reducer;



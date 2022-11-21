import { createAsyncThunk, createSelector, createSlice } from "@reduxjs/toolkit";
import { FETCH_STATUS } from "../../constants";
import { loginMutation, registerMutation, sendQuery } from "../../graphqlHelper";
import { AppDispatch, RootState } from "../store";

type fetchUserRegisterError = {
  message: string
}

type FetchUserLoginError = {
  message: string
}

interface UserRegister {
  username: string
  password: string
  email: string
}

interface PayloadForm {
  register: UserRegister
}

interface UserData {
  username: string
  email?:string
  id?:string
  token?:string 
}

interface UserLogin {
  email: string
  password: string
}

interface LoginFormPayload {
  login: UserData
}

const initialState: any = {
  value: [],
  user: { id: "", username: "", email: "", password: ""},
  status: "users",
  registerError: null as fetchUserRegisterError | null,
  loginError: null as FetchUserLoginError | null,
};

export const fetchUserRegister = createAsyncThunk<
  PayloadForm,
  UserRegister,
  {
    dispatch: AppDispatch
    state: RootState
    rejectValue: fetchUserRegisterError
  }
>('user/fetch', async (userRegisterForm, thunkApi) => {
  const { username, password, email } = userRegisterForm

  const response = await sendQuery(
    registerMutation(username, password, email)
  )

  const user = response.data.data

  if (response.status !== 200) {
    return thunkApi.rejectWithValue({
      message: 'Failed to fetch users.',
    })
  }

  const errorMessage = response?.data?.errors
  if (errorMessage) {
    return thunkApi.rejectWithValue({
      message: errorMessage?.[0].message,
    })
  }
  return user
})

export const fetchUserLogin = createAsyncThunk<
  LoginFormPayload,
  UserLogin,
  {
    dispatch: AppDispatch
    state: RootState
    rejectValue: FetchUserLoginError
  }
>('user/login', async (userRegisterForm, thunkApi) => {
  const { email, password } = userRegisterForm

  const response = await sendQuery(loginMutation(email, password))

  const user = response.data.data

  if (response.status !== 200) {
    return thunkApi.rejectWithValue({
      message: 'Failed to fetch users.',
    })
  }

  const errorMessage = response?.data?.errors
  if (errorMessage) {
    return thunkApi.rejectWithValue({
      message: errorMessage?.[0].message,
    })
  }
  return user
})

export const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    users: (state) => {
      state.value = [...state.value];
    },
    setUsers: (state, action) => {
      state.status = FETCH_STATUS.IDLE
      state.value = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchUserRegister.pending, (state) => {
      state.status = FETCH_STATUS.LOADING
    })
    builder.addCase(fetchUserRegister.fulfilled, (state, { payload }) => {
      state.value.push(payload.register)
      state.user = payload.register
      state.status = FETCH_STATUS.IDLE
    })
    builder.addCase(fetchUserRegister.rejected, (state) => {
      state.status = FETCH_STATUS.IDLE
    })
    builder.addCase(fetchUserLogin.pending, (state) => {
      state.status =  FETCH_STATUS.LOADING
      state.loginError = null
    })
    builder.addCase(fetchUserLogin.fulfilled, (state, { payload }) => {
      state.user = payload.login
      state.status = FETCH_STATUS.IDLE
    })
    builder.addCase(fetchUserLogin.rejected, (state, { payload }) => {
      if (payload) state.loginError = payload
      state.status = FETCH_STATUS.IDLE
    })
  },
});

export const { users, setUsers } = usersSlice.actions;

export const selectUser = (state: RootState) => state.users.user
export const usersData = (state: RootState) => state?.users?.value;
export const status = (state: RootState) => state?.users?.status;
const selectRegisterError = (state: RootState) => state?.users?.registerError
const selectLoginError = (state: RootState) => state?.users?.loginError

export const userSelector = createSelector(
  selectUser,
  (user) => user
)

export const userErrorLogin = createSelector(
  selectLoginError,
  (loginError) => loginError
)

export const userErrorRegister = createSelector(
  selectRegisterError,
  (registerError) => registerError
)

export default usersSlice.reducer;

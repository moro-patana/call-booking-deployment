import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { FETCH_STATUS } from "../../constants";
import { registerMutation, sendQuery } from "../../graphqlHelper";
import { AppDispatch, RootState } from "../store";

type fetchUserRegisterError = {
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

const initialState: any = {
  value: [],
  status: "users",
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
      message: 'Failed to fetch todos.',
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
      state.status = FETCH_STATUS.IDLE
    })
    builder.addCase(fetchUserRegister.rejected, (state) => {
      state.status = FETCH_STATUS.IDLE
    })
  },
});

export const { users, setUsers } = usersSlice.actions;

export const usersData = (state: RootState) => state?.users?.value;
export const status = (state: RootState) => state?.users?.status;

export default usersSlice.reducer;

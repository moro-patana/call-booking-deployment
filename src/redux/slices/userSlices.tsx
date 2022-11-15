import { createAsyncThunk, createSelector, createSlice } from '@reduxjs/toolkit'
import { FETCH_STATUS } from '../../constants'
import { sendQuery, registerMutation } from '../../graphqlHelper'
import { AppDispatch, RootState } from '../store'

type fetchUserRegisterError = {
  message: string
}

interface UserRegister {
  id:string
  username: string
  password: string
  email: string
}

interface PayloadForm {
  register: UserRegister
}

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

const initialState = {
  user: { id: '', username: '', email: "", password: '' } as any,
  status: '',
}

export const userSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchUserRegister.pending, (state) => {
      state.status = FETCH_STATUS.LOADING
    })
    builder.addCase(fetchUserRegister.fulfilled, (state, { payload }) => {
      state.user = payload?.register
      state.status = FETCH_STATUS.IDLE
    })
    builder.addCase(fetchUserRegister.rejected, (state) => {
      state.status = FETCH_STATUS.IDLE
    })
  },
})

const selectUser = (state: RootState) => state.user;

export const userSelector = createSelector(
  selectUser,
  (user) => user
)


export default userSlice.reducer

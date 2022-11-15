import { combineReducers, configureStore } from '@reduxjs/toolkit';
import userReducer from "./slices/userSlices"

const rootReducer = combineReducers({
  user: userReducer,
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

const store = configureStore({
  reducer: rootReducer,
})



export default store;

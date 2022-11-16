import { combineReducers, configureStore } from "@reduxjs/toolkit";
import bookingsSlice from "./reducers/bookingsSlice";
import roomsSlice from "./reducers/roomsSlice";
import usersSlice from "./reducers/usersSlice";
const rootReducer = combineReducers({
  // reducer state goes here imported from ./slices
  bookings: bookingsSlice,
  rooms: roomsSlice,
  users: usersSlice,
});

// If needed: Get createBrowserHistory from history lib
// export const history = createBrowserHistory();

const store = configureStore({
  reducer: rootReducer,
  // middleware: (getDefaultMiddleware) =>
  //   getDefaultMiddleware().concat(routerMiddleware(history)),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;

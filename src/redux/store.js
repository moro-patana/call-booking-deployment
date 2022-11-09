import { combineReducers, configureStore } from '@reduxjs/toolkit';

const rootReducer = combineReducers({
  // reducer state goes here imported from ./slices
  // users;
});

// If needed: Get createBrowserHistory from history lib
// export const history = createBrowserHistory();

const store = configureStore({
  reducer: rootReducer,
  // middleware: (getDefaultMiddleware) =>
  //   getDefaultMiddleware().concat(routerMiddleware(history)),
});

export default store;

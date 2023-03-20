import {
  getBookingsByUser,
  sendAuthorizedQuery,
  sendQuery,
  updateBooking,
  getBookings,
} from "../../graphqlHelper";
import { FetchBookingsByUserAction } from "../actionTypes";
import {
  setBookings,
  getBookingsByUserAction,
} from "../reducers/bookingsSlice";
import { setErrorMessage } from "../reducers/errorMessage";

export const fetchAllBookings = () => {
  return async (dispatch: FetchBookingsByUserAction) => {
    try {
      const response = await sendQuery(getBookings());
      const resData = response?.data?.data?.getBookings;
      dispatch(setBookings(resData));
    } catch (error) {
      dispatch(setErrorMessage(error));
    }
  };
};

export const fetchBookingsByUser = (userId: string) => {
  return async (dispatch: FetchBookingsByUserAction) => {
    try {
      const response = await sendQuery(getBookingsByUser(userId));
      const resData = response?.data?.data?.getBookingsByUser;
      dispatch(getBookingsByUserAction(resData));
    } catch (error) {
      dispatch(setErrorMessage(error));
    }
  };
};

export const updateSelectedBooking = (
  id: string | number,
  resourceId: string,
  title: string,
  start: string | Date,
  end: string | Date,
  userId: string,
  access_token: string
) => {
  return async (dispatch: FetchBookingsByUserAction) => {
    try {
      if (access_token) {
        const response = await sendAuthorizedQuery(
          updateBooking(id, resourceId, title, start, end, userId),
          access_token
        );

        return response.data.data;
      }
    } catch (error) {
      dispatch(setErrorMessage(error));
    }
  };
};

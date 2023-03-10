import { getBookingsByUser, sendQuery } from "../../graphqlHelper";
import { ErrorMessage } from "../../utils/types";
import { FetchBookingsByUserAction } from "../actionTypes";
import { getBookingsByUserAction } from "../reducers/bookingsSlice";

export const fetchBookingsByUser = (setErrorMessage: (value: ErrorMessage) => void) => {
    return async (dispatch: FetchBookingsByUserAction) => {
        try {
            const response = await sendQuery(getBookingsByUser());
            dispatch(getBookingsByUserAction(response?.data?.data?.getBookings));
        } catch (error) {
            setErrorMessage(error)
        }
    };
};
import { getBookingsByUser, sendQuery } from "../../graphqlHelper";
import { FetchBookingsByUserAction } from "../actionTypes";
import { getBookingsByUserAction } from "../reducers/bookingsSlice";

export const fetchBookingsByUser = (setErrorMessage: (value: string) => void) => {
    return async (dispatch: FetchBookingsByUserAction) => {
        try {
            const response = await sendQuery(getBookingsByUser());
            dispatch(getBookingsByUserAction(response?.data?.data?.getBookings));
        } catch (error: any) {
            setErrorMessage(error["message"])
        }
    };
};
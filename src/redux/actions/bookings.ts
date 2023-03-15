import { getBookingsByUser, sendQuery } from "../../graphqlHelper";
import { FetchBookingsByUserAction } from "../actionTypes";
import { getBookingsByUserAction } from "../reducers/bookingsSlice";
import { setErrorMessage } from "../reducers/errorMessage";

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
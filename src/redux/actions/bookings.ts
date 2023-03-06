import { getBookingsByUser, sendQuery } from "../../graphqlHelper";
import { FetchBookingsByUserAction } from "../actionTypes";
import { getBookingsByUserAction } from "../reducers/bookingsSlice";

export const fetchBookingsByUser = () => {
    return async (dispatch: FetchBookingsByUserAction) => {
        try {
            const response = await sendQuery(getBookingsByUser());
            dispatch(getBookingsByUserAction(response?.data?.data?.getBookings));
        } catch (err) {
            // Should be stored in a redux state after Daniel's changes here https://github.com/onja-org/call-booking/pull/68
            console.log("getBookingUser err", err);
        }
    };
};
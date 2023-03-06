import { getRooms, sendQuery } from "../../graphqlHelper";
import { getRoomsAction } from "../reducers/roomsSlice";
import { GetBookingByUserAction } from "../actionTypes";

export const fetchRooms = () => {
  return async (dispatch: GetBookingByUserAction) => {
    try {
      const response = await sendQuery(getRooms());
      dispatch(getRoomsAction(response?.data?.data?.getRooms));
    } catch (err) {
        // Should be stored in a redux state after Daniel's changes here https://github.com/onja-org/call-booking/pull/68
      console.log("getRooms err", err);
    }
  };
};
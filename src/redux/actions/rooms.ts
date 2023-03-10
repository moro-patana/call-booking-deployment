import { getRooms, sendQuery } from "../../graphqlHelper";
import { getRoomsAction } from "../reducers/roomsSlice";
import { GetBookingByUserAction } from "../actionTypes";
import { ErrorMessage } from "../../utils/types";

export const fetchRooms = (setErrorMessage: (value: ErrorMessage) => void) => {
  return async (dispatch: GetBookingByUserAction) => {
    try {
      const response = await sendQuery(getRooms());
      dispatch(getRoomsAction(response?.data?.data?.getRooms));
    } catch (error) {
        setErrorMessage(error)
    }
  };
};
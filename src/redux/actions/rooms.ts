import { getRooms, sendQuery } from "../../graphqlHelper";
import { getRoomsAction } from "../reducers/roomsSlice";
import { GetBookingByUserAction } from "../actionTypes";

export const fetchRooms = (setErrorMessage: (value: string) => void) => {
  return async (dispatch: GetBookingByUserAction) => {
    try {
      const response = await sendQuery(getRooms());
      dispatch(getRoomsAction(response?.data?.data?.getRooms));
    } catch (error: any) {
        setErrorMessage(error["message"])
    }
  };
};
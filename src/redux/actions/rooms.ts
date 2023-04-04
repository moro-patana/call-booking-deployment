import { getRooms, sendQuery } from "../../graphqlHelper";
import { getAllRooms } from "../reducers/roomsSlice";
import { GetBookingByUserAction } from "../actionTypes";
import { setErrorMessage } from "../reducers/errorMessage";

export const fetchRooms = () => {
  return async (dispatch: GetBookingByUserAction) => {
    try {
      const response = await sendQuery(getRooms());
      const resData = response?.data?.data?.getRooms;
      dispatch(getAllRooms(resData));
    } catch (error) {
        dispatch(setErrorMessage(error));
    }
  };
};
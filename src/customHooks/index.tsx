import {
  eachDayOfInterval,
  eachHourOfInterval,
  endOfWeek,
  startOfWeek,
} from "date-fns";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { getBookingsByUser, getRooms, sendQuery } from "../graphqlHelper";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import {
  bookingsData,
  getBookingErrorMessage,
  getBookingsByUserAction,
} from "../redux/reducers/bookingsSlice";
import { roomsData, getRoomsAction, getRoomsErrorMessage } from "../redux/reducers/roomsSlice";

const useCustomHooks = () => {
  const dispatch = useAppDispatch();
  const rooms = useAppSelector(roomsData);
  const { currentUser } = useAppSelector((state) => state.users);
  const userBookings = useAppSelector(bookingsData);

  const selectedDate = new Date();
  const startDay = startOfWeek(selectedDate, { weekStartsOn: 1 });
  const endDay = endOfWeek(selectedDate, { weekStartsOn: 1 });
  const weekDays = eachDayOfInterval({ start: startDay, end: endDay });

  const startHour = new Date().setHours(selectedDate.getHours() - 2);
  const endHour = new Date().setHours(selectedDate.getHours() + 6);
  const availableHours = eachHourOfInterval({
    start: startHour,
    end: endHour,
  });

  const [cookies, setCookies] = useCookies(["auth-token"]);
  const [currentDay, setCurrentDay] = useState<any>(startDay);
  const [endingDay, setEndingDay] = useState<any>(endDay);
  const [week, setWeek] = useState(weekDays);

  const fetchRooms = async () => {
    try {
      const response = await sendQuery(getRooms());
      dispatch(getRoomsAction(response?.data?.data?.getRooms));
    } catch (error) {
      dispatch(getRoomsErrorMessage(error));
    }
  };

  const fetchBookingsByUser = async () => {
    try {
      const response = await sendQuery(getBookingsByUser());
      dispatch(getBookingsByUserAction(response?.data?.data?.getBookings));
    } catch (error) {
      dispatch(getBookingErrorMessage(error));
    }
  };

  // TODO: test if is working, when is time to implment this feature
  // const fetchAllUsers = async () => {
  //   const response = await sendQuery(getUsers());
  //   dispatch(fetchUsers(response?.data?.data?.users));
  // };

  useEffect(() => {
    currentUser &&
      currentUser.token &&
      setCookies("auth-token", currentUser.login.token);
    currentUser.isLogin && fetchRooms();
    currentUser.isLogin && fetchBookingsByUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  return {
    dispatch,
    selectedDate,
    userBookings,
    rooms,
    availableHours,
    cookies,
    currentDay,
    setCurrentDay,
    endingDay,
    setEndingDay,
    week,
    setWeek,
    currentUser,
    fetchBookingsByUser
  };
};

export default useCustomHooks;

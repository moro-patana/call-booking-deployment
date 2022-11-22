import { eachDayOfInterval, eachHourOfInterval, endOfWeek, startOfWeek } from "date-fns";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useSelector } from "react-redux";
import { getBookings, getRooms, getUsers, sendQuery } from "../graphqlHelper";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { bookingsData, setBookings } from "../redux/reducers/bookingsSlice";
import { roomsData, setRooms } from "../redux/reducers/roomsSlice";
import {
  fetchUserLogin,
  fetchUserRegister,
  selectUser,
  setUsers,
  status,
  userErrorLogin,
  usersData
} from "../redux/reducers/usersSlice";

const useCustomHooks = () => {
  const dispatch = useAppDispatch();
  const error = useSelector(userErrorLogin)
  const bookings = useAppSelector(bookingsData);
  const rooms = useAppSelector(roomsData);
  const users = useAppSelector(usersData);
  const user = useAppSelector(selectUser);
  const userStatus = useAppSelector(status);
  
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

  const [isRegistered, setIsRegistered] = useState(true);
  const [ isLoggedIn, setIsLoggedIn ] = useState(false);
  const [accountRegister, setAccountRegister] = useState({
    username: '',
    password: '',
    email: '',
  });
  const [ login, setLogin ] = useState({
    email: "",
    password: ""
  });

  const [ cookies, setCookies ] = useCookies(["auth-token"])
  const [ currentDay, setCurrentDay ] = useState<any>(startDay)
  const [ endingDay, setEndingDay ] = useState<any>(endDay)
  const [ week, setWeek ] = useState(weekDays)

  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAccountRegister({
      ...accountRegister,
      username: event.target.value,
    });
  };

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAccountRegister({
      ...accountRegister,
      email: event.target.value,
    });
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAccountRegister({
      ...accountRegister,
      password: event.target.value,
    });
  };

  const handleRegistrationSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event?.preventDefault();
    dispatch(
      fetchUserRegister({
        username: event.currentTarget.username.value,
        password: event.currentTarget.password.value,
        email: event.currentTarget.email.value,
      })
    );
    setTimeout(() => {
      setIsRegistered(true);
    }, 2000);
  };

  // Login
  const handleLoginSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    dispatch(
      fetchUserLogin({
        email: event.currentTarget.email.value,
        password: event.currentTarget.password.value,
      })
    )
    setIsLoggedIn(true);
  }

  const emailErrorMessage =
    error?.message?.toString()
      ? 'Email is not found.'
      : ''

  const passwordErrorMessage =
    error?.message?.toString()
      ? 'Password is incorrect. Try again!'
      : ''

  const errorMessages = {
    email: emailErrorMessage,
    password: passwordErrorMessage,
  }

  const fetchRooms = async () => {
    const response = await sendQuery(getRooms());
    dispatch(setRooms(response?.data?.data?.rooms));
  };

  const fetchBookings = async () => {
    const response = await sendQuery(getBookings());
    dispatch(setBookings(response?.data?.data?.bookings));
  };

  const fetchUsers = async () => {
    const response = await sendQuery(getUsers());
    dispatch(setUsers(response?.data?.data?.users));
  };

  useEffect(() => {
    fetchRooms();
    fetchBookings();
    fetchUsers();
    isLoggedIn && setCookies("auth-token", user.token)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return {
    dispatch,
    isRegistered,
    isLoggedIn,
    accountRegister,
    setIsLoggedIn,
    setIsRegistered,
    handleEmailChange,
    handlePasswordChange,
    handleUsernameChange,
    handleRegistrationSubmit,
    handleLoginSubmit,
    errorMessages,
    login,
    setLogin,
    selectedDate,
    bookings,
    rooms,
    users,
    user,
    userStatus,
    availableHours,
    cookies,
    currentDay,
    endingDay,
    setCurrentDay,
    setEndingDay,
    week,
    setWeek
  }
};

export default useCustomHooks;

import React, { useEffect, useState } from 'react';
import './App.css';
import { TableContainer, Table, TableBody, Box } from '@mui/material';
import Hours from './components/hours/index';
import DaysOfWeek from './components/daysOfWeek';
import { getBookings, getRooms, getUsers, sendQuery } from './graphqlHelper';
import { eachHourOfInterval } from 'date-fns';
import { bookingsData, setBookings } from './redux/reducers/bookingsSlice';
import {
  usersData,
  setUsers,
  status,
  selectUser,
} from './redux/reducers/usersSlice';
import { roomsData, setRooms } from './redux/reducers/roomsSlice';
import { useAppDispatch, useAppSelector } from './redux/hooks';
import { LoginPage, RegisterPage } from './pages';
import ExpendableMenu from './components/menu';
import { useCookies } from 'react-cookie';

function App() {
  const dispatch = useAppDispatch();
  const bookings = useAppSelector(bookingsData);
  const rooms = useAppSelector(roomsData);
  const users = useAppSelector(usersData);
  const user = useAppSelector(selectUser);
  const userStatus = useAppSelector(status);
  const selectedDate = new Date();
  const startHour = new Date().setHours(selectedDate.getHours() - 2);
  const endHour = new Date().setHours(selectedDate.getHours() + 6);
  const availableHours = eachHourOfInterval({
    start: startHour,
    end: endHour,
  });

  const [isRegistered, setIsRegistered] = useState(true);
  const [ isLoggedIn, setIsLoggedIn ] = useState(false);
  const [ cookies, setCookies, removeCookies ] = useCookies(["auth-token"])
  
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

  return (
    <div className='App'>
      {!isRegistered 
        ? <RegisterPage setIsRegistered={setIsRegistered} /> 
        : !cookies['auth-token']
          ? <LoginPage
              setIsRegistered={setIsRegistered}
              setIsLoggedIn={setIsLoggedIn}
              status={userStatus}
            />
          : <ExpendableMenu />
      }
      <TableContainer sx={{ paddingTop: '30px', zIndex: -1 }}>
        <Table>
          <TableBody>
            <Hours {...{ availableHours }} />
            <DaysOfWeek
              {...{ availableHours, selectedDate }}
              rooms={rooms}
              bookings={bookings}
              users={users}
            />
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default App;

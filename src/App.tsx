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
  fetchUserRegister,
  status,
} from './redux/reducers/usersSlice';
import { roomsData, setRooms } from './redux/reducers/roomsSlice';
import { useAppDispatch, useAppSelector } from './redux/hooks';
import Registration from './components/registration';
import AuthContainer from './components/authContainer';
import LoginPage from './pages/Login';

function App() {
  const dispatch = useAppDispatch();
  const bookings = useAppSelector(bookingsData);
  const rooms = useAppSelector(roomsData);
  const users = useAppSelector(usersData);
  const registrationStatus = useAppSelector(status);
  const selectedDate = new Date();
  const startHour = new Date().setHours(selectedDate.getHours() - 2);
  const endHour = new Date().setHours(selectedDate.getHours() + 6);
  const availableHours = eachHourOfInterval({
    start: startHour,
    end: endHour,
  });

  const [isRegistered, setIsRegistered] = useState<boolean>(true);
  const [accountRegister, setAccountRegister] = React.useState({
    username: '',
    password: '',
    email: '',
  });

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAccountRegister({
      ...accountRegister,
      username: e.target.value,
    });
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAccountRegister({
      ...accountRegister,
      email: e.target.value,
    });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAccountRegister({
      ...accountRegister,
      password: e.target.value,
    });
  };

  const handleRegistrationSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e?.preventDefault();
    dispatch(
      fetchUserRegister({
        username: e.currentTarget.username.value,
        password: e.currentTarget.password.value,
        email: e.currentTarget.email.value,
      })
    );
    setTimeout(() => {
      setIsRegistered(true);
    }, 2000);
  };

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className='App'>
      <LoginPage />
      {!isRegistered ? (
        <AuthContainer heading={'Register'}>
          <div>
            <Registration
              username={accountRegister.username}
              email={accountRegister.email}
              password={accountRegister.password}
              usernameChange={handleUsernameChange}
              emailChange={handleEmailChange}
              passwordChange={handlePasswordChange}
              onSubmit={handleRegistrationSubmit}
            />
            <Box sx={{ textAlign: 'center', marginTop: '24px' }}>
              Already have an account? Login here
            </Box>
          </div>
        </AuthContainer>
      ) : (
        <LoginPage />
      )}
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

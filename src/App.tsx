import React, { useEffect } from "react";
import "./App.css";
import { TableContainer, Table, TableBody } from "@mui/material";
import Hours from "./components/hours/index";
import DaysOfWeek from "./components/daysOfWeek";
import { getBookings, getRooms, getUsers, sendQuery } from "./graphqlHelper";
import { eachHourOfInterval } from "date-fns";
import { bookingsData, setBookings } from "./redux/reducers/bookingsSlice";
import { usersData, setUsers } from "./redux/reducers/usersSlice";
import { roomsData, setRooms } from "./redux/reducers/roomsSlice";
import { useAppDispatch, useAppSelector } from "./redux/hooks";

function App() {
  const dispatch = useAppDispatch();
  const bookings = useAppSelector(bookingsData);
  const rooms = useAppSelector(roomsData);
  const users = useAppSelector(usersData);
  const selectedDate = new Date();
  const startHour = new Date().setHours(selectedDate.getHours() - 2);
  const endHour = new Date().setHours(selectedDate.getHours() + 6);
  const availableHours = eachHourOfInterval({
    start: startHour,
    end: endHour,
  });

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
    <div className="App">
      <TableContainer sx={{ paddingTop: "30px" }}>
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

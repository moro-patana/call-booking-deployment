import React, { useEffect, useState } from "react";
import "./App.css";
import { RootState } from "./redux/store";
import { eachMinuteOfInterval } from "date-fns/esm";
import { TableContainer, Table, TableBody } from "@mui/material";
import Hours from "./components/hours/index";
import DaysOfWeek from "./components/daysOfWeek";
import { getBookings, getRooms, getUsers, sendQuery } from "./graphqlHelper";
import { eachHourOfInterval } from "date-fns";
import { setBookings } from "./redux/reducers/bookingsSlice";
import { setUsers } from "./redux/reducers/usersSlice";
import { useDispatch, useSelector } from "react-redux";
import { setRooms } from "./redux/reducers/roomsSlice";

function App() {
  const dispatch = useDispatch();
  const bookingsData = useSelector((state: RootState) => state?.bookings);
  const roomsData = useSelector((state: RootState) => state?.rooms);
  const users = useSelector((state: RootState) => state?.users);
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
  }, []);

  return (
    <div className="App">
      <TableContainer sx={{ paddingTop: "30px" }}>
        <Table>
          <TableBody>
            <Hours {...{ availableHours }} />
            <DaysOfWeek
              {...{ availableHours, selectedDate }}
              rooms={roomsData?.value}
              bookings={bookingsData?.value}
              users={users?.value}
            />
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default App;

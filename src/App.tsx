import React, { useEffect, useState } from "react";
import "./App.css";
import { TableContainer, Table, TableBody } from "@mui/material";
import Hours from "./components/hours/index";
import DaysOfWeek from "./components/daysOfWeek";
import { getRooms, sendQuery } from "./graphqlHelper";
import { eachHourOfInterval } from "date-fns";

function App() {
  const [rooms, setRooms] = useState([]);
  const selectedDate = new Date();
  const startHour = new Date().setHours(selectedDate.getHours() - 2);
  const endHour = new Date().setHours(selectedDate.getHours() + 6);
  const availableHours = eachHourOfInterval({
    start: startHour,
    end: endHour,
  });

  const fetchRooms = async () => {
    const response = await sendQuery(getRooms());
    setRooms(response?.data?.data?.rooms);
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  return (
    <div className="App">
      <TableContainer sx={{ paddingTop: "30px" }}>
        <Table>
          <TableBody>
            <Hours {...{ availableHours }} />
            <DaysOfWeek {...{ availableHours, selectedDate, rooms }} />
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default App;

import React, { ChangeEvent, ChangeEventHandler, useEffect, useState } from "react";
import "./App.css";
import { TableContainer, Table, TableBody } from "@mui/material";
import Hours from "./components/hours/index";
import DaysOfWeek from "./components/daysOfWeek";
import { getRooms, sendQuery } from "./graphqlHelper";
import { eachHourOfInterval } from "date-fns";
import Registration from './components/registration';

function App() {
  const [ username, setUsername ] = useState<string>("")
  const [ email, setEmail ] = useState<string>("")
  const [ password, setPassword ] = useState<string>("")

  const [rooms, setRooms] = useState([]);
  const selectedDate = new Date();
  const startHour = new Date().setHours(selectedDate.getHours() - 2);
  const endHour = new Date().setHours(selectedDate.getHours() + 6);
  const availableHours = eachHourOfInterval({
    start: startHour,
    end: endHour,
  });

  const handleUsername = (e: ChangeEvent) => {
    console.log(e.currentTarget.username);    
  }

  const handleEmail = (e: ChangeEvent) => {
    console.log(e);    
  }

  const handlePassword = (e: ChangeEvent) => {
    console.log(e);    
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    console.log(e);    
  }
  
  const fetchRooms = async () => {
    const response = await sendQuery(getRooms());
    setRooms(response?.data?.data?.rooms);
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  return (
    <div className='App'>
      <Registration
        username={username}
        email={email}
        password={password}
        usernameChange={handleUsername}
        emailChange={handleEmail}
        passwordChange={handlePassword}
        onSubmit={handleSubmit}
      />
      <TableContainer sx={{ paddingTop: '30px', zIndex: -1 }}>
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

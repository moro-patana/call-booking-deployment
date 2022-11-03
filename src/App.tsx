import React from "react";
import "./App.css";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import DaysOfWeek from "./components/daysOfWeek";

function App() {
  const selectedDate = new Date();
  return (
    <div className="App">
      <TableContainer>
        <Table>
          <TableBody>
            <DaysOfWeek {...{ selectedDate }} />
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default App;

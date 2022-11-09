import React from 'react';
import './App.css';
import { TableContainer, Table, TableBody } from '@mui/material';
import Hours from './components/hours/index';
import DaysOfWeek from './components/daysOfWeek';
import Registration from './components/registration';

function App() {
  const selectedDate = new Date();
  return (
    <div className='App'>
      <Registration />
      <TableContainer sx={{ paddingTop: '30px' }}>
        <Table>
          <TableBody>
            <Hours {...{ selectedDate }} />
            <DaysOfWeek {...{ selectedDate }} />
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default App;

import './App.css';
import { TableContainer, Table, TableBody } from '@mui/material';
import LoginComponent from './components/Login';
import RegisterComponent from './components/Register';
import DaysOfWeek from './components/daysOfWeek'
import Hours from './components/hours'
import ExpendableMenu from './components/menu'
import useCustomHooks from './customHooks';
import { useAppSelector } from "../src/redux/hooks";
import { Route, Routes } from 'react-router-dom';


function App() {
  const {
    selectedDate,
    userBookings,
    rooms,
    availableHours,
    cookies,
    currentDay,
    endingDay,
    setCurrentDay,
    setEndingDay,
    week,
    setWeek
  } = useCustomHooks();

  const { users } = useAppSelector(state => state.users);
  // refactor with react router and redux
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <LoginComponent
            status={'notLoading'} // TODO: Implement properly via Redux state
          />
        }
      />
      <Route
        path="/signup"
        element={<RegisterComponent />}
      />
      <Route
        path="/calendar"
        element={<div>Calendar</div>}
      />
      <Route
        path="/my-booking"
        element={
          <>
            <ExpendableMenu
              currentDay={currentDay}
              endingDay={endingDay}
              setCurrentDay={setCurrentDay}
              setEndingDay={setEndingDay}
              setWeek={setWeek}
            />  
  
  
            <TableContainer sx={{
              paddingTop: '30px',
              zIndex: -1,
              pointerEvents: `${!cookies['auth-token'] && "none"}`,
            }}>
              <Table>
                <TableBody>
                  <DaysOfWeek
                    {...{ availableHours, selectedDate }}
                    rooms={rooms}
                    bookings={userBookings}
                    users={users} //TODO: check users implementation
                    weekDays={week}
                  />
                  <Hours {...{ availableHours }} />
                </TableBody>
              </Table>
            </TableContainer>
          </>
        }
      />
    </Routes>
  );
}

export default App;

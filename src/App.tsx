import './App.css';
import { TableContainer, Table, TableBody } from '@mui/material';
import { LoginPage, RegisterPage } from './pages';
import { DaysOfWeek, ExpendableMenu, Hours } from './components';
import useCustomHooks from './customHooks';

function App() {
  const {
    isRegistered,
    setIsLoggedIn,
    setIsRegistered,
    selectedDate,
    bookings,
    rooms,
    users,
    userStatus,
    availableHours,
    cookies,
    currentDay,
    endingDay,
    setCurrentDay,
    setEndingDay,
    week,
    setWeek
  } = useCustomHooks();

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
          : <ExpendableMenu
              currentDay={currentDay}
              endingDay={endingDay}
              setCurrentDay={setCurrentDay}
              setEndingDay={setEndingDay}
              setWeek={setWeek}
              setIsLoggedIn={setIsLoggedIn}
            />
      }
      <TableContainer sx={{
        paddingTop: '30px',
        zIndex: -1,
        pointerEvents: `${!cookies['auth-token'] && "none"}`,
      }}>
        <Table>
          <TableBody>
            <Hours {...{ availableHours }} />
            <DaysOfWeek
              {...{ availableHours, selectedDate }}
              rooms={rooms}
              bookings={bookings}
              users={users}
              weekDays={week}
            />
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default App;

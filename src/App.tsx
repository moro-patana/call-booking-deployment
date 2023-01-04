import './App.css';
import { useState } from 'react';
import { TableContainer, Table, TableBody } from '@mui/material';
import LoginComponent from './components/Login';
import RegisterComponent from './components/Register';
import DaysOfWeek from './components/daysOfWeek'
import Hours from './components/hours'
import ExpendableMenu from './components/menu'
import useCustomHooks from './customHooks';
import { useAppSelector } from "../src/redux/hooks";


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

  const { users, currentUser } = useAppSelector(state => state.users);
  // refactor with react router and redux
  const [isSignupVisible, setIsSignupVisible] = useState(!currentUser.isRegister)
  return (
    <div className='App'>

      {isSignupVisible && 
        <RegisterComponent setIsSignupVisible={setIsSignupVisible} />
      }

      {!isSignupVisible && !currentUser.isLogin &&
        <LoginComponent
          setIsSignupVisible={setIsSignupVisible}
          status={'notLoading'} // TODO: Implement properly via Redux state
        />
      }

      {currentUser.isLogin && 
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
    </div>
  );
}

export default App;

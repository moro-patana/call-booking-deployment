import './App.css';
import { useMemo, useState } from 'react';
import { TableContainer, Table, TableBody } from '@mui/material';
import LoginComponent from './components/Login';
import RegisterComponent from './components/Register';
import DaysOfWeek from './components/daysOfWeek'
import Hours from './components/hours'
import ExpendableMenu from './components/menu'
import useCustomHooks from './customHooks';
import { useAppSelector } from "../src/redux/hooks";
import { Calendar, dateFnsLocalizer, Views } from 'react-big-calendar'
import { format, parse, startOfWeek, getDay } from 'date-fns'
import moment from "moment";
import locale, { enUS, af } from 'date-fns/locale'
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import BookingModal from "./components/bookingModal"
import { dateStringConverter } from './utils/dateUtils';

const DnDCalendar = withDragAndDrop(Calendar)

const locales = {
  'en-US': enUS,
}

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
})

function App() {
  const {
    rooms,
    selectedDate,
    userBookings,
    availableHours,
    cookies,
    currentDay,
    endingDay,
    setCurrentDay,
    setEndingDay,
    week,
    setWeek
  } = useCustomHooks();

  const resources = rooms.map((room:any) =>  {
    return {
      id: room?.id,
      title: room?.name,
      description: room?.description,
    }
  })
  const { users, currentUser } = useAppSelector(state => state.users);
  // refactor with react router and redux
  const [isSignupVisible, setIsSignupVisible] = useState(!currentUser.isRegister)

  const [bookings, setBookings] = useState([])
  
  const events = userBookings.map((booking:any) => {
    return {
      ...booking,
      startDate: dateStringConverter(booking?.startDate),
      endDate: dateStringConverter(booking?.endDate)
    }
  })
  
  const [ openBookingModal, setOpenBookingModal ] = useState(false)
  const [slot, setSlot] = useState<any>(null)
  const [ selectedRoom, setSelectedRoom ] = useState(slot && slot?.resourceId)
  const [ position, setPosition ] = useState({x: 0, y: 0})
  const [ startDate, setStartDate ] = useState(new Date())
  const [ endDate, setEndDate ] = useState(new Date())

  const handleSelectEvent = (slot: any) => {
    setSlot(slot)
    const { box, start, end, resourceId } = slot;
    const screenWidth = window.screen.width;
    const xPercentage = Math.floor((box.x / screenWidth) * 100);
    setPosition({
      x: xPercentage,
      y: box.y,
    })
    setSelectedRoom(resourceId)
    setOpenBookingModal(!openBookingModal)
    setStartDate(start)
    setEndDate(end);
  }

  const { defaultDate, scrollToTime } = useMemo(
    () => ({
      defaultDate: new Date(),
      scrollToTime: new Date(),
    }),
    []
  )

  return (
    <div>
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
          <Calendar
            localizer={localizer}
            events={events}
            defaultDate={defaultDate}
            defaultView={Views.DAY}
            style={{ height: "100vh" }}
            selectable
            onSelectSlot={(e) => handleSelectEvent(e)}
            resources={resources}
            resourceIdAccessor="id"
            scrollToTime={scrollToTime}
            views={[Views.WEEK, Views.DAY]}
          />

          {openBookingModal && (
            <BookingModal
              rooms={rooms}
              repeatData={[{name: "Daily", id: "1"}]}
              open={openBookingModal}
              handleClose={() => setOpenBookingModal(false)}
              position={position}
              day={new Date()}
              date={new Date()}
              startDate={startDate}
              endDate={endDate}
              selectedRoom={selectedRoom}
              setSelectedRoom={setSelectedRoom}
              setBooking={setBookings}
            />
          )}
      </>
      }
    </div>
  );
}

export default App;

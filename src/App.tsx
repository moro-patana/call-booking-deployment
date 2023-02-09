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

const rooms = [
  {
    id: "63e254a436688e001edcc754",
    name: "West house",
    title: "West house",
    description: "A meeting room"
  },
  {
    id: "63e254af36688e001edcc756",
    name: "Middle house",
    title: "Middle house",
    description: "A meeting room"
  },
  {
    id: "63e486917c8ab40030e0df78",
    name: "Est house",
    title: "Est house",
    description: "A meeting room"
  },
  {
    id: "63e486857c8ab40030e0df76",
    name: "Callbooth 4",
    title: "Callbooth 4",
    description: "A meeting room"
  },
  {
    id: "63e486807c8ab40030e0df74",
    name: "Callbooth 3",
    title: "Callbooth 3",
    description: "A meeting room"
  },
  {
    id: "63e4867b7c8ab40030e0df72",
    name: "Callbooth 2",
    title: "Callbooth 2",
    description: "A meeting room"
  },
  {
    id: "63e254bb36688e001edcc758",
    name: "Callbooth 1",
    title: "Callbooth 1",
    description: "A meeting room"
  }
]

function App() {
  const {
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

  const { users, currentUser } = useAppSelector(state => state.users);
  // refactor with react router and redux
  const [isSignupVisible, setIsSignupVisible] = useState(!currentUser.isRegister)

  const [events, setEvents] = useState([
    {
      start: new Date(),
      end: new Date(),
      title: "Some title",
      desc: "Default event",
      id: 1
    },
  ])
  const [ openBookingModal, setOpenBookingModal ] = useState(false)
  const [ selectedRoom, setSelectedRoom ] = useState("Middle house")
  const [ position, setPosition ] = useState({x: 0, y: 0})
  const [ startDate, setStartDate ] = useState(new Date())
  const [ endDate, setEndDate ] = useState(new Date())

  const handleSelectEvent = (slot: any) => {
    const { box, start, end } = slot;
    const screenWidth = window.screen.width;
    const xPercentage = Math.floor((box.x / screenWidth) * 100);
    setPosition({
      x: xPercentage,
      y: box.y,
    })
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

  console.log('events::::::', events);

  return (
    <div>
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
        resources={rooms}
        // showAllEvents
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
          setBooking={setEvents}
        />
      )}
    </div>
  );
}

export default App;

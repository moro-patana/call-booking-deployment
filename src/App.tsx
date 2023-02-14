import './App.css';
import { useMemo, useState } from 'react';
import LoginComponent from './components/Login';
import RegisterComponent from './components/Register';
import ExpendableMenu from './components/menu'
import useCustomHooks from './customHooks';
import { useAppSelector } from "../src/redux/hooks";
import { Calendar, dateFnsLocalizer, Views } from 'react-big-calendar'
import { format, parse, startOfWeek, getDay } from 'date-fns'
import { enUS } from 'date-fns/locale'
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import BookingModal from "./components/bookingModal"
import { dateStringConverter } from './utils/dateUtils';
import { Route, Routes } from 'react-router-dom';

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
    userBookings,
    currentDay,
    endingDay,
    setCurrentDay,
    setEndingDay,
    setWeek
  } = useCustomHooks();

  const { users } = useAppSelector(state => state.users);

  const resources = rooms.map((room:any) =>  {
    return {
      id: room?.id,
      title: room?.name,
      description: room?.description,
    }
  })

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
      />
    </Routes>)
}

export default App;

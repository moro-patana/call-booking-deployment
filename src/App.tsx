import './App.css';
import { useCallback, useMemo, useState } from 'react';
import LoginComponent from './components/Login';
import RegisterComponent from './components/Register';
import ExpendableMenu from './components/menu'
import useCustomHooks from './customHooks';
import { Calendar, dateFnsLocalizer, Views } from 'react-big-calendar'
import { format, parse, startOfWeek, getDay } from 'date-fns'
import { enUS } from 'date-fns/locale'
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import BookingModal from "./components/bookingModal"
import { dateStringConverter } from './utils/dateUtils';
import { Route, Routes } from 'react-router-dom';
import { string } from 'prop-types';

interface IEvent {
  id: number | string;
  title: string;
  start: Date | string;
  end: Date | string;
  resourceId: string;
}
interface IResource {
  id: string | number;
  title: string;
  description: string;
}

const DragAndDropCalendar = withDragAndDrop<IEvent, IResource>(Calendar);

const locales = {
  "en-US": enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
})

const calendarStyle = () => {
	return {
	  style: {
		  backgroundColor: '#fff',
		}
	}
}

function App() {
  const {
    rooms,
    currentDay,
    endingDay,
    setCurrentDay,
    setEndingDay,
    setWeek
  } = useCustomHooks();

  const resources = rooms.map((room: {
    id: string | number;
    name: string;
    description: string;
  }) => {
    return {
      id: room?.id,
      title: room?.name,
      description: room?.description,
    }
  })

  const [bookings, setBookings] = useState([]);

  const events = bookings.map((booking: any) => {
    if (typeof booking.startDate === "string" && typeof booking.endDate === "string"){
      return {
        ...booking,
        start: dateStringConverter(booking?.startDate),
        end: dateStringConverter(booking?.endDate),
      };
    }
    return booking
  });

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
  );

  const moveEvent = useCallback(
    ({ event, start, end, resourceId }: any) => {
      setBookings((prev): any => {
        const existing = prev.find((ev: any) => ev.id === event.id) ?? {};
        const filtered = prev.filter((ev: any) => ev.id !== event.id);
        return [...filtered, { ...existing, start, end, resourceId }];
      });
    },
    [setBookings]
  );

  const resizeEvent = useCallback(
    ({
      event,
      start,
      end,
    }: {
      event: IEvent;
      start: Date | string;
      end: Date | string;
    }) => {
      setBookings((prev): any => {
        const existing = prev.find((ev: any) => ev.id === event.id) ?? {};
        const filtered = prev.filter((ev: any) => ev.id !== event.id);
        return [...filtered, { ...existing, start, end }];
      });
    },
    [setBookings]
  );

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
      <Route path="/signup" element={<RegisterComponent />} />
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

            <DragAndDropCalendar
              localizer={localizer}
              events={events}
              defaultDate={defaultDate}
              defaultView={Views.DAY}
              style={{ height: "100vh" }}
              selectable
              onSelectSlot={(e) => handleSelectEvent(e)}
              resources={resources}
              resourceIdAccessor="id"
              resourceTitleAccessor="title"
              onEventDrop={moveEvent}
              onEventResize={resizeEvent}
              resizable
              scrollToTime={scrollToTime}
              views={[Views.WEEK, Views.DAY]}
              dayPropGetter={calendarStyle}
              step={15}
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

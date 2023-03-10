import { useCallback, useEffect, useMemo, useState } from "react";
import { Box } from "@mui/material";
import { Calendar, dateFnsLocalizer, Views } from 'react-big-calendar';
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import { format, getDay, parse, startOfWeek } from 'date-fns';
import { enUS } from 'date-fns/locale';

import BookingModal from "../components/bookingModal/BookingModal";
import ExpendableMenu from "../components/menu/ExpendableMenu";

import { fetchBookingsByUser } from "../redux/actions/bookings";
import { fetchRooms } from "../redux/actions/rooms";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { bookingsData } from "../redux/reducers/bookingsSlice";
import { roomsData } from "../redux/reducers/roomsSlice";

import { dateStringConverter, getCurrentDay, getEndingDay } from "../utils/dateUtils";
import { Booking, IEvent, IResource, RoomType } from "../utils/types";

const DragAndDropCalendar = withDragAndDrop<IEvent, IResource>(Calendar);

const locales = { "en-US": enUS };

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const calendarStyle = () => {
  return {
    style: {
      backgroundColor: '#fff',
    }
  };
};

const MyBooking = ({errorMessage, setErrorMessage}:{errorMessage: string; setErrorMessage: (value: string) => void}) => {
    const rooms = useAppSelector(roomsData);
    const userBookings = useAppSelector(bookingsData);
    const { currentUser } = useAppSelector(state => state.users);
    const dispatch = useAppDispatch();

  const selectedDate = new Date();
  const startDay = getCurrentDay(selectedDate);
  const endDay = getEndingDay(selectedDate);

  const [bookings, setBookings] = useState([]);
  const [openBookingModal, setOpenBookingModal] = useState(false);
  const [slot, setSlot] = useState<{ resourceId: string } | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<string>(slot?.resourceId || '');
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [startDate, setStartDate] = useState(selectedDate);
  const [endDate, setEndDate] = useState(selectedDate);
  const [currentDay, setCurrentDay] = useState<Date>(startDay);
  const [endingDay, setEndingDay] = useState<Date>(endDay);

  const resources = rooms?.map((room: RoomType) => {
    return {
      id: room?.id,
      title: room?.name,
      description: room?.description,
    };
  });

  const events = userBookings?.map((booking: Booking) => {
    return {
      ...booking,
      start: dateStringConverter(booking?.start),
      end: dateStringConverter(booking?.end),
    };
  });

  useEffect(() => {
    if (currentUser?.login) {
      dispatch(fetchRooms(setErrorMessage));
      dispatch(fetchBookingsByUser(setErrorMessage));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

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
    return bookings;
  }

  const { defaultDate, scrollToTime } = useMemo(() => ({ defaultDate: new Date(), scrollToTime: new Date() }), []);

  const moveEvent = useCallback(({ event, start, end, resourceId }: any) => {
    setBookings((prev): any => {
      const existing = prev.find((ev: any) => ev.id === event.id) ?? {};
      const filtered = prev.filter((ev: any) => ev.id !== event.id);
      return [...filtered, { ...existing, start, end, resourceId }];
    });
  }, [setBookings]);

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
    <Box>
      <ExpendableMenu
        currentDay={currentDay}
        endingDay={endingDay}
        setCurrentDay={setCurrentDay}
        setEndingDay={setEndingDay}
        setWeek={() => null} // Still needs to be implemented
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
          repeatData={[{ name: "Daily", id: "1" }]}
          open={openBookingModal}
          handleClose={() => setOpenBookingModal(false)}
          position={position}
          day={new Date()}
          date={new Date()}
          startDate={startDate}
          endDate={endDate}
          selectedRoom={selectedRoom}
          setSelectedRoom={setSelectedRoom}
          errorMessage={errorMessage}
          setErrorMessage={setErrorMessage}
        />
      )}
    </Box>
  );
}

export default MyBooking;
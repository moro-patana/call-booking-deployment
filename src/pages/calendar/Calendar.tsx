import { useCallback, useEffect, useMemo, useState } from "react";
import { Box } from "@mui/material";
import { Calendar, dateFnsLocalizer, Views } from "react-big-calendar";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import { format, getDay, parse, startOfWeek } from "date-fns";
import { useCookies } from "react-cookie";
import { enUS } from 'date-fns/locale';
import { fetchBookingsByUser } from "../../redux/actions/bookings";
import { fetchRooms } from "../../redux/actions/rooms";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { bookingsData } from "../../redux/reducers/bookingsSlice";
import { roomsData } from "../../redux/reducers/roomsSlice";
import { dateStringConverter, getCurrentDay, getEndingDay } from "../../utils/dateUtils";
import { Booking, IEvent, IResource, RoomType } from "../../utils/types";

import EditBookingModal from "../../components/modals/editBookingModal/EditBookingModal";
import BookingModal from "../../components/modals/bookingModal/BookingModal";
import ExpendableMenu from "../../components/menu/ExpendableMenu";
import styles from './calendar.module.css';

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
      backgroundColor: "#fff",
    },
  };
};

const CalendarPage = () => {
  const rooms = useAppSelector(roomsData);
  const userBookings = useAppSelector(bookingsData);
  const [cookies] = useCookies(["currentUser"]);
  const { currentUser } = cookies;
  const dispatch = useAppDispatch();
  const selectedDate = new Date();
  const startDay = getCurrentDay(selectedDate);
  const endDay = getEndingDay(selectedDate);

  const [bookings, setBookings] = useState([]);
  const [openBookingModal, setOpenBookingModal] = useState(false);
  const [slot, setSlot] = useState<{ resourceId: string } | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<string>(slot?.resourceId || "");
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [startDate, setStartDate] = useState(selectedDate);
  const [endDate, setEndDate] = useState(selectedDate);
  const [currentDay, setCurrentDay] = useState<Date>(startDay);
  const [endingDay, setEndingDay] = useState<Date>(endDay);

  // Edit modal states
  const [showEditBookingModal, setShowEditBookingModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<IEvent>({
    id: "",
    title: "",
    start: new Date(),
    end: new Date(),
    resourceId: "",
  });
  const { container } = styles;

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
      dispatch(fetchRooms());
      dispatch(fetchBookingsByUser(currentUser.login.id));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  const handleSelectEvent = (slot: any) => {
    setSlot(slot);
    const { box, start, end, resourceId } = slot;
    const screenWidth = window.screen.width;
    const xPercentage = Math.floor((box.x / screenWidth) * 100);
    setPosition({
      x: xPercentage,
      y: box.y,
    });
    setSelectedRoom(resourceId);
    setOpenBookingModal(!openBookingModal);
    setStartDate(start);
    setEndDate(end);
    return bookings;
  };

  const { defaultDate, scrollToTime } = useMemo(
    () => ({ defaultDate: new Date(), scrollToTime: new Date() }),
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

  const openEditModal = (booking: IEvent, event: any) => {
    const { start, end, resourceId, title, id } = booking;

    const screenWidth = window.screen.width;
    const x = Math.floor((event.pageX / screenWidth) * 100);
    const y = event.pageY;

    setSelectedBooking({
      ...selectedBooking,
      id,
      title,
      start,
      end,
      resourceId,
    });

    setShowEditBookingModal(true);
    setPosition({ x, y });
  };

  return (
    <Box className={container}>
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
        onSelectEvent={openEditModal}
      />

      {showEditBookingModal && (
        <EditBookingModal
          showEditBookingModal={showEditBookingModal}
          setShowEditBookingModal={setShowEditBookingModal}
          position={position}
          selectedBooking={selectedBooking}
          setSelectedBooking={setSelectedBooking}
          repeatData={[{ name: "Daily", id: "1" }]}
        />
      )}

      {openBookingModal && (
        <BookingModal
          rooms={rooms}
          repeatData={[{ name: "Daily", id: "1" }]}
          openBookingModal={openBookingModal}
          closeBookingModal={() => setOpenBookingModal(false)}
          position={position}
          day={new Date()}
          date={new Date()}
          startDate={startDate}
          endDate={endDate}
          selectedRoom={selectedRoom}
          setSelectedRoom={setSelectedRoom}
        />
      )}
    </Box>
  );
};

export default CalendarPage;

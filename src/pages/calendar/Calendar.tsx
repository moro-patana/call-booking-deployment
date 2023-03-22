import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box } from "@mui/material";
import { Calendar, dateFnsLocalizer, Views } from "react-big-calendar";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import { format, getDay, isBefore, parse, startOfWeek } from "date-fns";
import { useCookies } from "react-cookie";
import { enUS } from "date-fns/locale";
import { fetchAllBookings, updateSelectedBooking } from "../../redux/actions/bookings";
import { fetchRooms } from "../../redux/actions/rooms";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { roomsData } from "../../redux/reducers/roomsSlice";
import { setBookings } from "../../redux/reducers/bookingsSlice";
import { dateStringConverter, getCurrentDay, getEndingDay, isTimeOverlapping } from "../../utils/dateUtils";
import { Booking, IEvent, IResource, NewBookingType, RoomType, UserType } from "../../utils/types";

import { LOGIN } from "../../constants/path";

import EditBookingModal from "../../components/modals/editBookingModal/EditBookingModal";
import BookingModal from "../../components/modals/bookingModal/BookingModal";
import ExpendableMenu from "../../components/menu/ExpendableMenu";
import styles from "./calendar.module.css";
import { getUserById, sendQuery } from "../../graphqlHelper";
import CustomToolbar from "../../components/customToolBar/CustomToolBar";

const { container } = styles;

const DragAndDropCalendar = withDragAndDrop<IEvent, IResource>(Calendar);

interface ComponentsProps {
  components: any;
  defaultDate: Date;
  scrollToTime: Date;
}

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
  const { allBookings } = useAppSelector((state) => state.bookings);
  const [cookies] = useCookies(["currentUser"]);
  const { currentUser } = cookies;
  const access_token = currentUser?.login?.access_token;
  const userId = currentUser?.login?.id;
  const isUserBooking = (event: IEvent) => event.participants.includes(userId);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const selectedDate = new Date();
  const startDay = getCurrentDay(selectedDate);
  const endDay = getEndingDay(selectedDate);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [currentDay, setCurrentDay] = useState<Date>(startDay);
  const [endingDay, setEndingDay] = useState<Date>(endDay);
  const [currentBookingParticipant, setCurrentBookingParticipant] = useState<UserType | null>(null);

  // Add new booking modal states
  const [openBookingModal, setOpenBookingModal] = useState(false);
  const [newBooking, setNewBooking] = useState<NewBookingType>({
    id: "",
    title: "",
    start: selectedDate,
    end: selectedDate,
    resourceId: "",
    participants: [],
  });

  // Edit modal states
  const [showEditBookingModal, setShowEditBookingModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<IEvent>({
    id: "",
    title: "",
    start: new Date(),
    end: new Date(),
    resourceId: "",
    participants: [],
  });

  const resources = rooms?.map((room: RoomType) => {
    return {
      id: room?.id,
      title: room?.name,
      description: room?.description,
    };
  });

  const events = useMemo(() => allBookings?.map((booking: Booking) => {
    return {
      ...booking,
      start: dateStringConverter(booking?.start),
      end: dateStringConverter(booking?.end),
    };
  }),
    [allBookings]
  );

  useEffect(() => {
    if (currentUser?.login) {
      dispatch(fetchRooms());
      dispatch(fetchAllBookings());
    }
  }, [currentUser, dispatch, userId]);

  useEffect(() => {
    if (!currentUser?.login) navigate(LOGIN);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser, navigate]);

  const handleSelectEvent = (slot: any) => {
    const { box, start, end, resourceId } = slot;
    const screenWidth = window.screen.width;
    const xPercentage = Math.floor((box.x / screenWidth) * 100);

    setPosition({
      x: xPercentage,
      y: box.y,
    });
    setNewBooking({ ...newBooking, resourceId, start, end });
    setOpenBookingModal(!openBookingModal);
  };

  const updateBooking = useCallback(
    (
      id: string | number,
      resourceId: string,
      start: Date | string,
      end: Date | string,
      title: string
    ) => {
      const updatedBookings = allBookings.map((booking: Booking) => {
        if (booking?.id === id) {
          return {
            ...booking,
            resourceId,
            title,
            start: String(start),
            end: String(end),
          };
        }
        return booking;
      });
      dispatch(setBookings(updatedBookings));
    },
    [allBookings, dispatch]
  );

  const moveEvent = useCallback(
    async (selectedEvent: any) => {
      const { event, start, end, resourceId } = selectedEvent;

      const { id, title } = event;

      const isPastBooking = isBefore(start, new Date()) && isBefore(end, new Date());

      const bookings = events.filter((booking: IEvent) => booking.id !== event.id);

      const isBookingOverlapping = isTimeOverlapping(selectedEvent, start, end, bookings);

      if (!isBookingOverlapping && !isPastBooking) {
        dispatch(
          updateSelectedBooking(
            id,
            resourceId,
            title,
            start,
            end,
            userId,
            access_token
          )
        );
        updateBooking(id, resourceId, start, end, title);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [access_token, userId, events]
  );

  const resizeEvent = useCallback(
    async ({ event, start, end }: { event: IEvent; start: any; end: any }) => {
      const { id, title, resourceId } = event;

      const bookings = events.filter((booking: IEvent) => booking.id !== event.id);

      const isPastBooking = isBefore(start, new Date()) && isBefore(end, new Date());

      const isBookingOverlapping = isTimeOverlapping(event, start, end, bookings);

      if (!isBookingOverlapping && !isPastBooking) {
        dispatch(
          updateSelectedBooking(
            id,
            resourceId,
            title,
            start,
            end,
            userId,
            access_token
          )
        );
        updateBooking(id, resourceId, start, end, title);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [access_token, userId, events]
  );

  const getCurrentBookingParticipant = async (participants: string[]) => {
    const user = await sendQuery(getUserById(participants[0]));
    setCurrentBookingParticipant(user.data.data.getUserById);
  };

  const openEditModal = (booking: IEvent, event: any) => {
    const { participants } = booking;
    const screenWidth = window.screen.width;
    const x = Math.floor((event.pageX / screenWidth) * 100);
    const y = event.pageY;

    setSelectedBooking(booking);

    if (participants[0] !== currentUser?.login?.id) {
      getCurrentBookingParticipant(participants);
    };
    setShowEditBookingModal(true);
    setPosition({ x, y });
  };

  const eventStyleGetter = (event: IEvent) => {
    const isMyEvent = event.participants.includes(currentUser?.login?.id);
    const backgroundColor = isMyEvent ? "#fcb900" : "#56b3d8";
    const style = {
      backgroundColor: backgroundColor,
      borderRadius: "0px",
      border: "1px solid #fff",
      display: "block",
    };
    return { style };
  };

  const { components, defaultDate, scrollToTime }: ComponentsProps = useMemo(
    () => ({
      components: {
        toolbar: CustomToolbar,
      },
      defaultDate: new Date(),
      scrollToTime: new Date()
    }), [])

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
        toolbar={true}
        style={{ height: "100vh", display: 'block', padding: '1rem', paddingInline: 27 }}
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
        onSelectEvent={(event, booking) => {
          openEditModal(event, booking)
        }}
        eventPropGetter={eventStyleGetter}
        draggableAccessor={(event) => isUserBooking(event)}
        components={components}
      />
      {showEditBookingModal && (
        <EditBookingModal
          showEditBookingModal
          setShowEditBookingModal={setShowEditBookingModal}
          position={position}
          selectedBooking={selectedBooking}
          setSelectedBooking={setSelectedBooking}
          events={events}
          bookingOwner={currentBookingParticipant}
        />
      )}

      {openBookingModal && (
        <BookingModal
          openBookingModal
          closeBookingModal={() => setOpenBookingModal(false)}
          position={position}
          newBooking={newBooking}
          setNewBooking={setNewBooking}
          events={events}
        />
      )}
    </Box>
  );
};

export default CalendarPage;
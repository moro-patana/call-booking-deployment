import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box } from "@mui/material";
import { format, getDay, isBefore, parse, startOfWeek } from "date-fns";
import { enUS } from "date-fns/locale";
import { Calendar, dateFnsLocalizer, Views } from "react-big-calendar";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import { useCookies } from "react-cookie";

import { LOGIN } from "../../constants/paths";
import { getUserById, sendQuery } from "../../graphqlHelper";
import {
  fetchAllBookings,
  updateSelectedBooking,
} from "../../redux/actions/bookings";
import { fetchRooms } from "../../redux/actions/rooms";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { setBookings } from "../../redux/reducers/bookingsSlice";
import { roomsData } from "../../redux/reducers/roomsSlice";
import {
  dateStringConverter,
  getCurrentDay,
  getEndingDay,
  isTimeOverlapping,
} from "../../utils/dateUtils";
import {
  Booking,
  IEvent,
  IResource,
  RoomType,
  UserBookingType,
} from "../../utils/types";

import BookingDetails from "../../components/bookingDetails/BookingDetails";
import CustomToolbar from "../../components/customToolBar/CustomToolBar";
import ExpendableMenu from "../../components/menu/ExpendableMenu";
import BookingModal from "../../components/modals/bookingModal/BookingModal";
import EditBookingModal from "../../components/modals/editBookingModal/EditBookingModal";

import styles from "./calendar.module.css";
import Spinner from "../../components/UIs/spinner/Spinner";

const { container } = styles;

const DragAndDropCalendar = withDragAndDrop<IEvent, IResource>(Calendar);

interface ComponentsProps {
  components: any;
  defaultDate: Date;
  scrollToTime: Date;
}

interface EventWrapper {
  event: IEvent;
  children: JSX.Element;
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

const selectedEventInitialValue = {
  id: "",
  title: "",
  start: new Date(),
  end: new Date(),
  resourceId: "",
  participants: [],
};

const selectedSlotInitialValue = {
  start: new Date(),
  end: new Date(),
  resourceId: "",
};

const CalendarPage = () => {
  const userRef: any = useRef({ bookingUsers: [] });
  const { bookingUsers } = userRef.current;
  const rooms = useAppSelector(roomsData);
  const { allBookings } = useAppSelector((state) => state.bookings);
  const { isLoading } = useAppSelector((state) => state.bookings);
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
  const [currentBookingParticipant, setCurrentBookingParticipant] =
    useState<UserBookingType | null>(null);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [hoveredEvent, setHoveredEvent] = useState<IEvent | null>(null);
  const [selectedSlot, setSelectedSlot] = useState(selectedSlotInitialValue);
  const [selectedEvent, setSelectedEvent] = useState<IEvent>(
    selectedEventInitialValue
  );
  const [openBookingModal, setOpenBookingModal] = useState(false);
  const [openEditBookingModal, setOpenEditBookingModal] = useState(false);
  const resources = rooms?.map((room: RoomType) => {
    return {
      id: room?.id,
      title: room?.name,
      description: room?.description,
    };
  });

  const events = useMemo(
    () =>
      allBookings?.map((booking: Booking) => {
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
    // eslint-disable-next-line
  }, [currentUser, navigate]);

  const handleSelectEvent = (slot: any) => {
    const { box, start, end, resourceId } = slot;
    const screenWidth = window.screen.width;
    const xPercentage = Math.floor((box.x / screenWidth) * 100);

    setPosition({
      x: xPercentage,
      y: box.y,
    });
    setSelectedSlot({ resourceId, start, end });
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

      const isPastBooking =
        isBefore(start, new Date()) && isBefore(end, new Date());

      const bookings = events.filter(
        (booking: IEvent) => booking.id !== event.id
      );

      const isBookingOverlapping = isTimeOverlapping(
        selectedEvent,
        start,
        end,
        bookings
      );

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
    // eslint-disable-next-line
    [access_token, userId, events]
  );

  const resizeEvent = useCallback(
    async ({ event, start, end }: { event: IEvent; start: any; end: any }) => {
      const { id, title, resourceId } = event;

      const bookings = events.filter(
        (booking: IEvent) => booking.id !== event.id
      );

      const isPastBooking =
        isBefore(start, new Date()) && isBefore(end, new Date());

      const isBookingOverlapping = isTimeOverlapping(
        event,
        start,
        end,
        bookings
      );

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
    // eslint-disable-next-line
    [access_token, userId, events]
  );

  const getCurrentBookingParticipant = async (participants: string[]) => {
    const bookingOwnersIds = bookingUsers.map(
      (user: UserBookingType) => user.id
    );

    if (!bookingOwnersIds.includes(participants[0])) {
      const user = await sendQuery(getUserById(participants[0]));
      bookingUsers.push(user.data.data.getUserById);
    }

    const bookingOwner = bookingUsers.find(
      (user: UserBookingType) => user.id === participants[0]
    );
    setCurrentBookingParticipant(bookingOwner);
  };

  const openEditModal = (booking: IEvent, event: any) => {
    const { participants } = booking;
    const screenWidth = window.screen.width;
    const x = Math.floor((event.pageX / screenWidth) * 100);
    const y = event.pageY;

    setSelectedEvent(booking);
    setIsHovered(false);
    setPosition({ x, y });

    if (participants[0] !== currentUser?.login?.id) {
      setOpenEditBookingModal(false);
    } else {
      setOpenEditBookingModal(true);
    }
  };

  const eventStyleGetter = useCallback((event: IEvent) => {
    const isMyEvent = event.participants.includes(currentUser?.login?.id);
    const backgroundColor = isMyEvent ? "#fcb900" : "#56b3d8";
    const style = {
      backgroundColor: backgroundColor,
      borderRadius: "0px",
      border: "1px solid #fff",
      display: "block",
    };
    return { style };
    // eslint-disable-next-line
  }, []);

  const handleOnMouseHover = (booking: IEvent, event: any) => {
    getCurrentBookingParticipant(booking?.participants);

    setIsHovered(true);
    setHoveredEvent(booking);

    setPosition({
      x: event.pageX,
      y: event.pageY,
    });
  };

  const handleOnMouseOut = () => {
    setIsHovered(false);
    setHoveredEvent(null);
  };

  const { components, defaultDate, scrollToTime }: ComponentsProps = useMemo(
    () => ({
      components: {
        toolbar: CustomToolbar,
        eventWrapper: ({ event, children }: EventWrapper) => {
          return (
            <Box
              onMouseOver={(e) => handleOnMouseHover(event, e)}
              onMouseOut={() => handleOnMouseOut()}
            >
              {children}
            </Box>
          );
        },
      },
      defaultDate: new Date(),
      scrollToTime: new Date(),
      // eslint-disable-next-line
    }),
    []
  );

  return (
    <>
      {!isLoading ? (
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
            style={{ height: "90vh", padding: "1rem" }}
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
              openEditModal(event, booking);
            }}
            eventPropGetter={eventStyleGetter}
            draggableAccessor={(event) => isUserBooking(event)}
            tooltipAccessor={() => ""}
            components={components}
          />
          {openEditBookingModal && (
            <EditBookingModal
              openEditBookingModal
              setOpenEditBookingModal={setOpenEditBookingModal}
              position={position}
              selectedEvent={selectedEvent}
              events={events}
            />
          )}

          {openBookingModal && (
            <BookingModal
              openBookingModal
              closeBookingModal={() => setOpenBookingModal(false)}
              position={position}
              selectedSlot={selectedSlot}
              events={events}
            />
          )}

          {isHovered && hoveredEvent && (
            <BookingDetails
              event={hoveredEvent}
              position={position}
              rooms={rooms}
              bookingOwner={currentBookingParticipant}
            />
          )}
        </Box>
      ) : (
        <Spinner />
      )}
    </>
  );
};

export default CalendarPage;

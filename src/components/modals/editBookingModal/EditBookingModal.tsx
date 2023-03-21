import { FC, useState } from "react";
import { Box, Button, Modal, SelectChangeEvent, TextField, Typography } from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { format, isBefore } from "date-fns";

import { roomsData } from "../../../redux/reducers/roomsSlice";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { updateSelectedBooking } from "../../../redux/actions/bookings";
import { setErrorMessage } from "../../../redux/reducers/errorMessage";
import { setBookings } from "../../../redux/reducers/bookingsSlice";
import { isTimeOverlapping, isValidTime, newDateGenerator, timeConverter } from "../../../utils/dateUtils";
import { Booking, IEvent, newBookingType, RoomType, UserType } from "../../../utils/types";
import { deleteBooking, sendAuthorizedQuery } from "../../../graphqlHelper";

import SelectInput from "../../UIs/Select/SelectInput";
import DatePicker from "../../UIs/datePicker/DatePicker";

import styles from "./editBookingModal.module.css";

interface EditModalProps {
  position: { x: number; y: number };
  showEditBookingModal: boolean;
  selectedBooking: IEvent;
  setShowEditBookingModal: (value: boolean) => void;
  setSelectedBooking: (value: IEvent) => void;
  events: IEvent[];
  handleSelectDate: (
    value: any,
    booking: newBookingType | IEvent,
    setBooking: (value: IEvent) => void,
    startTime: string,
    endTime: string
  ) => void;
  bookingOwner: UserType | null;
}

const { 
  modal, box, typography, backdrop, datePickerWrapper, buttonWrapper,
  textField, buttonContainer, deleteButton, spanError, cancelButtonWrapper
} = styles;

const EditBookingModal: FC<EditModalProps> = ({
  position,
  showEditBookingModal,
  selectedBooking,
  setShowEditBookingModal,
  setSelectedBooking,
  handleSelectDate,
  events,
  bookingOwner
}) => {
  const boxPosition = {
    left: position.x > 70 ? "70%" : `${position.x}%`,
    top: position.y > 518 ? 518 : position.y > 18 ? position.y : 18,
  };

  const { title, start, end, resourceId, id, participants } = selectedBooking;
  const dispatch = useAppDispatch();

  const { allBookings } = useAppSelector((state) => state.bookings);
  const { currentUser } = useAppSelector((state) => state.users);
  const userId = currentUser.login.id;
  const { access_token } = currentUser.login;

  const rooms: RoomType[] = useAppSelector(roomsData);

  const savedBooking = events.find((event: IEvent) => event.id === id);
  const bookings = events.filter((booking: IEvent) => booking.id !== id);

  const [isDeletionConfirmed, setIsDeletionConfirmed] = useState(false);

  // Date and Time utilities and States
  const getHours = (time: Date) => timeConverter(time.getHours());
  const getMinutes = (time: Date) => timeConverter(time.getMinutes());

  const [startTime, setStartTime] = useState(`${getHours(start)}:${getMinutes(start)}`);
  const [endTime, setEndTime] = useState(`${getHours(end)}:${getMinutes(end)}`);

  const newStartDate = newDateGenerator(start, startTime);
  const newEndDate = newDateGenerator(end, endTime);

  const isTimeEdited =
    JSON.stringify(newStartDate) !== JSON.stringify(savedBooking?.start) ||
    JSON.stringify(newEndDate) !== JSON.stringify(savedBooking?.end);

  const isBookingOverlapping = isTimeOverlapping(
    selectedBooking,
    newStartDate,
    newEndDate,
    bookings
  );

  const isPastBooking =
    isBefore(newDateGenerator(start, startTime), new Date()) &&
    isBefore(newDateGenerator(end, endTime), new Date());

  const isBookingEdited =
    (resourceId === savedBooking?.resourceId && title === savedBooking?.title && !isTimeEdited) ||
    !isValidTime(newStartDate, newEndDate);

  const handleEditBooking = () => {
    dispatch(
      updateSelectedBooking(
        id,
        resourceId,
        title,
        String(newStartDate),
        String(newEndDate),
        userId,
        access_token
      )
    );

    const updatedBookings = allBookings.map((booking: Booking) => {
      if (booking?.id === id) {
        return {
          ...booking,
          resourceId,
          title,
          start: String(newStartDate),
          end: String(newEndDate),
        };
      }
      return booking;
    });

    dispatch(setBookings(updatedBookings));
    setShowEditBookingModal(false);
  };

  const onDeleteEvent = async () => {
    try {
      if (id) {
        const response = await sendAuthorizedQuery(deleteBooking(id), access_token);
        setShowEditBookingModal(false);
        const bookings = allBookings.filter((booking: Booking) => booking.id !== id);
        dispatch(setBookings(bookings));
        return response.data.data;
      }
    } catch (error) {
      dispatch(setErrorMessage(error));
    }
  };

  const isMyBooking = participants?.includes(currentUser?.login?.id);

  const renderBookingDetails = () => {
    const roomName = rooms.find((room) => room?.id === resourceId)?.name;

    return (
      <Box className={box} sx={boxPosition}>
        <Typography variant="h3" className={typography}>
          Booking details
        </Typography>
        <Typography variant="body2">Booking by {bookingOwner?.username}</Typography>
        <Typography variant="body2">Date: {format(start, "dd/MM/yyyy")} {`from ${startTime} to ${endTime}`} </Typography>
        <Typography variant="body2">Room: {roomName}</Typography>
        <Typography variant="body2">Reason: {title ? title : 'Not precised'}</Typography>
        <Box className={cancelButtonWrapper}>
          <Button onClick={() => setShowEditBookingModal(false)}>
            Close
          </Button>
        </Box>
      </Box>
    );
  };

  return (
    <div>
      <Modal
        open={showEditBookingModal}
        onClose={() => setShowEditBookingModal(false)}
        className={modal}
        slotProps={{ backdrop: { className: backdrop } }}
      >
        {isMyBooking ? (
          <Box className={box} sx={boxPosition}>
            <Typography variant="h3" className={typography}>
              {isMyBooking ? "Edit booking" : "Booking details"}
            </Typography>
            <TextField
              label="label"
              className={textField}
              defaultValue={title}
              onChange={(event) =>
                setSelectedBooking({
                  ...selectedBooking,
                  title: event.target.value,
                })
              }
              InputLabelProps={{
                shrink: true,
              }}
              size="small"
            />
            <Box>
              <Box className={datePickerWrapper}>
                <AccessTimeIcon />
                <DatePicker
                  value={start}
                  handleChange={(value) =>
                    handleSelectDate(
                      value,
                      selectedBooking,
                      setSelectedBooking,
                      startTime,
                      endTime
                    )
                  }
                  startTime={startTime}
                  endTime={endTime}
                  startTimeOnChange={(event) => setStartTime(event.target.value)}
                  endTimeOnChange={(event) => setEndTime(event.target.value)}
                />
              </Box>
                <Box className={buttonContainer}>
                  {isPastBooking && !isBookingEdited && (
                    <Typography className={spanError} variant="body2">
                      Booking for a past time slot is not allowed.
                    </Typography>
                  )}
                  {isBookingOverlapping && (
                    <Typography className={spanError} variant="body2">
                      Someone has booked this room for the time you selected.
                    </Typography>
                  )}
              </Box>
            </Box>
            <SelectInput
              handleChange={(event: SelectChangeEvent<any>) => {
                setSelectedBooking({
                  ...selectedBooking,
                  resourceId: event.target.value,
                });
              }}
              data={rooms}
              defaultValue={resourceId}
              value={resourceId}
              note=""
            />
            <Box className={buttonContainer}>
              <Button
                className={deleteButton}
                onClick={() => {
                  isDeletionConfirmed ? onDeleteEvent() : setIsDeletionConfirmed(true)
                }}
              >
                {!isDeletionConfirmed ? "Delete" : "Confirm deletion"}
              </Button>
              <Box className={buttonWrapper}>
                <Button onClick={() => setShowEditBookingModal(false)}>
                  Cancel
                </Button>
                <Button
                  disabled={
                    !isMyBooking || isPastBooking || isBookingEdited || isBookingOverlapping
                  }
                  variant="contained"
                  onClick={handleEditBooking}
                >
                  Save
                </Button>
              </Box>
            </Box>
          </Box>
        ) :
          renderBookingDetails()
        }
      </Modal>
    </div>
  );
};

export default EditBookingModal;

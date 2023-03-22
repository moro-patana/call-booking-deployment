import React, { FC, useState } from "react";
import {
  Box,
  Button,
  Modal,
  SelectChangeEvent,
  TextField,
  Typography,
} from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { isBefore } from "date-fns";

import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { setBookings } from "../../../redux/reducers/bookingsSlice";
import { setErrorMessage } from "../../../redux/reducers/errorMessage";
import { IEvent, NewBookingType } from "../../../utils/types";
import {
  getValidTime,
  isTimeOverlapping,
  newDateGenerator,
  timeConverter,
} from "../../../utils/dateUtils";
import { getAvailableRooms, getAvailableRoomsNote, handleSelectDate } from "../../../utils/modalUtils";
import { bookingMutation, sendAuthorizedQuery } from "../../../graphqlHelper";

import SelectInput from "../../UIs/Select/SelectInput";
import DatePicker from "../../UIs/datePicker/DatePicker";

import styles from "./bookingModal.module.css";
import { roomsData } from "../../../redux/reducers/roomsSlice";

interface BookingModalProps {
  openBookingModal: boolean;
  closeBookingModal: () => void;
  position: { x: number; y: number };
  newBooking: NewBookingType;
  setNewBooking: (value: NewBookingType) => void;
  events: IEvent[];
}

const {
  modal, box, typography, backdrop, datePickerWrapper,
  buttonWrapper, textField, spanError,
} = styles;


const BookingModal: FC<BookingModalProps> = ({
  events,
  position,
  newBooking,
  openBookingModal,
  setNewBooking,
  closeBookingModal,
}) => {
  const dispatch = useAppDispatch();
  const rooms = useAppSelector(roomsData);
  const { currentUser } = useAppSelector((state) => state.users);
  const { allBookings } = useAppSelector((state) => state.bookings);
  const { resourceId, start, end, title } = newBooking;
  const startDate = new Date(start);
  const endDate = new Date(end);
  const [startTime, setStartTime] = useState(`${timeConverter(start.getHours())}:${timeConverter(start.getMinutes())}`);
  const [endTime, setEndTime] = useState(`${timeConverter(end.getHours())}:${timeConverter(end.getMinutes())}`);
  const newStartDate = newDateGenerator(startDate, startTime);
  const newEndDate = newDateGenerator(endDate, endTime);

  const boxPosition = {
    left: position.x > 70 ? "70%" : `${position.x}%`,
    top: position.y > 518 ? 518 : position.y > 18 ? position.y : 18,
  };

  const availableRooms = getAvailableRooms({ events, selectedRoom: resourceId, start, newStartDate, newEndDate, rooms });

  const availableRoomsNote = getAvailableRoomsNote(availableRooms?.length);

  const isValidTime = getValidTime(newStartDate, newEndDate);

  const isBookingOverlapping = isTimeOverlapping(
    newBooking,
    newStartDate,
    newEndDate,
    events
  );

  const isPastBooking =
    isBefore(newDateGenerator(start, startTime), new Date()) &&
    isBefore(newDateGenerator(end, endTime), new Date());

  const handleStartTimeEvent = (event: React.ChangeEvent<HTMLInputElement>) => {
    setStartTime(event.target.value);
  };

  const handleEndTimeEvent = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEndTime(event.target.value);
  };

  const handleSubmitBooking = async () => {
    const { id, access_token } = currentUser.login;
    if (!isBookingOverlapping) {
      try {
        if (access_token && resourceId) {
          const response = await sendAuthorizedQuery(
            bookingMutation(
              resourceId,
              title,
              String(newStartDate),
              String(newEndDate),
              id
            ),
            access_token
          );
          closeBookingModal();
          dispatch(
            setBookings([
              ...allBookings,
              {
                ...newBooking,
                start: String(newStartDate),
                end: String(newEndDate),
                participants: [id],
              },
            ])
          );
          return response.data.data;
        }
      } catch (error) {
        dispatch(setErrorMessage(error));
      }
    }
  };

  return (
    <div>
      <Modal
        open={openBookingModal}
        onClose={closeBookingModal}
        className={modal}
        slotProps={{ backdrop: { className: backdrop } }}
      >
        <Box className={box} sx={boxPosition}>
          <Typography
            variant="h3"
            className={typography}
            id={styles.typography}
          >
            Book a room
          </Typography>
          <TextField
            label="Title"
            className={textField}
            onChange={(event) =>
              setNewBooking({ ...newBooking, title: event.target.value })
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
                    {
                      value,
                      booking: newBooking,
                      setBooking: setNewBooking,
                      startTime,
                      endTime
                    }
                  )
                }
                startTime={startTime}
                endTime={endTime}
                startTimeOnChange={handleStartTimeEvent}
                endTimeOnChange={handleEndTimeEvent}
              />
            </Box>
            {isPastBooking && (
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

          {availableRooms.length > 0 &&
            <SelectInput
              handleChange={(event: SelectChangeEvent<any>) => {
                setNewBooking({ ...newBooking, resourceId: event.target.value });
              }}
              data={availableRooms}
              defaultValue={resourceId}
              value={resourceId}
              note={availableRoomsNote}
            />
          }

          {availableRooms.length === 0 && (
            <Typography className={spanError} variant="body2">
              There is no available room for the selected time or the selected time is invalid.
            </Typography>
          )}
          <Box className={buttonWrapper}>
            <Button onClick={closeBookingModal}>Cancel</Button>
            <Button
              disabled={isPastBooking || isBookingOverlapping || !isValidTime}
              variant="contained"
              onClick={handleSubmitBooking}
            >
              Book
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
};

export default BookingModal;

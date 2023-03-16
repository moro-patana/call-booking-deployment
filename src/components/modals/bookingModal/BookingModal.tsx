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
import { areIntervalsOverlapping, isBefore } from "date-fns";

import { fetchBookingsByUser } from "../../../redux/actions/bookings";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { setErrorMessage } from "../../../redux/reducers/errorMessage";
import { IEvent, newBookingType, RoomType } from "../../../utils/types";
import {
  isValidTime,
  newDateGenerator,
  timeConverter,
} from "../../../utils/dateUtils";
import { bookingMutation, sendAuthorizedQuery } from "../../../graphqlHelper";

import SelectInput from "../../UIs/Select/SelectInput";
import DatePicker from "../../UIs/datePicker/DatePicker";

import styles from "./bookingModal.module.css";
import { setBookings } from "../../../redux/reducers/bookingsSlice";

interface BookingModalProps {
  rooms: RoomType[];
  repeatData: { name: string; id: string }[];
  openBookingModal: boolean;
  closeBookingModal: () => void;
  position: { x: number; y: number };
  newBooking: newBookingType;
  setNewBooking: (value: newBookingType) => void;
  events: IEvent[];
  handleSelectDate: (
    value: any,
    booking: IEvent | newBookingType,
    setBooking: (value: newBookingType) => void,
    startTime: string,
    endTime: string
  ) => void;
}

const BookingModal: FC<BookingModalProps> = ({
  rooms,
  repeatData,
  openBookingModal,
  closeBookingModal,
  position,
  newBooking,
  setNewBooking,
  handleSelectDate,
  events,
}) => {
  const dispatch = useAppDispatch();
  const { currentUser } = useAppSelector((state) => state.users);
  const { resourceId, start, end, title } = newBooking;
  const startDate = new Date(start);
  const endDate = new Date(end);
  const { allBookings } = useAppSelector((state) => state.bookings);
  const [startTime, setStartTime] = useState(
    `${timeConverter(start.getHours())}:${timeConverter(start.getMinutes())}`
  );
  const [endTime, setEndTime] = useState(
    `${timeConverter(end.getHours())}:${timeConverter(end.getMinutes())}`
  );
  const newStartDate = newDateGenerator(startDate, startTime);
  const newEndDate = newDateGenerator(endDate, endTime);

  const {
    modal,
    box,
    typography,
    backdrop,
    datePickerWrapper,
    buttonWrapper,
    textField,
    spanError,
  } = styles;

  const boxPosition = {
    left: position.x > 70 ? "70%" : `${position.x}%`,
    top: position.y > 518 ? 518 : position.y > 18 ? position.y : 18,
  };

  const handleStartTimeEvent = (event: React.ChangeEvent<HTMLInputElement>) => {
    setStartTime(event.target.value);
  };

  const handleEndTimeEvent = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEndTime(event.target.value);
  };

  const isBookingOverlapping = () => {
    const bookingOnTheSelectedDay = events.filter((booking: IEvent) => {
      const startDate = booking.start;
      return (
        booking.resourceId === resourceId &&
        startDate.getDate() === start.getDate() &&
        startDate.getMonth() === start.getMonth() &&
        startDate.getFullYear() === start.getFullYear()
      );
    });

    if (isValidTime(newStartDate, newEndDate)) {
      const bookingOnTheSameHour = bookingOnTheSelectedDay.filter(
        (booking: IEvent) =>
          areIntervalsOverlapping(
            { start: newStartDate, end: newEndDate },
            { start: booking.start, end: booking.end }
          )
      );
      return bookingOnTheSameHour.length > 0;
    }
  };

  const handleSubmitBooking = async () => {
    const { id, access_token } = currentUser.login;
    if (!isBookingOverlapping()) {
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
          dispatch(fetchBookingsByUser(id));
          closeBookingModal();
          dispatch(setBookings([...allBookings, newBooking]));
          return response.data.data;
        }
      } catch (error) {
        dispatch(setErrorMessage(error));
      }
    }
  };

  const isPastBooking =
    isBefore(newDateGenerator(start, startTime), new Date()) &&
    isBefore(newDateGenerator(end, endTime), new Date());

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
            label="label"
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
                    value,
                    newBooking,
                    setNewBooking,
                    startTime,
                    endTime
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
            {isBookingOverlapping() && (
              <Typography className={spanError} variant="body2">
                This chosen time is overlapping with another booking time.
              </Typography>
            )}
          </Box>

          <SelectInput
            handleChange={(event: SelectChangeEvent<any>) => {
              setNewBooking({ ...newBooking, resourceId: event.target.value });
            }}
            data={rooms}
            defaultValue={resourceId}
            value={resourceId}
            note="There are available rooms"
          />
          <SelectInput
            handleChange={(event: SelectChangeEvent<any>) => event.target.value}
            data={repeatData}
            value={repeatData[0].id}
            note="Select repeat options"
          />
          <Box className={buttonWrapper}>
            <Button onClick={closeBookingModal}>Cancel</Button>
            <Button
              disabled={isPastBooking || isBookingOverlapping()}
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

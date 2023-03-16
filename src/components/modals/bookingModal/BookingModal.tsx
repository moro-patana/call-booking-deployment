import React, { FC, useCallback, useState } from "react";
import { Box, Button, Modal, SelectChangeEvent, TextField, Typography } from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { isBefore } from "date-fns";

import { fetchBookingsByUser } from "../../../redux/actions/bookings";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { setErrorMessage } from "../../../redux/reducers/errorMessage";
import { RoomType } from "../../../utils/types";
import { getSelectedTimeMinutes, newDateGenerator, timeConverter } from "../../../utils/dateUtils";
import { bookingMutation, sendAuthorizedQuery } from '../../../graphqlHelper';

import SelectInput from "../../UIs/Select/SelectInput";
import DatePicker from "../../UIs/datePicker/DatePicker";

import styles from './bookingModal.module.css';

interface BookingModalProps {
    rooms: RoomType[];
    repeatData: { name: string; id: string }[];
    openBookingModal: boolean;
    closeBookingModal: () => void;
    position: { x: number; y: number };
    day: Date;
    date: Date;
    startDate: Date;
    endDate: Date;
    selectedRoom: string;
    setSelectedRoom: (value: string) => void;
}

const BookingModal: FC<BookingModalProps> = ({
    rooms,
    repeatData,
    openBookingModal,
    closeBookingModal,
    position,
    date,
    startDate,
    endDate,
    selectedRoom,
    setSelectedRoom
}) => {
  const { currentUser } = useAppSelector(state => state.users);
  const dispatch = useAppDispatch();
  
  const start = new Date(startDate);
  const end = new Date(endDate);
  const selectedHour = timeConverter(start?.getHours());
  const [label, setLabel] = useState("");
  const [roomId, setRoomId] = useState(selectedRoom);
  const [repeatEvent, setRepeatEvent] = useState(repeatData[0].id);
  const [startTime, setStartTime] = useState(
    `${selectedHour}:${getSelectedTimeMinutes(date, 0)}`
  );
  const [endTime, setEndTime] = useState(
    `${selectedHour}:${getSelectedTimeMinutes(date, date?.getMinutes() + 15)}`
  );
  const { modal, box, typography, backdrop, datePickerWrapper, buttonWrapper, textField, spanError } = styles;

  const boxPosition = {
    left: position.x > 70 ? "70%" : `${position.x}%`,
    top: position.y > 518 ? 518 : position.y > 18 ? position.y : 18,
  };

  const handleSubmitBooking = useCallback(async () => {
    const newStartDate = String(newDateGenerator(start, startTime));
    const newEndDate = String(newDateGenerator(end, endTime));
    const { id, access_token } = currentUser.login;

    try {
      if (access_token && roomId) {
        const response = await sendAuthorizedQuery(
          bookingMutation(roomId, label, newStartDate, newEndDate, id),
          access_token
        );
        dispatch(fetchBookingsByUser(id));
        closeBookingModal();
        return response.data.data;
      }
    } catch (error) {
      dispatch(setErrorMessage(error));
    }
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [label, roomId, startTime, endTime]);

  const isPastBooking = isBefore(newDateGenerator(start, startTime), new Date()) && isBefore(newDateGenerator(end, endTime), new Date());

  return (
    <div>
      <Modal
        open={openBookingModal}
        onClose={closeBookingModal}
        className={modal}
        slotProps={{backdrop: { className: backdrop }}}
      >
        <Box
          className={box}
          sx={boxPosition}
        >
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
            onChange={(event) => setLabel(event.target.value)}
            InputLabelProps={{ shrink: true }}
            size='small'
          />
          <Box>
            <Box className={datePickerWrapper}>
              <AccessTimeIcon />
              <DatePicker
                value={startDate}
                handleChange={(event) => event}
                startTime={startTime}
                endTime={endTime}
                startTimeOnChange={(event) => setStartTime(event.target.value)}  
                endTimeOnChange={(event) => setEndTime(event.target.value)}  
              />
            </Box>
            {isPastBooking && <Typography className={spanError} variant="body2">Booking for a past time slot is not allowed.</Typography>}
          </Box>
          <SelectInput
            handleChange={(event: SelectChangeEvent<any>) => {
              setSelectedRoom(event.target.value)
              setRoomId(event.target.value)
            }}
            data={rooms}
            defaultValue={selectedRoom}
            value={roomId}
            note="There are available rooms"
          />
          <SelectInput
            handleChange={(event: SelectChangeEvent<any>) => setRepeatEvent(event.target.value)}
            data={repeatData}
            value={repeatEvent}
            note="Select repeat options"
          />
          <Box className={buttonWrapper}>
            <Button onClick={closeBookingModal}>Cancel</Button>
            <Button disabled={isPastBooking} variant="contained" onClick={handleSubmitBooking}>Book</Button>
          </Box>
        </Box>
      </Modal>
    </div>
  )
};

export default BookingModal;

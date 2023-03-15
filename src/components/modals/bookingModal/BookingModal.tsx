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
import { fetchBookingsByUser } from "../../../redux/actions/bookings";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { setErrorMessage } from "../../../redux/reducers/errorMessage";
import { newBookingType, RoomType } from "../../../utils/types";
import {
  getSelectedTimeMinutes,
  newDateGenerator,
  timeConverter,
} from "../../../utils/dateUtils";
import { bookingMutation, sendAuthorizedQuery } from "../../../graphqlHelper";

import SelectInput from "../../UIs/Select/SelectInput";
import DatePicker from "../../UIs/datePicker/DatePicker";

import styles from "./bookingModal.module.css";

interface BookingModalProps {
  rooms: RoomType[];
  repeatData: { name: string; id: string }[];
  openBookingModal: boolean;
  closeBookingModal: () => void;
  position: { x: number; y: number };
  newBooking: newBookingType;
  setNewBooking: (value: newBookingType) => void;
}

const BookingModal: FC<BookingModalProps> = ({
  rooms,
  repeatData,
  openBookingModal,
  closeBookingModal,
  position,
  newBooking,
  setNewBooking,
}) => {
  const dispatch = useAppDispatch();
  const { currentUser } = useAppSelector((state) => state.users);
  const { resourceId, start, end, title } = newBooking;
  const currentTime = new Date();
  const startDate = new Date(start);
  const endDate = new Date(end);
  const selectedHour = timeConverter(startDate?.getHours());
  const [startTime, setStartTime] = useState(
    `${selectedHour}:${getSelectedTimeMinutes(currentTime, 0)}`
  );
  const [endTime, setEndTime] = useState(
    `${selectedHour}:${getSelectedTimeMinutes(
      currentTime,
      currentTime?.getMinutes() + 15
    )}`
  );

  const {
    modal,
    box,
    typography,
    backdrop,
    datePickerWrapper,
    buttonWrapper,
    textField,
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

  const handleChange = (value: Date | null) => value;

  const handleRepeatEventChange = (event: SelectChangeEvent<any>) => {
    return event.target.value;
  };

  const handleSubmitBooking = async () => {
    const newStartDate = String(newDateGenerator(startDate, startTime));
    const newEndDate = String(newDateGenerator(endDate, endTime));
    const { id, access_token } = currentUser.login;

    try {
      if (access_token && resourceId) {
        const response = await sendAuthorizedQuery(
          bookingMutation(resourceId, title, newStartDate, newEndDate, id),
          access_token
        );
        dispatch(fetchBookingsByUser(id));
        closeBookingModal();
        return response.data.data;
      }
    } catch (error) {
      dispatch(setErrorMessage(error));
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
          <Box className={datePickerWrapper}>
            <AccessTimeIcon />
            <DatePicker
              value={start}
              handleChange={handleChange}
              startTime={startTime}
              endTime={endTime}
              startTimeOnChange={handleStartTimeEvent}
              endTimeOnChange={handleEndTimeEvent}
            />
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
            handleChange={handleRepeatEventChange}
            data={repeatData}
            value={repeatData[0].id}
            note="Select repeat options"
          />
          <Box className={buttonWrapper}>
            <Button onClick={closeBookingModal}>Cancel</Button>
            <Button onClick={handleSubmitBooking}>Book</Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
};

export default BookingModal;

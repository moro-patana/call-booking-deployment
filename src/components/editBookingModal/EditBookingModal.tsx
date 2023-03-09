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
import { roomsData } from "../../redux/reducers/roomsSlice";
import { useAppSelector } from "../../redux/hooks";
import { timeConverter } from "../../utils/dateUtils";
import { IEvent } from "../../utils/types";
import { deleteBooking, sendAuthorizedQuery } from "../../graphqlHelper";

import styles from "./editBookingModal.module.css";
import SelectInput from "../Select/SelectInput";
import DatePicker from "../datePicker/DatePicker";

interface EditModalProps {
  position: { x: number; y: number };
  isEditModalOpened: boolean;
  selectedBooking: IEvent;
  repeatData: { name: string; id: string }[];
  setIsEditModalOpened: (value: boolean) => void;
  setSelectedBooking: (value: IEvent) => void;
}

const EditBookingModal: FC<EditModalProps> = ({
  position,
  isEditModalOpened,
  selectedBooking,
  repeatData,
  setIsEditModalOpened,
  setSelectedBooking,
}) => {
  const {
    modal,
    box,
    typography,
    backdrop,
    datePickerWrapper,
    buttonWrapper,
    textField,
    buttonContainer,
    deleteButton,
  } = styles;
  const { currentUser } = useAppSelector((state) => state.users);
  const rooms = useAppSelector(roomsData);
  const { title, start, end, resourceId } = selectedBooking;
  const getHours = (time: Date) => timeConverter(time.getHours());
  const getMinutes = (time: Date) => timeConverter(time.getMinutes());
  const [startTime, setStartTime] = useState(
    `${getHours(start)}:${getMinutes(start)}`
  );
  const [endTime, setEndTime] = useState(`${getHours(end)}:${getMinutes(end)}`);

  const boxPosition = {
    left: position.x > 70 ? "70%" : `${position.x}%`,
    top: position.y > 518 ? 518 : position.y > 18 ? position.y : 18,
  };

  const handleEditBooking = () => selectedBooking;

  const onDeleteEvent = async () => {
    try {
      if (selectedBooking.id) {
        const response = await sendAuthorizedQuery(
          deleteBooking(selectedBooking.id),
          currentUser.login.token
        );
        const { data } = response.data;
        setIsEditModalOpened(false);
        // dispatch(fetchBookingsByUser());
        return data;
      }
    } catch (error: any) {
      console.error(error["message"]);
    }
  };

  return (
    <div>
      <Modal
        open={isEditModalOpened}
        onClose={() => setIsEditModalOpened(false)}
        className={modal}
        slotProps={{ backdrop: { className: backdrop } }}
      >
        <Box className={box} sx={boxPosition}>
          <Typography variant="h3" className={typography}>
            Edit booking
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
          />

          <Box className={datePickerWrapper}>
            <AccessTimeIcon />
            <DatePicker
              value={start}
              handleChange={(value) => value}
              startTime={startTime}
              endTime={endTime}
              startTimeOnChange={(event) => setStartTime(event.target.value)}
              endTimeOnChange={(event) => setEndTime(event.target.value)}
            />
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
            note="There are available rooms"
          />

          <SelectInput
            handleChange={(event) => event}
            data={repeatData}
            value={repeatData[0].id}
            note="Select repeat options"
          />

          <Box className={buttonContainer}>
            <Button className={deleteButton} onClick={onDeleteEvent}>
              Delete
            </Button>
            <Box className={buttonWrapper}>
              <Button onClick={() => setIsEditModalOpened(false)}>
                Cancel
              </Button>
              <Button onClick={handleEditBooking}>Save</Button>
            </Box>
          </Box>
        </Box>
      </Modal>
    </div>
  );
};

export default EditBookingModal;

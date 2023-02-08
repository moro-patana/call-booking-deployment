import React, { useState } from "react";
import { Box, Button, Modal, TextField, Typography } from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import styled from "styled-components";
import SelectInput from "../Select";
import DatePicker from "../datePicker";
import { RoomType } from "../../utils/types";
import { getSelectedTimeMinutes, newDateGenerator, timeConverter } from "../../utils/dateUtils";
import { previousDay } from "date-fns";

interface propTypes {
  rooms: RoomType[];
  repeatData: { name: string; id: string }[];
  open: boolean;
  handleClose: any;
  position: { x: number; y: number };
  day: Date;
  date: Date;
  startDate: Date;
  endDate: Date;
  selectedRoom: string;
  setSelectedRoom: (value: string) => void;
  setBooking?: any
}

const BookingModal = ({
  rooms,
  repeatData,
  open,
  handleClose,
  position,
  day,
  date,
  startDate,
  endDate,
  selectedRoom,
  setSelectedRoom,
  setBooking
}: propTypes) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const selectedHour = timeConverter(start?.getHours());
  const [value, setValue] = useState(day);
  const [label, setLabel] = useState("");
  const [ roomId, setRoomId ] = useState(rooms[0].id)
  const [repeatEvent, setRepeatEvent] = useState(repeatData[0].id)
  const [ startTime, setStartTime] = useState(
    `${selectedHour}:${getSelectedTimeMinutes(date, 0)}`
  );
  const [ endTime, setEndTime] = useState(
    `${selectedHour}:${getSelectedTimeMinutes(date, date?.getMinutes() + 15)}`
  );

  const handleStartTimeEvnt = (event: any) => {
    setStartTime(event.target.value)
  }

  const handleEndTimeEvnt = (event: any) => {
    setEndTime(event.target.value);
  }

  const handleChange = (value: Date) => {
    setValue(value)
  }

  const handleRepeatEventChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRepeatEvent(event.target.value)
  };

  const handleClickonBooking = () => {
    const newStartDate = newDateGenerator(start, startTime)
    const newEndDate = newDateGenerator(end, endTime)

    // const newBooking = {
    //   roomId: `${roomId}`,
    //   label: `${label}`,
    //   startDate: `${newStartDate}`,
    //   endDate: `${newEndDate}`
    // }
    const newBooking = {
      title: `${label}`,
      start: newStartDate,
      end: newEndDate
    }
    
    setBooking((prev: any) => [...prev, newBooking])
    handleClose();
  }

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        sx={{
          display: "flex",
          flexDirection: "column",
          "& > .MuiBackdrop-root": {
            backgroundColor: "transparent",
            cursor: "pointer",
          },
        }}
      >
        <Box
          sx={{
            width: "100%",
            maxWidth: "364px",
            backgroundColor: "#fff",
            padding: "19px 24px",
            margin: "auto",
            outline: 0,
            boxShadow: "0px 0px 6px #c8c8c8",
            display: "flex",
            flexDirection: "column",
            position: "absolute",
            left: position.x > 70 ? "70%" : `${position.x}%`,
            top: position.y > 518 ? 518 : position.y > 18 ? position.y : 18,
          }}
        >
          <Typography
            variant="h3"
            sx={{ fontSize: "14px", marginBottom: "18px" }}
          >
            Book a room
          </Typography>

          <TextField
            label="label"
            sx={{ marginBottom: "16px" }}
            onChange={(event) => setLabel(event.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <DatePickerWrapper
            style={{
              marginBottom: "14px",
              display: "flex",
              alignItems: "center",
            }}
          >
            <AccessTimeIcon />
            <DatePicker
              value={startDate}
              handleChange={handleChange}
              date={date}
              startTime={startTime}
              endTime={endTime}
              startTimeOnChange={handleStartTimeEvnt}  
              endTimeOnChange={handleEndTimeEvnt}  
            />
          </DatePickerWrapper>
          <SelectInput
            handleChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setSelectedRoom(event.target.value)
              setRoomId(event.target.value)
            }}
            data={rooms}
            value={roomId}
            note="There are available rooms"
          />
          <SelectInput
            handleChange={handleRepeatEventChange}
            data={repeatData}
            value={repeatEvent}
            note="Select repeat options"
          />
          <Wrapper className="button-wrapper">
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handleClickonBooking}>Book</Button>
          </Wrapper>
        </Box>
      </Modal>
    </div>
  );
};

const DatePickerWrapper = styled("div")`
  svg {
    margin-right: 16px;
    height: 20px;
  }
`;

const Wrapper = styled("div")`
  &.button-wrapper {
    display: flex;
    place-content: end;
    margin-top: auto;
    button {
      padding: 9px 7px;
      color: #6200ee;
      font-size: 14px;
    }
  }
`;

export default BookingModal;

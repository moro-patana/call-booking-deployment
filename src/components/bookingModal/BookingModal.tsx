import React, { FC, useCallback, useState } from "react";
import { Box, Button, Modal, SelectChangeEvent, TextField, Typography } from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import styled from "styled-components";

import { fetchBookingsByUser } from "../../redux/actions/bookings";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";

import SelectInput from "../Select/SelectInput";
import DatePicker from "../datePicker/DatePicker";

import { RoomType } from "../../utils/types";
import { getSelectedTimeMinutes, newDateGenerator, timeConverter } from "../../utils/dateUtils";
import { bookingMutation, sendAuthorizedQuery } from '../../graphqlHelper';

interface BookingModalProps {
    rooms: RoomType[];
    repeatData: { name: string; id: string }[];
    open: boolean;
    handleClose: () => void;
    position: { x: number; y: number };
    day: Date;
    date: Date;
    startDate: Date;
    endDate: Date;
    selectedRoom: string;
    setSelectedRoom: (value: string) => void;
    errorMessage: string;
    setErrorMessage: (value: string) => void;
}

interface NewBooking {
    roomId: string;
    label: string;
    startDate: any;
    endDate: any;
    token: string;
}

const BookingModal: FC<BookingModalProps> = ({
    rooms,
    repeatData,
    open,
    handleClose,
    position,
    date,
    startDate,
    endDate,
    selectedRoom,
    setSelectedRoom,
    errorMessage,
    setErrorMessage
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

    const handleStartTimeEvent = (event: React.ChangeEvent<HTMLInputElement>) => {
        setStartTime(event.target.value);
    };

    const handleEndTimeEvent = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEndTime(event.target.value);
    };

    const handleChange = (value: Date | null) => {
        return value;
    };

    const handleRepeatEventChange = (event: SelectChangeEvent<any>) => {
        setRepeatEvent(event.target.value);
    };

    const addNewBooking = async (userBooking: NewBooking) => {
        const { roomId, label, startDate, endDate, token } = userBooking;
        try {
          const response = await sendAuthorizedQuery(
            bookingMutation(roomId, label, startDate, endDate),
            token
        );
        const { data } = response.data;
        return data;
        } catch (error: any) {
          setErrorMessage(error["message"]);
        }
    };

    const handleSubmitBooking = useCallback(async () => {
        const newStartDate = newDateGenerator(start, startTime);
        const newEndDate = newDateGenerator(end, endTime);

        try {
          if (currentUser.login.token && roomId) {
            await addNewBooking({
                label,
                startDate: newStartDate,
                endDate: newEndDate,
                roomId,
                token: currentUser.login.token,
            });
            dispatch(fetchBookingsByUser(setErrorMessage));
          }
        } catch (error: any) {
          setErrorMessage(error["message"]);
        }

        handleClose();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [label, roomId, startTime, endTime]);

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
                            startTime={startTime}
                            endTime={endTime}
                            startTimeOnChange={handleStartTimeEvent}
                            endTimeOnChange={handleEndTimeEvent}
                        />
                    </DatePickerWrapper>
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
                        handleChange={handleRepeatEventChange}
                        data={repeatData}
                        value={repeatEvent}
                        note="Select repeat options"
                    />
                    <Wrapper className="button-wrapper">
                        <Button onClick={handleClose}>Cancel</Button>
                        <Button onClick={handleSubmitBooking}>Book</Button>
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

import React, { useState } from "react";
import { Box, Button, Modal, TextField, Typography } from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import styled from "styled-components";
import SelectInput from "../Select";
import DatePicker from "../datePicker";
import { RoomType } from "../../utils/types";

const BookingModal = ({
  handleClose,
  rooms,
  repeatData,
}: {
  handleClose: any;
  rooms: RoomType[];
  repeatData: { name: string; id: string }[];
}) => {
  const [value, setValue] = useState(new Date());

  const handleChange = (newValue: any) => {
    setValue(newValue);
  };

  return (
    <div>
      <Modal
        hideBackdrop
        open={true}
        onClose={handleClose}
        sx={{ display: "flex", flexDirection: "column" }}
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
            InputLabelProps={{
              shrink: true,
            }}
          />
          <DatePickerWrapper
            style={{
              marginBottom: "14px",
              display: "flex",
            }}
          >
            <AccessTimeIcon />
            <DatePicker {...{ value, handleChange }} />
          </DatePickerWrapper>
          <SelectInput
            handleChange={handleChange}
            data={rooms}
            value={rooms[0]?.name}
            note="There are available rooms"
          />
          <SelectInput
            handleChange={handleChange}
            data={repeatData}
            value={repeatData[0].name}
            note="Select repeat options"
          />
          <Wrapper className="button-wrapper">
            <Button onClick={handleClose}>Cancel</Button>
            <Button>Book</Button>
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
      fontsize: 14px;
    }
  }
`;

export default BookingModal;

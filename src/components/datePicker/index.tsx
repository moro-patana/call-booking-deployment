import React from "react";
import { TextField } from "@mui/material";
import { Stack } from "@mui/system";
import { DesktopDatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import styled from "styled-components";

const timeStyle = {
  border: 0,
  padding: 0,
};

const DatePicker = ({
  value,
  handleChange,
}: {
  value: any;
  handleChange: any;
}) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Stack
        component="form"
        noValidate
        spacing={3}
        sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}
      >
        <Wrapper className="date-picker-wrapper">
          <DesktopDatePicker
            disablePast={true}
            label="date"
            inputFormat="EEEE, MMMM dd"
            value={value}
            onChange={handleChange}
            renderInput={(params) => <TextField {...params} />}
          />
        </Wrapper>

        <Wrapper className="time-picker-wrapper">
          <TextField
            className="time-picker"
            id="startTime"
            label="startTime"
            type="time"
            defaultValue="07:30"
            InputLabelProps={{
              shrink: true,
            }}
            inputProps={{
              step: 300, // 5 min
            }}
            sx={timeStyle}
          />
          {" - "}
          <TextField
            className="time-picker"
            id="endTime"
            label="endTime"
            type="time"
            defaultValue="07:30"
            InputLabelProps={{
              shrink: true,
            }}
            inputProps={{
              step: 300, // 5 min
            }}
            sx={timeStyle}
          />
        </Wrapper>
      </Stack>
    </LocalizationProvider>
  );
};

const Wrapper = styled("div")`
  fieldset {
    border: 0;
    margin: 0;
  }
  label,
  legend {
    display: none;
  }
  input {
    position: relative;
    padding: 0;
    width: 100%;
  }
  input[type="time" i]::-webkit-calendar-picker-indicator {
    display: block;
    width: 100px;
    position: absolute;
    background-image: none;
  }
  &.button-wrapper {
    display: flex;
    place-content: end;
    margin-top: auto;
  }
  &.time-picker-wrapper {
    margin-top: 0 !important;
  }
  &.date-picker-wrapper {
    position: relative;
    input {
      max-width: 175px;
    }
    button {
      position: absolute;
      left: 0;
      width: 100%;
      max-width: 175px;
      border-radius: 0;
      padding: 16px 0;
      svg {
        display: none;
      }
    }
  }
`;

export default DatePicker;

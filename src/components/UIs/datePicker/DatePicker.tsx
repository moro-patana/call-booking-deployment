import React, { FC } from "react";
import { Box, TextField } from "@mui/material";
import { Stack } from "@mui/system";
import { DesktopDatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import styles from "./datePicker.module.css";

interface DatePickerProps {
  value: Date | undefined;
  handleChange: (value: Date | null) => void;
  startTimeOnChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  endTimeOnChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  startTime: string;
  endTime: string;
}

const {
  form,
  wrapper,
  datePickerWrapper,
  datePicker,
  time,
  timePickerWrapper,
} = styles;

const DatePicker: FC<DatePickerProps> = ({
  value,
  handleChange,
  startTimeOnChange,
  endTimeOnChange,
  startTime,
  endTime,
}) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Stack component="form" noValidate className={form}>
        <Box className={`${wrapper} ${datePickerWrapper}`}>
          <DesktopDatePicker
            disablePast={true}
            disableMaskedInput={true}
            label="date"
            inputFormat="EEEE, MMMM dd"
            value={value}
            onChange={handleChange}
            className={datePicker}
            renderInput={(params) => <TextField {...params} />}
          />
        </Box>

        <Box className={`${wrapper} ${timePickerWrapper}`}>
          <TextField
            id="startTime"
            label="startTime"
            type="time"
            onChange={startTimeOnChange}
            value={startTime}
            InputLabelProps={{
              shrink: true,
            }}
            inputProps={{
              step: 300, // 5 min
            }}
            className={time}
          />
          <span>-</span>
          <TextField
            id="endTime"
            label="endTime"
            type="time"
            onChange={endTimeOnChange}
            value={endTime}
            InputLabelProps={{
              shrink: true,
            }}
            inputProps={{
              step: 300, // 5 min
            }}
            className={time}
          />
        </Box>
      </Stack>
    </LocalizationProvider>
  );
};

export default DatePicker;
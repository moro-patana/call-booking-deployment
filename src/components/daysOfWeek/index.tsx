import React from "react";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import { endOfWeek, startOfWeek, format, eachDayOfInterval } from "date-fns";
import styled from "styled-components";

const DaysOfWeek = ({ selectedDate }: { selectedDate: Date }) => {
  const startDay = startOfWeek(selectedDate, { weekStartsOn: 1 });
  const endDay = endOfWeek(selectedDate, { weekStartsOn: 1 });
  const weekDays = eachDayOfInterval({ start: startDay, end: endDay });

  return (
    <>
      {weekDays.map((day: Date) => (
        <TableRow
          key={day.getDate()}
          sx={{
            borderBottom: "4px solid black",
            "&:last-child, td": { border: 0 },
          }}
        >
          <TableCell>
            <Container>
              <b>{day.getDate()}</b>
              <span>{format(day, "EEEE")}</span>
            </Container>
          </TableCell>
        </TableRow>
      ))}
    </>
  );
};

const Container = styled("div")`
  display: flex;
  flex-direction: column;
  align-items: center;
  b {
    font-size: 36px;
  }
  span {
    font-size: 16px;
  }
`;

export default DaysOfWeek;

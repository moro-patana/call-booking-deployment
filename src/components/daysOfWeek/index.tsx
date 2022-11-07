import React, { useState } from "react";
import { TableCell, TableRow } from "@mui/material";
import { endOfWeek, startOfWeek, format, eachDayOfInterval } from "date-fns";
import styled from "styled-components";

const DaysOfWeek = ({ selectedDate }: { selectedDate: Date }) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [isActive, setIsActive] = useState(false);
  const startDay = startOfWeek(selectedDate, { weekStartsOn: 1 });
  const endDay = endOfWeek(selectedDate, { weekStartsOn: 1 });
  const weekDays = eachDayOfInterval({ start: startDay, end: endDay });

  const onToggleRow = (index: number) => {
    setActiveIndex(index);
    if (activeIndex === index) {
      setIsActive(!isActive);
    } else {
      setIsActive(true);
    }
  };

  return (
    <>
      {weekDays.map((day: Date, index: number) => {
        const date = day.getDate();
        const weekDay = format(day, "EEEE");
        const isSelected = activeIndex === index;
        const selectedByDefault = date === selectedDate.getDate();

        return (
          <TableRow
            key={date}
            sx={{
              borderBottom: "4px solid black",
              cursor: "pointer",
              "&:last-child, td": { border: 0 },
              height: `${
                (isActive && isSelected) || selectedByDefault ? "207px" : "67px"
              }`,
            }}
            onClick={() => onToggleRow(index)}
          >
            <TableCell sx={{ padding: 0 }}>
              <Container>
                <b>{date}</b>
                <span>{weekDay}</span>
              </Container>
            </TableCell>
          </TableRow>
        );
      })}
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

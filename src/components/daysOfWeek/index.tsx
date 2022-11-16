import React, { useState } from "react";
import { TableCell, TableRow } from "@mui/material";
import { endOfWeek, startOfWeek, format, eachDayOfInterval } from "date-fns";
import Room from "../rooms";
import { RoomPerHour } from "../rooms/index";

const DaysOfWeek = ({
  selectedDate,
  rooms,
  availableHours,
  bookings,
  users,
}: {
  availableHours: Date[];
  selectedDate: Date;
  rooms: { id: string; name: string; description: string }[];
  bookings: never[];
  users: { id: string; email: string; password: string; username: string }[];
}) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [isActive, setIsActive] = useState(false);
  const startDay = startOfWeek(selectedDate, { weekStartsOn: 1 });
  const endDay = endOfWeek(selectedDate, { weekStartsOn: 1 });
  const weekDays = eachDayOfInterval({ start: startDay, end: endDay });

  const someRooms = [...rooms].slice(0, 3);

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
        const activeRow =
          (isActive && activeIndex === index) ||
          date === selectedDate.getDate();

        return (
          <TableRow
            key={date}
            className={activeRow ? "active-row" : "row"}
            sx={{
              borderTop: `4px solid ${
                activeRow ? "black" : "rgba(0, 0 , 0 , 0.5)"
              }`,
              "&:last-child, td": { borderBottom: 0 },
              "&.active-row + .row": { borderTop: "4px solid black" },
              "&:nth-of-type(2)": { borderTop: 0 },
            }}
          >
            <TableCell
              sx={{ padding: 0, maxWidth: "123px", cursor: "pointer" }}
              onClick={() => onToggleRow(index)}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  padding: activeRow ? "0 35px 0 15px" : "0 20px",
                }}
              >
                <div
                  style={{
                    opacity: activeRow ? 1 : 0.6,
                    fontSize: "36px",
                  }}
                >
                  {date}
                </div>
                <span
                  style={{
                    opacity: activeRow ? 1 : 0.6,
                    fontSize: "16px",
                  }}
                >
                  {weekDay}
                </span>
              </div>
            </TableCell>
            <TableCell
              sx={{
                position: "relative",
                padding: 0,
                paddingRight: "14px",
                borderRight: "2px solid #9d9898",
                minWidth: "100px",
                left: activeRow ? "-20px" : 0,
              }}
            >
              <Room
                rooms={activeRow ? rooms : someRooms}
                isSelected={activeRow}
              />
            </TableCell>
            {availableHours.map((hour: any) => {
              return (
                <TableCell
                  className={activeRow ? "active" : "row"}
                  sx={{
                    padding: 0,
                    position: "relative",
                    "&.active tbody": {
                      position: "relative",
                    },
                    "&:not(:last-of-type)": {
                      borderRight: "2px solid #9d9898",
                    },
                    "&::before": {
                      content: "''",
                      width: "2px",
                      minHeight: "100%",
                      zIndex: 2,
                      position: "absolute",
                      top: 0,
                      left: "-2px",
                      backgroundColor: "#9d9898",
                    },
                  }}
                  key={hour?.getHours()}
                >
                  <RoomPerHour
                    rooms={activeRow ? rooms : []}
                    bookings={bookings}
                    day={day}
                    hour={hour?.getHours()}
                    users={users}
                  />
                </TableCell>
              );
            })}
          </TableRow>
        );
      })}
    </>
  );
};

export default DaysOfWeek;

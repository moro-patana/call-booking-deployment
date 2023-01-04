import { useState } from "react";
import { TableCell, TableRow } from "@mui/material";
import { format } from "date-fns";
import Room from "../rooms";
import { BookingType, RoomType, UserBookingType } from "../../utils/types";
import RoomPerHour from "../roomPerHour";

interface DaysOfWeekType {
  availableHours: Date[];
  selectedDate: Date;
  rooms: RoomType[];
  bookings: BookingType[] | [];
  users: UserBookingType[];
  weekDays: any[];
}

const DaysOfWeek = ({
  selectedDate,
  rooms,
  availableHours,
  bookings,
  users,
  weekDays
}: DaysOfWeekType) => {

  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [isActive, setIsActive] = useState<boolean>(false);
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
      <TableRow
        className={"row"}
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "end",
        }}
      >
        <TableCell
          sx={{
            border: '0',
            marginLeft: '35px'
          }}
        ></TableCell>
        {weekDays.map((day: Date, index: number) => {
          const date = day.getDate();
          const weekDay = format(day, "EEEE");
          const activeRow =
            (isActive && activeIndex === index) ||
            date === selectedDate.getDate();

        return (
            <TableCell
              key={index}
              sx={{ 
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                padding: 0, 
                cursor: "pointer", 
                borderRight: `4px solid ${"rgba(0, 0 , 0 , 0.5)"}`,
                borderLeft: '0px solid',
                "&:last-child, td": { borderRight: 0 },
                "&.active-row + .row": { borderRight: "4px solid black" },
                "&:nth-of-type(2)": { borderLeft: 0 }, }}
              onClick={() => onToggleRow(index)}
              
            >
              <div
                style={{
                  textAlign: 'center',
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

              <div
                style={{
                  position: "relative",
                  padding: 0,
                  paddingBottom: "14px",
                  borderBottom: "2px solid #9d9898",
                  minWidth: "100px",
                }}
              >
                <Room
                  rooms={activeRow ? rooms : someRooms}
                  isSelected={activeRow}
                />
                {availableHours.map((date: Date) => {
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
                      key={date?.getHours()}
                    >
                      <RoomPerHour
                        rooms={activeRow ? rooms : []}
                        bookings={bookings}
                        day={day}
                        date={date}
                        users={users}
                      /> 
                    </TableCell>
                  );
                })}
              </div>
            </TableCell>
          );
        })}
      </TableRow>
    </>
  );
};

export default DaysOfWeek;

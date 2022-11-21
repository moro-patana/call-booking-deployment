import { Table, TableBody, TableCell, TableRow } from "@mui/material";
import { eachMinuteOfInterval } from "date-fns";
import { dateStringConverter, timeConverter } from "../../utils/dateUtils";
import { BookingType, RoomType, UserType } from "../../utils/types";
import BookingModal from "../bookingModal";
import TooltipContent, { HtmlTooltip } from "../tooltip";
import { useState } from "react";

interface RoomPerHoursType {
  rooms: RoomType[];
  bookings: BookingType[];
  day: Date;
  date: Date;
  users: UserType[];
}

const RoomPerHour = ({
  rooms,
  bookings,
  day,
  date,
  users,
}: RoomPerHoursType) => {
  const viewPort = window.innerWidth;
  const [cellId, setCellId] = useState("");
  const [modalPosition, setModalPosition] = useState({ x: 0, y: 0 });
  const [selectedRoom, setSelectedRoom] = useState("");

  const openModal = (event: any) => {
    const classList = event.target.classList;
    if (classList.contains("booking-cell")) {
      setModalPosition({
        x: Math.round(((event.pageX - 206) / viewPort) * 100),
        y: event.pageY - 204,
      });

      setCellId(event.target.id);
      setSelectedRoom(event.target.id);
    }
  };

  const percentageCalculator = (params: number) => {
    return Math.floor((params / 60) * 100);
  };

  const repeatData = [
    { name: "Does not repeat", id: "1" },
    { name: "Daily", id: "2" },
    { name: "Weekly", id: "3" },
  ];

  const getTime = (date: Date) => {
    return `${timeConverter(date?.getHours())}:${timeConverter(
      date?.getMinutes()
    )}`;
  };

  return (
    <>
      <Table>
        {rooms.map((room: RoomType) => {
          const bookingPerRoom: any = bookings.filter(
            (booking: BookingType) => booking?.roomId === room?.id
          );

          const bookingItem = bookingPerRoom.find(
            (booking: { startDate: string }) => {
              const bookingDay = dateStringConverter(booking?.startDate).getDate();

              const bookingStartTime = dateStringConverter(
                booking?.startDate
              ).getHours();

              return (
                bookingDay === day?.getDate() &&
                bookingStartTime === date?.getHours()
              );
            }
          );

          const startDate =
            bookingItem && dateStringConverter(bookingItem.startDate);

          const endDate =
            bookingItem && dateStringConverter(bookingItem.endDate);

          const arrayOfDates = eachMinuteOfInterval({
            start: startDate,
            end: endDate,
          });

          const user = users.find(
            (user: UserType) => user?.id === bookingItem?.user?.id
          );

          const minutes = dateStringConverter(
            bookingItem?.startDate
          ).getMinutes();

          const booking = {
            ...bookingItem,
            position: percentageCalculator(minutes),
            width: percentageCalculator(arrayOfDates.length),
            user: user?.username,
          };

          return (
            <TableBody
              key={room?.id}
              sx={{
                position: "relative",
                border: "1px solid #7a7878",
                borderLeft: 0,
                borderRight: 0,
                "&:last-of-type": { borderBottom: 0 },
                "&:first-of-type": { borderTop: 0 },
                "&:not(:first-of-type)::before": {
                  content: "''",
                  position: "absolute",
                  top: "-2px",
                  left: "-14px",
                  display: "block",
                  width: "14px",
                  height: "1px",
                  backgroundColor: "#7a7878",
                },
              }}
            >
              <TableRow>
                <TableCell
                  className="booking-cell"
                  sx={{
                    position: "relative",
                    padding: "4px 5px",
                    height: "20px",
                    cursor: "pointer",
                  }}
                  id={room?.id}
                  onClick={openModal}
                >
                  <BookingModal
                    rooms={rooms}
                    position={modalPosition}
                    open={room?.id === cellId}
                    repeatData={repeatData}
                    handleClose={() => setCellId("")}
                    day={day}
                    date={date}
                    selectedRoom={selectedRoom}
                    setSelectedRoom={setSelectedRoom}
                  />

                  {booking && (
                    <HtmlTooltip
                      title={
                        <TooltipContent
                          room={room?.name}
                          startTime={getTime(startDate)}
                          endTime={getTime(endDate)}
                          user={booking?.user}
                          description={booking?.label}
                        />
                      }
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          position: "absolute",
                          top: 0,
                          left: `${booking?.position}%`,
                          zIndex: 2,
                          backgroundColor: "#cbced8",
                          height: "28px",
                          width: `${booking?.width}%`,
                          cursor: "pointer",
                        }}
                      >
                        <span
                          style={{
                            paddingLeft: "8px",
                            color: "#5b5b5b",
                            fontWeight: "300",
                            fontStyle: "italic",
                          }}
                        >
                          {booking?.user}
                        </span>
                      </div>
                    </HtmlTooltip>
                  )}
                </TableCell>
              </TableRow>
            </TableBody>
          );
        })}
      </Table>
    </>
  );
};

export default RoomPerHour;

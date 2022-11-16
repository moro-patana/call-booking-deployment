import React from "react";
import { Table, TableBody, TableCell, TableRow } from "@mui/material";
import { eachMinuteOfInterval } from "date-fns";

const Room = ({
  rooms,
  isSelected,
}: {
  rooms: { id: string; name: string; description: string }[];
  isSelected: boolean;
}) => {
  return (
    <Table
      sx={{
        borderCollapse: "collapse",
      }}
    >
      {rooms.map((room: { id: string; name: string; description: string }) => {
        const { id, name } = room;
        return (
          <TableBody
            key={id}
            sx={{
              backgroundColor: "#c8c8c8",
              border: isSelected ? "1px solid #000000" : "2px solid #fff",
              borderRight: isSelected ? "1px solid #000000" : 0,
              "&:last-of-type": { borderBottom: 0 },
              "&:first-of-type": { borderTop: 0 },
              opacity: isSelected ? 1 : 0.6,
            }}
          >
            <TableRow>
              <TableCell sx={{ padding: "4px 5px" }}>{name}</TableCell>
            </TableRow>
          </TableBody>
        );
      })}
    </Table>
  );
};

export const RoomPerHour = ({
  rooms,
  bookings,
  day,
  hour,
  users,
}: {
  rooms: { id: string; name: string; description: string }[];
  bookings: never[];
  day: Date;
  hour: number;
  users: { id: string; email: string; password: string; username: string }[];
}) => {
  return (
    <>
      <Table>
        {rooms.map(
          (room: { id: string; name: string; description: string }) => {
            const bookingPerRoom: any = bookings.filter(
              (booking: {
                endDate: string;
                id: string;
                label: string;
                roomId: string;
                startDate: string;
              }) => booking?.roomId === room?.id
            );

            const bookingItem = bookingPerRoom.find(
              (date: { startDate: string }) => {
                const startTimeChecker = date.startDate !== "now";
                const bookingDay = startTimeChecker
                  ? new Date(Date.parse(date.startDate)).getDate()
                  : new Date().getDate();

                const bookingStartTime = startTimeChecker
                  ? new Date(Date.parse(date.startDate)).getHours()
                  : new Date().getHours();
                return (
                  bookingDay === day.getDate() && bookingStartTime === hour
                );
              }
            );

            const minutes = new Date(
              Date.parse(bookingItem?.startDate)
            ).getMinutes();

            const startDate =
              bookingItem && bookingItem?.startDate !== "now"
                ? new Date(Date.parse(bookingItem.startDate))
                : new Date();

            const endDate =
              bookingItem && new Date(Date.parse(bookingItem.endDate));

            const arrayOfDates = eachMinuteOfInterval({
              start: startDate,
              end:
                endDate !== "Invalid Date"
                  ? endDate
                  : new Date(
                      new Date().setMinutes(new Date().getMinutes() + 30)
                    ),
            });

            const width = Math.floor((arrayOfDates.length / 60) * 100);

            const position = Math.round(Math.floor((minutes / 60) * 100));

            const user = users.find(
              (user: {
                id: string;
                email: string;
                password: string;
                username: string;
              }) => user.id === bookingItem?.user?.id
            );

            const booking = {
              ...bookingItem,
              position,
              width,
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
                    sx={{
                      position: "relative",
                      padding: "4px 5px",
                      height: "20px",
                      cursor: "default",
                    }}
                  >
                    {booking && (
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
                    )}
                  </TableCell>
                </TableRow>
              </TableBody>
            );
          }
        )}
      </Table>
    </>
  );
};

export default Room;

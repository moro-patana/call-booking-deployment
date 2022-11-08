import React from "react";
import { Table, TableBody, TableCell, TableRow } from "@mui/material";

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
        maxWidth: "max-content",
        position: isSelected ? "absolute" : "unset",
        top: 0,
      }}
    >
      {rooms.map((room: { id: string; name: string; description: string }) => {
        const { id, name } = room;
        return (
          <TableBody
            key={id}
            sx={{
              width: "100%",
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
}: {
  rooms: { id: string; name: string; description: string }[];
}) => {
  return (
    <>
      <Table sx={{ borderRight: "2px solid #9d9898" }}>
        {rooms.map(
          (room: { id: string; name: string; description: string }) => (
            <TableBody
              key={room?.id}
              sx={{
                border: "1px solid #7a7878",
                borderLeft: 0,
                borderRight: 0,
                "&:last-of-type": { borderBottom: 0 },
                "&:first-of-type": { borderTop: 0 },
              }}
            >
              <TableRow>
                <TableCell sx={{ padding: "4px 5px", height: "20px" }} />
              </TableRow>
            </TableBody>
          )
        )}
      </Table>
    </>
  );
};

export default Room;

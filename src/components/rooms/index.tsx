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
}: {
  rooms: { id: string; name: string; description: string }[];
}) => {
  return (
    <>
      <Table>
        {rooms.map(
          (room: { id: string; name: string; description: string }) => (
            <TableBody
              key={room?.id}
              sx={{
                position: "relative",
                border: "1px solid #7a7878",
                borderLeft: 0,
                borderRight: 0,
                "&:last-of-type": { borderBottom: 0 },
                "&:first-of-type": { borderTop: 0 },
                "&:not(:first-of-type):before": {
                  content: "''",
                  position: "absolute",
                  top: "-2px",
                  left: "-14px",
                  display: "block",
                  width: "14px",
                  height: "1px",
                  backgroundColor: "#9d9898",
                },
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

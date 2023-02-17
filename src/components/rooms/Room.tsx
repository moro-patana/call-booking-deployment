import React from "react";
import { Table, TableBody, TableCell, TableRow } from "@mui/material";
import { RoomType } from "../../utils/types";

const Room = ({
  rooms,
  isSelected,
}: {
  rooms: RoomType[];
  isSelected: boolean;
}) => {
  return (
    <Table
      sx={{
        borderCollapse: "collapse",
      }}
    >
      {rooms.map((room: RoomType) => {
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

export default Room;

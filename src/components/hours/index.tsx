import React from "react";
import { TableCell, TableRow } from "@mui/material";
import styled from "styled-components";

const Hours = ({ availableHours }: { availableHours: Date[] }) => {
  return (
    <>
      <TableRow
        sx={{
          padding: 0,
          borderTop: 0,
        }}
      >
        <TableCell
          sx={{
            paddingBottom: 0,
            borderBottom: 0,
            borderRight: 0,
            paddingTop: "5px",
            width: 0,
          }}
        />
        <TableCell
          sx={{
            paddingBottom: 0,
            borderBottom: 0,
            borderRight: "2px solid #9d9898",
            paddingTop: "5px",
            width: 0,
          }}
        />
        {availableHours.map((hour: Date) => (
          <TableCell
            key={hour.getHours()}
            sx={{
              position: "relative",
              borderTop: 0,
              borderBottom: 0,
              padding: 0,
              "&:not(:last-of-type)": { borderRight: "2px solid #9d9898" },
            }}
          >
            <Span>{hour.getHours()}:00</Span>
          </TableCell>
        ))}
      </TableRow>
    </>
  );
};

const Span = styled("span")`
  position: absolute;
  top: -25px;
  left: -18.5px;
  font-size: 14px;
`;

export default Hours;

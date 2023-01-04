import { TableCell, TableRow } from "@mui/material";

const Hours = ({ availableHours }: { availableHours: Date[] }) => {
  return (
    <>
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
      <TableRow
        key={hour.getHours()}
        sx={{
          padding: 0,
          borderTop: 0,
        }}
      >
          <TableCell
            sx={{
              position: "relative",
              borderRight: 0,
              borderTop: 0,
              padding: 0,
              "&:not(:last-of-type)": { borderTop: "2px solid #9d9898" },
            }}
          >
            <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "start",
                  padding: "0 20px",
                }}
              >
                <span
                  style={{
                    opacity: 0.6,
                    fontSize: "16px",
                  }}
                >
                  {hour.getHours()}:00
                </span>
              </div>
          </TableCell>
      </TableRow>
    ))}
    </>
  );
};

export default Hours;

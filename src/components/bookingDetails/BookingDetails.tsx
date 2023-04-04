import { FC } from "react";
import { Box, styled as materialStyle, Tooltip, tooltipClasses, TooltipProps, Typography } from "@mui/material";
import { format } from "date-fns";
import { IEvent, RoomType, UserType } from "../../utils/types";
import styles from "./bookingDetails.module.css"
import { formatTime } from "../../utils/dateUtils";

interface BookingDetailsProps {
  event: IEvent;
  position: { x: number, y: number };
  rooms: RoomType[];
  bookingOwner: UserType | null;
}

export const HtmlTooltip = materialStyle(
  ({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} classes={{ popper: className }} />
  )
)(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "#fff",
    color: "rgba(0, 0, 0, 0.87)",
    maxWidth: "max-content",
    fontSize: theme.typography.pxToRem(12),
    padding: "14px",
    boxShadow: "0px 1px 3px #cbced8",
    borderRadius: "4px",
  },
}));

const { box, typography, detail } = styles;

const BookingDetails: FC<BookingDetailsProps> = ({
  event,
  position,
  rooms,
  bookingOwner,
}) => {

  const screenWidth = window.screen.width;
  const xInPercentage = (position.x / screenWidth ) * 100;

  const boxPosition = {
    left: `${xInPercentage > 75 ? (xInPercentage - 20) : xInPercentage > 60 ? (xInPercentage - 22) :xInPercentage}%`,
    top: position.y > 518 ? 640 : position.y > 18 ? (position.y - 50) : 18,
  };

  const room = rooms && rooms.find((room: RoomType) => room?.id === event?.resourceId);
  const startTime = event && formatTime(event?.start);
  const endTime = event && formatTime(event?.end);

  return (
    <Box className={box} sx={boxPosition}>
      <Typography variant="h3" className={typography}>
        Booking details
      </Typography>
      <Typography variant="body2" className={detail}>Booking by {bookingOwner?.username}</Typography>
      <Typography variant="body2" className={detail}>
        Date: {format(event?.start, 'dd/MM/yyyy')} from {startTime} to {endTime}
      </Typography>
      <Typography variant="body2" className={detail}>Room: {room && room?.name}</Typography>
      <Typography variant="body2" className={detail}>Reason: {event?.title ? event?.title : 'Not precised'}</Typography>
    </Box>
  );
};

export default BookingDetails;

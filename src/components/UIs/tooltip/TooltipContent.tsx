import React, { FC } from "react";
import {
    Stack,
    styled as materialStyle,
    Tooltip,
    tooltipClasses,
    TooltipProps,
    Typography,
} from "@mui/material";
import styles from './TooltipContent.module.css';

interface TooltipContentProps {
    room: string;
    startTime: string;
    endTime: string;
    user: string;
    description: string;
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

const { wrapper, heading, smallText, span } = styles;

const TooltipContent: FC<TooltipContentProps> = ({
    room,
    startTime,
    endTime,
    user,
    description,
}) => {

    return (
        <Stack className={wrapper}>
            <Typography variant="body1" className={heading}>{room}</Typography>
            <Typography variant="subtitle1">{`${startTime} - ${endTime}`}</Typography>
            <Typography variant="body2">{description}</Typography>
            <small className={smallText}>Does not repeat</small>
            <Typography component='span' variant="subtitle2" className={span}>{user}</Typography>
        </Stack>
    );
};

export default TooltipContent;

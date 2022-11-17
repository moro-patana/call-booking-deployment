import React from "react";
import {
  styled as materialStyle,
  Tooltip,
  tooltipClasses,
  TooltipProps,
} from "@mui/material";
import styled from "styled-components";

interface TooltipContentType {
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

const TooltipContent = ({
  room,
  startTime,
  endTime,
  user,
  description,
}: TooltipContentType) => {
  return (
    <Wrapper>
      <h3>{room}</h3>
      <time>{`${startTime} - ${endTime}`}</time>
      <p>{description}</p>
      <small>Does not repeat</small>
      <span>{user}</span>
    </Wrapper>
  );
};

const Wrapper = styled("div")`
  h3 {
    font-size: 16px;
    text-decoration: underline;
    margin-top: 0;
    font-weight: 400;
  }
  time {
    font-size: 18px;
  }
  p {
    font-size: 14px;
    margin-top: 0;
  }
  span {
    color: #b9b9b9;
    font-size: 14px;
    font-style: italic;
  }

  small {
    font-size: 12px;
  }
  time,
  span,
  small {
    display: block;
  }
  h3,
  time,
  p,
  small {
    margin-bottom: 14px;
  }
`;

export default TooltipContent;

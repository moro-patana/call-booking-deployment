import { FC } from "react";
import { Box, CircularProgress } from "@mui/material";
import styles from "./spinner.module.css";

interface SpinnerProp {
  action?: string;
}

const { wrapper } = styles;

const Spinner: FC<SpinnerProp> = ({ action }) => {
  return (
    <Box className={wrapper}>
      <div>{action}...</div>
      <CircularProgress />
    </Box>
  );
};

export default Spinner;
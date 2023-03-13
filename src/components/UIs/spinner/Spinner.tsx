import { FC } from 'react';
import { Box, CircularProgress } from '@mui/material';

interface SpinnerPropType {
    action?: string
}

const Spinner: FC<SpinnerPropType> = ({ action }) => {
  return (
    <Box sx={{
        marginTop: "120px",
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        alignItems: "center",
        gap: "74px",
        }}
    >
        <div>{action}...</div>
        <CircularProgress />
    </Box>
  );
};

export default Spinner;

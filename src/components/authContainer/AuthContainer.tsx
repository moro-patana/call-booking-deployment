import { FC, ReactNode } from 'react';
import { Box, Container, Typography } from '@mui/material';
import styles from './authContainer.module.css';

interface AuthContainerProps {
  heading: string;
  children: ReactNode;
}

const AuthContainer: FC<AuthContainerProps> = ({ heading, children }) => {
  const { container, box, typography } = styles;
  
  return (
    <Container className={container}>
      <Box className={box}>
        <Typography variant='h3' className={typography}>
          {heading}
        </Typography>
        {children}
      </Box>
    </Container>
  );
};

export default AuthContainer;

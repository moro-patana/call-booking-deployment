import React, { FC } from 'react';
import {
  Box,
  Container,
  Typography,
} from '@mui/material';

export interface UserType {
  username: string
  email: string
  password: string
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void
  usernameChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  emailChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  passwordChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const AuthContainer: FC<any> = ({heading, children }) => {
  return (
    <Container 
      sx={{
        width: "464px",
        height: "543px",
        position: "absolute",
        top: "370px",
        right: "12px",
        zIndex: 999,
        boxShadow: 3,
        borderRadius: "5px",
        background: "#fff",
        padding: "24px 0",
      }}
    >
      <Box
        sx={{
          textAlign: 'initial',
        }}
      >
        <Typography variant='h3'>{heading}</Typography>
        {children}
    </Box>
    </Container>
  );
};

export default AuthContainer;

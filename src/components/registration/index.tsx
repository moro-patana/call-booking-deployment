import React, { ChangeEvent, FC, useState } from 'react';
import {
  Box,
  Button,
  Container,
  Grid,
  TextField,
  Typography,
} from '@mui/material';

export interface UserType {
  username: string
  email: string
  password: string
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void
  usernameChange: React.ChangeEventHandler<HTMLInputElement> | undefined
  emailChange: React.ChangeEventHandler<HTMLInputElement> | undefined
  passwordChange: React.ChangeEventHandler<HTMLInputElement> | undefined
}

const Registration: FC<UserType> = ({
  username,
  email,
  password,
  usernameChange,
  emailChange,
  passwordChange,
  onSubmit
}) => {

  return (
    <Container 
      sx={{
        width: "464px",
        position: "fixed",
        top: "49%",
        left: "2%",
        zIndex: 2,
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
        <form onSubmit={onSubmit}>
          <Typography variant='h3'>Register</Typography>
          <Box component='form' sx={{ color: '#787878' }}>
            <Grid container spacing='9px'>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id='username'
                  placeholder='username'
                  name='username'
                  type='text'
                  sx={{ marginBottom: '10px' }}
                  value={username}
                  onChange={usernameChange}
                />
                <label htmlFor='username'>Enter your username</label>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id='email'
                  placeholder='email'
                  name='email'
                  type='email'
                  sx={{ marginBottom: '10px' }}
                  value={email}
                  onChange={emailChange}
                />
                <label htmlFor='email'>Enter you email</label>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name='password'
                  placeholder='Password'
                  type='password'
                  id='password'
                  sx={{ marginBottom: '10px' }}
                  value={password}
                  onChange={passwordChange}
                />
                <label htmlFor='password'>Enter your password</label>
              </Grid>
            </Grid>
            <Button
              sx={{ color: '#787878', marginLeft: "334px" }}>
              Register
            </Button>
          </Box>
        </form>
      </Box>
      <Box sx={{ textAlign: 'center', marginTop: "24px" }}>Already have an account? Login here</Box>
    </Container>
  );
};

export default Registration;

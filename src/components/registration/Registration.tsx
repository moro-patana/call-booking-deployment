import React, { FC } from 'react';
import {
  Box,
  Button,
  Grid,
  TextField,
} from '@mui/material';

export interface UserProps {
  username: string;
  email: string;
  password: string;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  usernameChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  emailChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  passwordChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const Registration: FC<UserProps> = ({
  username,
  email,
  password,
  usernameChange,
  emailChange,
  passwordChange,
  onSubmit
}) => {

  return (
    <Box
      component='form' sx={{ color: '#787878' }}
      onSubmit={onSubmit}
    >
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
            required
          />
          <label htmlFor='username'>Enter your username</label>
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            id='email'
            placeholder='booking@gmail.com'
            name='email'
            type='email'
            sx={{ marginBottom: '10px' }}
            value={email}
            onChange={emailChange}
            required
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
            required
          />
          <label htmlFor='password'>Enter your password</label>
        </Grid>
      </Grid>
      <Button
        sx={{
          color: password ? "#883ff2" : '#787878',
          marginLeft: "334px",
        }}
        type="submit"
      >
        Register
      </Button>
    </Box>
  );
};

export default Registration;

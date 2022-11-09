import React from 'react';
import {
  Box,
  Button,
  Container,
  Grid,
  TextField,
  Typography,
} from '@mui/material';

const Registration = () => {
  return (
    <Container>
      <Box
        sx={{
          textAlign: 'initial',
        }}
      >
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
              />
              <label htmlFor='password'>Enter your password</label>
            </Grid>
          </Grid>
          <Button sx={{ color: '#787878' }}>Register</Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Registration;

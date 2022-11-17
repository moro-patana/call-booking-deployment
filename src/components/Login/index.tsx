import { Box, Button, Grid, TextField } from '@mui/material';
const Login = () => {
  return (
    <Box
      component='form'
      sx={{
        color: '#787878',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
      }}
    >
      <Grid container spacing='19px'>
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
      <Button sx={{ color: '#6200ee', marginTop: '15px' }} type='submit'>
        Login
      </Button>
    </Box>
  );
};

export default Login;

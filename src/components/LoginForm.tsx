import { Box, Button, Grid, TextField } from '@mui/material';
import { FC } from 'react';

interface LoginFormProps {
  email: string;
  password: string;
  // emailErr: string
  // passwordErr: string
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  emailChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  passwordChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const LoginForm: FC<LoginFormProps> = ({
  email,
  password,
  // emailErr,
  // passwordErr,
  onSubmit,
  emailChange,
  passwordChange
}) => {
  return (
    <Box
      component='form'
      sx={{
        color: '#787878',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
      }}
      onSubmit={onSubmit}
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
            value={email}
            onChange={emailChange}
            // helperText={emailErr}
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
            // helperText={passwordErr}
            required
          />
          <label htmlFor='password'>Enter your password</label>
        </Grid>
      </Grid>
      <Button
        sx={{ color: '#6200ee', marginTop: '15px' }}
        type='submit'
      >
        Login
      </Button>
    </Box>
  );
};

export default LoginForm;

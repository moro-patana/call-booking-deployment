import { FC, useState } from 'react';
import { Box, Button, Divider } from '@mui/material';
import { fetchUserRegister } from '../redux/reducers/usersSlice';
import { useAppDispatch } from '../redux/hooks';
import { AuthContainer, Registration } from '../components';
import useCustomHooks from '../customHooks';

interface RegisterPageType {
  setIsRegistered: (value: boolean) => void
}

const RegisterPage: FC<RegisterPageType> = ({ setIsRegistered }) => {
  const {
    accountRegister,
    handleEmailChange,
    handlePasswordChange,
    handleUsernameChange,
    handleRegistrationSubmit
  } = useCustomHooks();

  return (
    <AuthContainer heading={'Register'}>
      <div>
        <Registration
          username={accountRegister.username}
          email={accountRegister.email}
          password={accountRegister.password}
          usernameChange={handleUsernameChange}
          emailChange={handleEmailChange}
          passwordChange={handlePasswordChange}
          onSubmit={handleRegistrationSubmit}
        />
        <Box sx={{ textAlign: 'center', marginTop: '35px' }}>
          <Divider light />
          <div style={{ marginTop: '30px' }}>
            Already have an account?
            <Button
              sx={{ color: "#000", textDecoration: "underline" }}
              onClick={() => setIsRegistered(true)}
            >
              Login here
            </Button>
          </div>
        </Box>
      </div>
    </AuthContainer>
  );
};

export default RegisterPage;

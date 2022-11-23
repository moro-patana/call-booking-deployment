import React, { FC } from 'react';
import { Box, Button, Divider } from '@mui/material';
import { AuthContainer, Registration } from '../components';
import useCustomHooks from '../customHooks';
import { useAppDispatch } from '../redux/hooks';
import { fetchUserRegister } from '../redux/reducers/usersSlice';

interface RegisterPageType {
  setIsRegistered: (value: boolean) => void
}

const RegisterPage: FC<RegisterPageType> = ({ setIsRegistered }) => {
  const dispatch = useAppDispatch();
  const {
    accountRegister,
    handleEmailChange,
    handlePasswordChange,
    handleUsernameChange,
  } = useCustomHooks();

  const handleRegistrationSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event?.preventDefault();
    dispatch(
      fetchUserRegister({
        username: event.currentTarget.username.value,
        password: event.currentTarget.password.value,
        email: event.currentTarget.email.value,
      })
    );
    setIsRegistered(true);
  };
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

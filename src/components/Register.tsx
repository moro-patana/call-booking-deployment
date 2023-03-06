import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Divider } from '@mui/material';
import Registration from './registration/Registration';
import AuthContainer from './authContainer/AuthContainer'
import { useAppDispatch } from '../redux/hooks';
import { userRegistered } from '../redux/reducers/usersSlice';
import { registerMutation, sendQuery } from "../graphqlHelper";

const RegisterComponent = ({ setErrorMessage }:{ setErrorMessage: (value: string) => void }) => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch();
  const [accountRegister, setAccountRegister] = useState({
    username: '',
    password: '',
    email: '',
  });

  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAccountRegister({
      ...accountRegister,
      username: event.target.value,
    });
  };

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAccountRegister({
      ...accountRegister,
      email: event.target.value,
    });
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAccountRegister({
      ...accountRegister,
      password: event.target.value,
    });
  };

  const handleRegistrationSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event?.preventDefault();
    try {
    const res = await sendQuery(registerMutation(accountRegister.username, accountRegister.email, accountRegister.password));
    dispatch(userRegistered(res.data.data));
    dispatch(userRegistered(true));
    navigate("/login");
    } catch(error: any) {
      setErrorMessage(error);
    }
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
              onClick={() => navigate("/login")}
            >
              Login here
            </Button>
          </div>
        </Box>
      </div>
    </AuthContainer>
  );
};

export default RegisterComponent;

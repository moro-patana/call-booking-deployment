import React, { FC, useState } from 'react';
import { Box, Button, Divider } from '@mui/material';
import Registration from './registration';
import AuthContainer from './authContainer'
import { useAppDispatch } from '../redux/hooks';
import { userRegistered } from '../redux/reducers/usersSlice';
import { registerMutation, sendQuery } from "../graphqlHelper";


interface RegisterComponentType {
  setIsSignupVisible: (value: boolean) => void
}

const RegisterComponent: FC<RegisterComponentType> = ({ setIsSignupVisible }) => {
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
    const res = await sendQuery(registerMutation(accountRegister.username, accountRegister.email, accountRegister.password))

    dispatch(userRegistered(res.data.data))
    dispatch(userRegistered(true))
    setIsSignupVisible(false)
    } catch(err) {
      console.log('error while register', err)
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
              onClick={() => setIsSignupVisible(false)}
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

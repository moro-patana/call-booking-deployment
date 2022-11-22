import { FC, useState } from 'react';
import { Box, Button, Divider } from '@mui/material';
import AuthContainer from '../components/authContainer';
import Registration from '../components/registration';
import { fetchUserRegister } from '../redux/reducers/usersSlice';
import { useAppDispatch } from '../redux/hooks';

interface RegisterPageType {
  setIsRegistered: (value: boolean) => void
}

const RegisterPage: FC<RegisterPageType> = ({ setIsRegistered }) => {
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

  const handleRegistrationSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event?.preventDefault();
    dispatch(
      fetchUserRegister({
        username: event.currentTarget.username.value,
        password: event.currentTarget.password.value,
        email: event.currentTarget.email.value,
      })
    );
    setTimeout(() => {
      setIsRegistered(true);
    }, 2000);
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

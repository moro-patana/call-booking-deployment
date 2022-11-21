import { FC, useState } from 'react';
import { Box, Button, Divider } from '@mui/material';
import AuthContainer from '../components/authContainer';
import Registration from '../components/registration';
import { fetchUserRegister } from '../redux/reducers/usersSlice';
import { useAppDispatch } from '../redux/hooks';

const RegisterPage: FC<any> = ({ setIsRegistered }) => {
  const dispatch = useAppDispatch();
  const [accountRegister, setAccountRegister] = useState({
    username: '',
    password: '',
    email: '',
  });
  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAccountRegister({
      ...accountRegister,
      username: e.target.value,
    });
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAccountRegister({
      ...accountRegister,
      email: e.target.value,
    });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAccountRegister({
      ...accountRegister,
      password: e.target.value,
    });
  };

  const handleRegistrationSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e?.preventDefault();
    dispatch(
      fetchUserRegister({
        username: e.currentTarget.username.value,
        password: e.currentTarget.password.value,
        email: e.currentTarget.email.value,
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

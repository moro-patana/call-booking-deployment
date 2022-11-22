import { FC, useState } from 'react';
import { Box, Button, Divider, styled } from '@mui/material';
import AuthContainer from '../components/authContainer';
import Login from '../components/Login';
import { fetchUserLogin, userErrorLogin } from '../redux/reducers/usersSlice';
import { useAppDispatch } from '../redux/hooks';
import SpinnerIcon from '../components/spinner';
import { useSelector } from 'react-redux';

interface LoginPageType {
  setIsRegistered: (value: boolean) => void
  setIsLoggedIn: (value: boolean) => void | boolean
  status: string
}

const LoginPage: FC<LoginPageType> = ({ setIsRegistered, setIsLoggedIn, status }) => {
  const dispatch = useAppDispatch();
  const error = useSelector(userErrorLogin)
  const [ login, setLogin ] = useState({
    email: "",
    password: ""
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    dispatch(
      fetchUserLogin({
        email: event.currentTarget.email.value,
        password: event.currentTarget.password.value,
      })
    )
    setIsLoggedIn(true);
  }

  const emailErrorMessage =
    error?.message?.toString()
      ? 'Email is not found.'
      : ''

  const passwordErrorMessage =
    error?.message?.toString()
      ? 'Password is incorrect. Try again!'
      : ''

  const errorMessages = {
    email: emailErrorMessage,
    password: passwordErrorMessage,
  }

  return (
    <AuthContainer heading={'Login to book'}>
      <div>
        {status === "loading"
          ? <SpinnerIcon action={"Login"} />
          : <div>
            <Login
                email={login.email}
                password={login.password}
                emailErr={errorMessages.email}
                passwordErr={errorMessages.password}
                emailChange={
                  (event: React.ChangeEvent<HTMLInputElement>) => 
                    setLogin({...login, email: event.target.value})
                }
                passwordChange={
                  (event: React.ChangeEvent<HTMLInputElement>) => 
                    setLogin({...login, password: event.target.value})
                }
                onSubmit={handleSubmit}
              />
              <Box sx={{ textAlign: 'center', marginTop: '40px' }}>
                <Divider light />
                <div style={{ marginTop: '40px' }}>
                  Don't have an account? 
                  <Button
                    sx={{ color: "#000", textDecoration: "underline" }}
                    onClick={() => setIsRegistered(false)}
                  >
                    Register here
                  </Button>
                </div>
              </Box>
            </div>
        }
      </div>
    </AuthContainer>
  );
};

export default LoginPage;

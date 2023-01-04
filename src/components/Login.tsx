import { FC, useState } from 'react';
import { Box, Button, Divider } from '@mui/material';
import LoginForm from './LoginForm'
import AuthContainer  from './authContainer';
import SpinnerIcon from './spinner'
import { useAppDispatch } from '../redux/hooks';
import { userLoggedIn, fetchCurrentUser } from '../redux/reducers/usersSlice';
import { loginMutation, sendQuery } from "../graphqlHelper";


interface LoginComponentType {
  setIsSignupVisible: (value: boolean) => void
  status: string
}

const LoginComponent: FC<LoginComponentType> = ({ setIsSignupVisible, status }) => {
  const dispatch = useAppDispatch();
  const [ login, setLogin ] = useState({
    email: "",
    password: ""
  });

  const handleLoginSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event?.preventDefault();
    try {
      const res = await sendQuery(loginMutation(login.email, login.password))
      dispatch(fetchCurrentUser(res.data.data))

      dispatch(userLoggedIn(true))
      setIsSignupVisible(false)
    } catch(err) {
      console.log('error while register', err)
    }
  };

  return (
    <AuthContainer heading={'Login to book'}>
        {status === "loading"
          ? <SpinnerIcon action={"Login"} />
          : <div> 
              <LoginForm
                email={login.email}
                password={login.password}
                // emailErr={errorMessages.email}
                // passwordErr={errorMessages.password}
                emailChange={
                  (event: React.ChangeEvent<HTMLInputElement>) => 
                    setLogin({...login, email: event.target.value})
                }
                passwordChange={
                  (event: React.ChangeEvent<HTMLInputElement>) => 
                    setLogin({...login, password: event.target.value})
                }
                onSubmit={handleLoginSubmit}
              />
              <Box sx={{ textAlign: 'center', marginTop: '40px' }}>
                <Divider light />
                <div style={{ marginTop: '40px' }}>
                  Don't have an account? 
                  <Button
                    sx={{ color: "#000", textDecoration: "underline" }}
                    onClick={() => setIsSignupVisible(true)}
                  >
                    Register here
                  </Button>
                </div>
              </Box>
            </div>
        }
    </AuthContainer>
  );
};

export default LoginComponent;

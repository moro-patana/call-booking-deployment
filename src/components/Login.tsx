import { FC, useState } from 'react';
import { Box, Button, Divider } from '@mui/material';
import LoginForm from './LoginForm'
import AuthContainer  from './authContainer/AuthContainer';
import Spinner from './spinner/Spinner'
import { useAppDispatch } from '../redux/hooks';
import { userLoggedIn, fetchCurrentUser } from '../redux/reducers/usersSlice';
import { loginMutation, sendQuery } from "../graphqlHelper";
import { useNavigate } from 'react-router-dom';


interface LoginComponentType {
  status: string
}

const LoginComponent: FC<LoginComponentType> = ({ status }) => {
  const navigate = useNavigate()
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
      navigate("/my-booking");
    } catch(err) {
      console.log('error while register', err)
    }
  };

  return (
    <AuthContainer heading={'Login to book'}>
      {status === "loading"
        ? <Spinner action={"Login"} />
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
                  onClick={() => navigate("/signup")}
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

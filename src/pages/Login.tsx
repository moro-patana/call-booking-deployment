import { FC } from 'react';
import { Box, Button, Divider } from '@mui/material';
import { AuthContainer, Login, SpinnerIcon } from '../components';
import useCustomHooks from '../customHooks';

interface LoginPageType {
  setIsRegistered: (value: boolean) => void
  setIsLoggedIn: (value: boolean) => void | boolean
  status: string
}

const LoginPage: FC<LoginPageType> = ({ setIsRegistered, status }) => {
  const {
    handleLoginSubmit,
    errorMessages,
    login,
    setLogin
  } = useCustomHooks()

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
                onSubmit={handleLoginSubmit}
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

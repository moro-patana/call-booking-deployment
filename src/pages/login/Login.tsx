import { useNavigate } from 'react-router-dom';
import { Alert, Box, Divider, Snackbar, Typography } from '@mui/material';
import { LoginSocialGoogle, IResolveParams } from 'reactjs-social-login';
import { GoogleLoginButton } from 'react-social-login-buttons';
import { useCookies } from 'react-cookie';
import { ErrorMessage } from '../../utils/types';
import { loginMutation, sendQuery } from "../../graphqlHelper";
import { useAppDispatch } from '../../redux/hooks';
import { setCurrentUser, setUserLoggedIn } from '../../redux/reducers/usersSlice';

import styles from './login.module.css';

interface ErrorMessageStateType {
  errorMessage: ErrorMessage;
  setErrorMessage: (value: ErrorMessage) => void;
}

const Login = ({ errorMessage, setErrorMessage } : ErrorMessageStateType) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [cookies, setCookie] = useCookies(['currentUser']);
  const { container, heading, alert, paragraph, buttonWrapper, googleButton, divider } = styles;

  const onLoginResolve = async ({ data }: IResolveParams) => {
    try {
      if (data) {
        const { name, email, sub, access_token, picture, hd, expires_in } = data;
        const res = await sendQuery(loginMutation(name, email, sub, access_token, picture, hd, expires_in));
        dispatch(setCurrentUser(res.data.data));
        dispatch(setUserLoggedIn(true));
        setCookie('currentUser', res.data.data, { path: '/' });
        navigate("/");
      }
    } catch (error) {
      setErrorMessage(error);
    }
  };

  return (
    <Box className={container}>
      <Typography className={heading} variant='h3'>Log in</Typography>
      <Typography className={paragraph}>
        Welcome to Onja Call Booking App. 
        { cookies?.currentUser?.login ? 
          `You currently logged in with ${cookies.currentUser?.login?.email}. You can create another account using a different Onja Google account` 
          : `Before you see the calendar, please sign in with your Onja google account.`
        }
      </Typography>
      <Box className={buttonWrapper}>
        <LoginSocialGoogle
          client_id={process.env.REACT_APP_GG_APP_ID || ''}
          redirect_uri={process.env.REDIRECT_URI}
          scope="openid profile email"
          discoveryDocs="claims_supported"
          access_type="offline"
          onResolve={onLoginResolve}
          onReject={error => setErrorMessage(error)}
        >
          <GoogleLoginButton className={googleButton} />
        </LoginSocialGoogle>
      </Box>
      <Divider orientation='horizontal' className={divider}/>
      <Typography className={paragraph}>
        If you don’t have a Google account yet, please
        contact the Onja google workspace administrators to create one for you.
      </Typography>
      {!!errorMessage && (
        <Snackbar
          open
          autoHideDuration={6000}
          onClose={() => setErrorMessage(false)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          key={'bottom right'}
        >
          <Alert severity="error" className={alert}>
            An error has occured when trying to log in with google. Please try again but if it persists, contact one of the devs.
          </Alert>
        </Snackbar>
      )}
    </Box>
  );
};

export default Login;

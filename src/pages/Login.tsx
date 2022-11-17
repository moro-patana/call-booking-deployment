import { Box } from '@mui/material';
import AuthContainer from '../components/authContainer';
import Login from '../components/Login';

const LoginPage = () => {
  return (
    <AuthContainer heading={'Login to book'}>
      <div>
        <Login />
        <Box sx={{ textAlign: 'center', marginTop: '24px' }}>
          Don't have an account? Register here
        </Box>
      </div>
    </AuthContainer>
  );
};

export default LoginPage;

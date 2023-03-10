import { useEffect } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import { useCookies } from "react-cookie";
import './App.css';

import Login from './pages/login/Login';
import Calendar from './pages/calendar/Calendar';

function App() {
  // TODO: Move this logic to the header component once it's built
  const [cookies] = useCookies();
  const { currentUser } = cookies;
  const navigate = useNavigate();
  // Redirect to login page if not logged in
  useEffect(() => {
    if (!currentUser?.login) navigate('/login');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser, navigate]);

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Calendar />} />
    </Routes>
  )
};

export default App;

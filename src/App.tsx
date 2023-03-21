import { Route, Routes } from 'react-router-dom';
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";

import { HOME, LOGIN, LOGOUT } from './constants/path';

import Login from './pages/login/Login';
import Calendar from './pages/calendar/Calendar';
import './App.css';


function App() {
  return (
    <Routes>
      <Route path={LOGIN} element={<Login />} />
      <Route path={HOME} element={<Calendar />} />
      <Route path={LOGOUT} element={<Login />} />
    </Routes>
  )
};

export default App;

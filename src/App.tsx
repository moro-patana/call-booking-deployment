import { Route, Routes } from 'react-router-dom';
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";

import Login from './pages/login/Login';
import Calendar from './pages/calendar/Calendar';
import './App.css';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Calendar />} />
      <Route path="/logout" element={<Login />} />
    </Routes>
  )
};

export default App;

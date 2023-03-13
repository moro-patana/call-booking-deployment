import { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import './App.css';

import Login from './pages/login/Login';
import Calendar from './pages/calendar/Calendar';
import { ErrorMessage } from './utils/types';

function App() {
  const [errorMessage, setErrorMessage] = useState<ErrorMessage>("");
  return (
    <Routes>
      <Route path="/login" element={<Login errorMessage={errorMessage} setErrorMessage={setErrorMessage} />} />
      <Route path="/" element={<Calendar errorMessage={errorMessage} setErrorMessage={setErrorMessage} />} />
    </Routes>
  )
};

export default App;

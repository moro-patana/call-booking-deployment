import { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import './App.css';

import LoginComponent from './components/Login';
import RegisterComponent from './components/Register';
import Calendar from './pages/Calendar';

function App() {
  const [errorMessage, setErrorMessage] = useState("");

  return (
    <Routes>
      <Route
        path="/login"
        element={
          <LoginComponent
            status={'notLoading'} // TODO: Implement properly via Redux state
            setErrorMessage={setErrorMessage}
          />
        }
      />
      <Route path="/signup" element={<RegisterComponent setErrorMessage={setErrorMessage} />} />
      <Route path="/" element={<Calendar errorMessage={errorMessage} setErrorMessage={setErrorMessage} />} />
    </Routes>
  )
};

export default App;

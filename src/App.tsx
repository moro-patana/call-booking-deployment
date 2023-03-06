import { Route, Routes } from 'react-router-dom';
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import './App.css';

import LoginComponent from './components/Login';
import RegisterComponent from './components/Register';
import Calendar from './pages/Calendar';

function App() {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <LoginComponent
            status={'notLoading'} // TODO: Implement properly via Redux state
          />
        }
      />
      <Route path="/signup" element={<RegisterComponent />} />
      <Route path="/" element={<Calendar />} />
    </Routes>
  )
};

export default App;

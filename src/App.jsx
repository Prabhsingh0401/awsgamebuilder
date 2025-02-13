import React, { useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Spinthewheel from './Components/Spinthewheel/Spinthewheel';
import Quiz from './Components/Quiz/Quiz';
import Mario from './Components/Mario/Mario';
import Home from './Components/Home/Home';
import RegistrationOverlay from './Components/RegistrationOverlay/RegistrationOverlay';
import Ludo from './Components/Ludo/Ludo';
import { PointsProvider } from './Components/PointsDisplay/PointsDisplay';
import Detective from './Components/Detective/Detective';

function App() {
  const [showOverlay, setShowOverlay] = useState(false);
  const [redirectPath, setRedirectPath] = useState('/');
  const [registeredUser, setRegisteredUser] = useState(null);
  const navigate = useNavigate();

  const handlePlayGame = (path) => {
    setRedirectPath(path); 
    if (!registeredUser) {
      setShowOverlay(true); 
    } else {
      navigate(path); 
    }
  };

  const handleRegister = (user) => {
    console.log('User Registered:', user); 
    setRegisteredUser(user); 
    setShowOverlay(false); 
    navigate(redirectPath);
  };

  const handleCloseOverlay = () => {
    setShowOverlay(false); 
  };

  return (
    <PointsProvider user={registeredUser}>
      <div className="App">
        {showOverlay && (
          <RegistrationOverlay
            onRegister={handleRegister}
            onClose={handleCloseOverlay}
          />
        )}
        <Routes>
          <Route path="/" element={<Home onPlayGame={handlePlayGame} />} />
          <Route path="/SpinTheWheel" element={<Spinthewheel />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/mario" element={<Mario />} />
          <Route path="/ludo" element={<Ludo />} />
          <Route path="/detective" element={<Detective />} />
        </Routes>
      </div>
    </PointsProvider>
  );
}

export default App;

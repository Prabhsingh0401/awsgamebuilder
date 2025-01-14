import React, { useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Spinthewheel from './Components/Spinthewheel/Spinthewheel';
import Quiz from './Components/Quiz/Quiz';
import Mario from './Components/Mario/Mario';
import Home from './Components/Home/Home';
import RegistrationOverlay from './Components/RegistrationOverlay/RegistrationOverlay';
import Ludo from './Components/Ludo/Ludo';
import Detective from './Components/Detective/Detective';
function App() {
  const [showOverlay, setShowOverlay] = useState(false);
  const [redirectPath, setRedirectPath] = useState('/');
  const navigate = useNavigate();

  const handlePlayGame = (path) => {
    setRedirectPath(path); // Set the path of the game to redirect after registration
    setShowOverlay(true); // Show the registration overlay
  };

  const handleRegister = (formData) => {
    console.log('User Registered:', formData); // Handle user registration (e.g., save to a database)
    setShowOverlay(false);
    navigate(redirectPath); // Redirect to the selected game after registration
  };

  const handleCloseOverlay = () => {
    setShowOverlay(false);
  };

  return (
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
  );
}

export default App;

import React from 'react'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Spinthewheel from './Components/Spinthewheel/Spinthewheel'
import Quiz from './Components/Quiz/Quiz'
import Mario from './Components/Mario/Mario'
import Home from './Components/Home/Home'


function App() {
  return (
    <Router>
      <div className="App">     
        <Routes>
        <Route path="/" element={
            <>
              <Home />
            </>
          } />
          <Route path="/SpinTheWheel" element={
            <>
              <Spinthewheel />
            </>
          } />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/mario" element={<Mario />} />
        
        </Routes>
      </div>
    </Router>
  )
}

export default App
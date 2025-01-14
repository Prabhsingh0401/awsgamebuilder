import React, { useState, useEffect, useRef } from 'react';
import './Ludo.css';
import constitutionalQuestions from '../../data/LudoQuesitons.json';

const ConstitutionalLudo = () => {
  const [diceNumber, setDiceNumber] = useState(1);
  const [currentPosition, setCurrentPosition] = useState(0);
  const [showQuestion, setShowQuestion] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const audioRef = useRef(null); // To control audio playback

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.play();
    }
  }, []);

  const rollDice = () => {
    const newDiceNumber = Math.floor(Math.random() * 6) + 1;
    setDiceNumber(newDiceNumber);
    setShowQuestion(true);
    setCurrentQuestion(constitutionalQuestions[Math.floor(Math.random() * constitutionalQuestions.length)]);
  };

  const handleAnswer = (selectedIndex) => {
    if (selectedIndex === currentQuestion.correctAnswer) {
      setCurrentPosition(prev => Math.min(prev + diceNumber, 100));
      alert("Correct! Move forward.");
    } else {
      alert("Wrong answer! Stay in your position.");
    }
    setShowQuestion(false);
  };

  return (
    <div className="constitutional-ludo">
      <h1 className='constitution-title'>Constitutional Ludo</h1>
      
      <audio ref={audioRef} src="/Joshua McLean - Mountain Trials  NO COPYRIGHT 8-bit Music.mp3" loop />
      
      <div className="game-board">
        {[...Array(100)].map((_, index) => (
          <div
            key={index}
            className={`board-cell ${currentPosition === index ? 'current-position' : ''}`}
          >
            {index + 1}
          </div>
        ))}
      </div>

      <div className="game-controls">
        <div className="dice" onClick={rollDice}>
          {diceNumber}
        </div>
        <button className="roll" onClick={rollDice} disabled={showQuestion}>Roll Dice</button>
      </div>

      {showQuestion && currentQuestion && (
        <div className="question-modal">
          <h3 className='question-list'>{currentQuestion.question}</h3>
          <div className="options">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(index)}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ConstitutionalLudo;

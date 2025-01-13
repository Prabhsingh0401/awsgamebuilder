import React, { useState } from 'react';
import './Ludo.css';

const ConstitutionalLudo = () => {
  const [diceNumber, setDiceNumber] = useState(1);
  const [currentPosition, setCurrentPosition] = useState(0);
  const [showQuestion, setShowQuestion] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(null);

  // Sample constitutional questions
  const constitutionalQuestions = [
    {
      question: "Which Article of Indian Constitution abolishes Untouchability?",
      options: ["Article 16", "Article 17", "Article 18", "Article 19"],
      correct: 1
    },
    {
      question: "When was the Indian Constitution adopted?",
      options: ["26 January 1950", "15 August 1947", "26 November 1949", "30 January 1948"],
      correct: 2
    },
    {
      question: "Which Schedule of the Constitution contains provisions for anti-defection?",
      options: ["8th Schedule", "9th Schedule", "10th Schedule", "11th Schedule"],
      correct: 2
    },
    {
      question: "Which Article of the Constitution deals with Right to Education?",
      options: ["Article 21A", "Article 22", "Article 23", "Article 24"],
      correct: 0
    },
    {
      question: "Which Part of Indian Constitution deals with Fundamental Rights?",
      options: ["Part II", "Part III", "Part IV", "Part V"],
      correct: 1
    }
  ];

  const rollDice = () => {
    const newDiceNumber = Math.floor(Math.random() * 6) + 1;
    setDiceNumber(newDiceNumber);
    setShowQuestion(true);
    setCurrentQuestion(constitutionalQuestions[Math.floor(Math.random() * constitutionalQuestions.length)]);
  };

  const handleAnswer = (selectedIndex) => {
    if (selectedIndex === currentQuestion.correct) {
      setCurrentPosition(prev => Math.min(prev + diceNumber, 100));
      alert("Correct! Move forward.");
    } else {
      alert("Wrong answer! Stay in your position.");
    }
    setShowQuestion(false);
  };

  return (
    <div className="constitutional-ludo">
      <h1>Constitutional Ludo</h1>
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
        <button onClick={rollDice} disabled={showQuestion}>Roll Dice</button>
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
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
      correctAnswer: 1
    },
    {
      question: "When was the Indian Constitution adopted?",
      options: ["26 January 1950", "15 August 1947", "26 November 1949", "30 January 1948"],
      correctAnswer: 2
    },
    {
      question: "Which Schedule of the Constitution contains provisions for anti-defection?",
      options: ["8th Schedule", "9th Schedule", "10th Schedule", "11th Schedule"],
      correctAnswer: 2
    },
    {
      question: "Which Article of the Constitution deals with Right to Education?",
      options: ["Article 21A", "Article 22", "Article 23", "Article 24"],
      correctAnswer: 0
    },
    {
      question: "Which Part of Indian Constitution deals with Fundamental Rights?",
      options: ["Part II", "Part III", "Part IV", "Part V"],
      correctAnswer: 1
    },
    {
      question: "Who is known as the Father of the Indian Constitution?",
      options: ["Mahatma Gandhi", "Dr. B.R. Ambedkar", "Jawaharlal Nehru", "Sardar Vallabhbhai Patel"],
      correctAnswer: 1
    },
    {
      question: "How many Fundamental Duties are listed in the Constitution?",
      options: ["9", "10", "11", "12"],
      correctAnswer: 2
    },
    {
      question: "Which Article of the Constitution provides for the Election Commission?",
      options: ["Article 320", "Article 324", "Article 326", "Article 329"],
      correctAnswer: 1
    },
    {
      question: "Which language is listed in the 8th Schedule of the Constitution?",
      options: ["English", "Tulu", "Sindhi", "Rajasthani"],
      correctAnswer: 2
    },
    {
      question: "What is the maximum age prescribed for election as President of India?",
      options: ["60 years", "70 years", "No maximum age", "65 years"],
      correctAnswer: 2
    },
    {
      question: "Which Article of the Constitution is related to Equality before Law?",
      options: ["Article 14", "Article 15", "Article 16", "Article 17"],
      correctAnswer: 0
    },
    {
      question: "Which amendment is referred to as the Mini-Constitution?",
      options: ["42nd Amendment", "44th Amendment", "52nd Amendment", "73rd Amendment"],
      correctAnswer: 0
    },
    {
      question: "What does the term 'Secular' in the Preamble mean?",
      options: ["Freedom of Religion", "No Official Religion", "Both A and B", "None of the above"],
      correctAnswer: 2
    },
    {
      question: "How many Articles did the original Constitution have?",
      options: ["395", "396", "400", "401"],
      correctAnswer: 0
    },
    {
      question: "What is the tenure of the Lok Sabha?",
      options: ["4 years", "5 years", "6 years", "7 years"],
      correctAnswer: 1
    }
  ];

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

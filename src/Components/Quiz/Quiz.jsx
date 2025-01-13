import { useState, useEffect } from "react";
import "./Quiz.css";

const questions = [
  {
    question: "The Right to Freedom of Speech and Expression is mentioned under which Article?",
    options: ["Article 18", "Article 19(1)(a)", "Article 21", "Article 22"],
    correctAnswer: "Article 19(1)(a)",
  },
  {
    question: "Which part of the Constitution deals with Fundamental Rights?",
    options: ["Part I", "Part II", "Part III", "Part IV"],
    correctAnswer: "Part III",
  },
  {
    question: "Who is known as the Father of the Indian Constitution?",
    options: ["Mahatma Gandhi", "Jawaharlal Nehru", "B. R. Ambedkar", "Sardar Patel"],
    correctAnswer: "B. R. Ambedkar",
  },
  {
    question: "Which Article of the Constitution deals with the Election Commission of India?",
    options: ["Article 280", "Article 324", "Article 356", "Article 368"],
    correctAnswer: "Article 324",
  },
  {
    question: "Which is the longest written Constitution in the world?",
    options: ["USA", "India", "Russia", "Brazil"],
    correctAnswer: "India",
  },
  {
    question: "Who is the first President of India?",
    options: ["Jawaharlal Nehru", "Dr. Rajendra Prasad", "Dr. S. Radhakrishnan", "Dr. Zakir Husain"],
    correctAnswer: "Dr. Rajendra Prasad",
  },
  {
    question: "In which year did the Constitution of India come into effect?",
    options: ["1947", "1950", "1949", "1952"],
    correctAnswer: "1950",
  },
  {
    question: "Which Article of the Indian Constitution gives the right to equality?",
    options: ["Article 14", "Article 15", "Article 16", "Article 17"],
    correctAnswer: "Article 14",
  },
  {
    question: "Which is the last amendment of the Indian Constitution?",
    options: ["104th", "105th", "106th", "110th"],
    correctAnswer: "105th",
  },
];

function App() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [timeLeft, setTimeLeft] = useState(30);
  const [showRules, setShowRules] = useState(true);

  useEffect(() => {
    if (!showRules && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);

      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      handleTimeout();
    }
  }, [timeLeft, showRules]);

  const handleOptionClick = (option) => {
    setSelectedOption(option);

    if (option === questions[currentQuestionIndex].correctAnswer) {
      setScore(score + 1);
    }

    setTimeout(() => {
      setSelectedOption(null);
      loadNextQuestion();
    }, 1000);
  };

  const handleTimeout = () => {
    setTimeout(() => {
      loadNextQuestion();
    }, 1000);
  };

  const loadNextQuestion = () => {
    setTimeLeft(30);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setShowScore(true);
    }
  };

  const startQuiz = () => {
    setShowRules(false);
  };

  return (
    <div className="main">
      <div className="container">
        {showRules ? (
          <div className="rules-container">
            <h1 className="samvidhan">Samvidhan Showdown</h1>
    
        
            <button className="start-button" onClick={startQuiz}>
              Start Quiz
            </button>
          </div>
        ) : showScore ? (
          <div className="score-container">
            <h2>Your Score: {score} / {questions.length}</h2>
          </div>
        ) : (
          <div className="question-container">
            <div className="timer-bar">
              <div
                className="timer-progress"
                style={{ width: `${(timeLeft / 30) * 100}%` }}
              ></div>
            </div>
            <h2 className="question">{questions[currentQuestionIndex].question}</h2>
            <div className="options-container">
              {questions[currentQuestionIndex].options.map((option, index) => (
                <button
                  key={index}
                  className={`option-button ${
                    selectedOption === option ? "selected" : ""
                  }`}
                  onClick={() => handleOptionClick(option)}
                >
                  {option}
                </button>
              ))}
            </div>
            <p className="timer-text">Time Left: {timeLeft}s</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;

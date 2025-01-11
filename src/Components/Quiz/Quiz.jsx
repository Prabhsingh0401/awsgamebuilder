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
  // New questions added:
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
  const [playerName, setPlayerName] = useState("");
  const [playerAge, setPlayerAge] = useState("");
  const [quizStarted, setQuizStarted] = useState(false);

  useEffect(() => {
    if (quizStarted && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);

      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      handleTimeout();
    }
  }, [timeLeft, quizStarted]);

  const handleStartQuiz = () => {
    if (playerName.trim() && playerAge.trim()) {
      setQuizStarted(true);
    }
  };

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

  return (
    <div className="main">
    <div className="container">
      <h1 className="quiz-title">Constitution Quiz Time</h1>
      {!quizStarted ? (
        <div className="start-section">
          <div className="quizdetailssection">
            <div className="input-wrapper">
              <h2 className="welcome">Welcome to the Quiz!</h2>
              <p className="information">Enter your name and age to get started:</p>
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="Your Name"
                className="player-name-input"
              />
              <input
                type="text"
                value={playerAge}
                onChange={(e) => setPlayerAge(e.target.value)}
                placeholder="Your Age"
                className="player-age-input"
              />
              <button
                className="start-button"
                onClick={handleStartQuiz}
                disabled={!playerName.trim() || !playerAge.trim()}
              >
                Start Quiz
              </button>
              
            </div>
            <div className="vertical-line"></div>
            <div className="rules-section">
              <p className="rulesgame">Rules of the game are</p>
              <div className="rules">
                <p>1. You will have 30 seconds to answer each question.</p>
                <p>2. Each correct answer will earn you 1 point.</p>
                <p>3. There are a total of 9 questions.</p>
              </div>
            </div>
          </div>
        </div>
      ) : showScore ? (
        <div className="score-section">
          <h2 className="congo">Congratulations, {playerName}!</h2>
          <p>Your Score: {score}/{questions.length}</p>
          <button className="retry-button" onClick={() => window.location.reload()}>
            Restart Quiz
          </button>
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

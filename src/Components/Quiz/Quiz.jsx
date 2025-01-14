import React, { useState, useEffect } from "react";
import { usePoints, PointsDisplay } from "../PointsDisplay/PointsDisplay";
import quizData from "../../data/quizData.json";
import "./Quiz.scss";

function Quiz() {
  const { addPoints, subtractPoints, points, savePoints } = usePoints(); // Access savePoints
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [timeLeft, setTimeLeft] = useState(30);
  const [showRules, setShowRules] = useState(true);
  const [leaderboard, setLeaderboard] = useState([]); // Initialize as an empty array

  const questions = quizData.quiz.questions;

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

  useEffect(() => {
    if (showScore) {
      savePoints(points);
      fetchLeaderboard(); // Fetch leaderboard data when quiz ends
    }
  }, [showScore, points, savePoints]);

  const fetchLeaderboard = async () => {
    try {
      const response = await fetch("http://localhost:5000/leaderboard");
      if (response.ok) {
        const data = await response.json();
        console.log(data); // Log the data to inspect its structure

        // Check if the data has a leaderboard array and process it
        if (Array.isArray(data.leaderboard)) {
          const leaderboardData = data.leaderboard.map((user) => ({
            ...user,
            points: user.points || 0, // Default points to 0 if missing
          }));
          setLeaderboard(leaderboardData);
        } else {
          console.error("Leaderboard data is not in the expected format");
        }
      } else {
        console.error("Failed to fetch leaderboard data");
      }
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
    }
  };

  const handleOptionClick = (option) => {
    setSelectedOption(option);

    if (option === questions[currentQuestionIndex].correctAnswer) {
      setScore(score + 1);
      addPoints(10);
    } else {
      subtractPoints(2);
    }

    setTimeout(() => {
      setSelectedOption(null);
      loadNextQuestion();
    }, 1000);
  };

  const handleTimeout = () => {
    subtractPoints(2);
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
      <PointsDisplay />
      <div className="container">
        {showRules ? (
          <div className="rules-container">
            <h1 className="samvidhan">{quizData.quiz.title}</h1>
            <button className="start-button" onClick={startQuiz}>
              Start Quiz
            </button>
          </div>
        ) : showScore ? (
          <div className="score-container">
            <div className="leaderboard-container">
              <h3>Leaderboard ✨</h3>
              {leaderboard.length === 0 ? (
                <p>No data available</p>
              ) : (
                <table className="leaderboard-table">
                  <thead>
                    <tr>
                      <th>Rank 🏆</th>
                      <th>Names 😀</th>
                      <th>Points 🥇</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaderboard.map((user, index) => (
                      <tr key={user.email}>
                        <td>{index + 1}</td>
                        <td>{user.name}</td>
                        <td>{user.points}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
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

export default Quiz;

import React from "react";
import { useQuiz } from "../context/QuizContext";
import { QUIZ_DATA } from "../data/quizData";
import { ResultItem } from "./ResultItem";

export const ResultsScreen: React.FC = () => {
  const { score, answers, retakeQuiz } = useQuiz();

  const percentage = Math.round((score / QUIZ_DATA.length) * 100);

  const getScoreMessage = () => {
    if (percentage === 100) return "Perfect Score! Outstanding! 🌟";
    if (percentage >= 80) return "Excellent! Well done! 👏";
    if (percentage >= 60) return "Good job! Keep practicing! 💪";
    if (percentage >= 40) return "Not bad! Try again to improve! 📚";
    return "Practice makes perfect! 🚀";
  };

  return (
    <div className="screen active">
      <div className="results-content">
        <h1>Quiz Complete! 🎉</h1>
        <div className="final-score">
          <span className="score-value">{score}</span>
          <span className="score-label">out of {QUIZ_DATA.length}</span>
        </div>
        <div className="score-percentage">
          <p>{percentage}%</p>
          <p>{getScoreMessage()}</p>
        </div>

        <div className="results-list">
          <h3>Results Summary</h3>
          {answers.map((answer, index) => (
            <ResultItem key={index} answer={answer} index={index} />
          ))}
        </div>

        <div className="results-actions">
          <button onClick={retakeQuiz} className="btn btn-primary">
            Retake Quiz
          </button>
        </div>
      </div>
    </div>
  );
};

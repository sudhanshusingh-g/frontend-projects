import React from "react";
import { useQuiz } from "../context/QuizContext";
import { QUIZ_DATA } from "../data/quizData";

export const StartScreen: React.FC = () => {
  const { startQuiz } = useQuiz();

  return (
    <div className="screen active">
      <div className="start-content">
        <h1>🎓 Knowledge Quiz</h1>
        <div className="quiz-details">
          <p className="quiz-description">
            Test your knowledge across various topics! You'll have 1 minute per
            question. Answer correctly to increase your score.
          </p>
          <div className="quiz-stats">
            <div className="stat">
              <span className="stat-label">Questions</span>
              <span className="stat-value">{QUIZ_DATA.length}</span>
            </div>
            <div className="stat">
              <span className="stat-label">Time per Question</span>
              <span className="stat-value">60s</span>
            </div>
            <div className="stat">
              <span className="stat-label">Format</span>
              <span className="stat-value">Multiple Choice</span>
            </div>
          </div>
        </div>
        <button onClick={startQuiz} className="btn btn-primary">
          Start Quiz
        </button>
      </div>
    </div>
  );
};

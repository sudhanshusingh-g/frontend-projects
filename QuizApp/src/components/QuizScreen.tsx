import React from "react";
import { useQuiz } from "../context/QuizContext";
import { QUIZ_DATA } from "../data/quizData";
import { AnswerButton } from "./AnswerButton";
import { Timer } from "./Timer";

export const QuizScreen: React.FC = () => {
  const {
    currentQuestionIndex,
    selectAnswer,
    nextQuestion,
    answered,
    getCurrentQuestion,
    answers,
  } = useQuiz();

  const question = getCurrentQuestion();
  if (!question) return null;

  const progress = ((currentQuestionIndex + 1) / QUIZ_DATA.length) * 100;
  const currentAnswer = answers[currentQuestionIndex];
  const selectedAnswer = currentAnswer?.selected;
  const isCorrect = currentAnswer?.isCorrect;
  const isSkipped = currentAnswer?.skipped;

  const showFeedback = answered;

  return (
    <div className="screen active">
      <div className="quiz-header">
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <div className="quiz-info">
          <span className="question-counter">
            Question {currentQuestionIndex + 1} of {QUIZ_DATA.length}
          </span>
          <Timer />
        </div>
      </div>

      <div className="quiz-content">
        <div className="question-card">
          <h2 className="question-text">{question.question}</h2>
          <div className="answers-list">
            {question.answers.map((answer) => (
              <AnswerButton
                key={answer}
                answer={answer}
                onClick={selectAnswer}
                disabled={answered}
                isSelected={answer === selectedAnswer}
                isCorrect={answer === question.correctAnswer}
                showCorrect={showFeedback}
                isSkipped={isSkipped}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="quiz-footer">
        <button
          onClick={nextQuestion}
          className="btn btn-primary"
          disabled={!answered}
        >
          Next Question
        </button>
      </div>
    </div>
  );
};

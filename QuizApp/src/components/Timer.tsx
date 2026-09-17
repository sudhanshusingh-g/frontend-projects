import React, { useEffect } from "react";
import { useQuiz } from "../context/QuizContext";
import { TIME_LIMIT } from "../data/quizData";

export const Timer: React.FC = () => {
  const { timeLeft, updateTimeLeft, answered, skipQuestion } = useQuiz();

  useEffect(() => {
    if (answered || timeLeft <= 0) return;

    const interval = setInterval(() => {
      updateTimeLeft(timeLeft - 1);
      if (timeLeft - 1 <= 0) {
        skipQuestion();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft, answered, updateTimeLeft, skipQuestion]);

  const getTimerClass = () => {
    if (timeLeft <= 5) return "critical";
    if (timeLeft <= 10) return "warning";
    return "";
  };

  return (
    <div className={`timer ${getTimerClass()}`}>
      <span className="timer-display">{timeLeft}</span>s
    </div>
  );
};

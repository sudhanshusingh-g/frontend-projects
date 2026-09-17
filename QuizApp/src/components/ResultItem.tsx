import React from "react";
import { Answer } from "../types/quiz";

interface ResultItemProps {
  answer: Answer;
  index: number;
}

export const ResultItem: React.FC<ResultItemProps> = ({ answer, index }) => {
  let resultClass = answer.skipped
    ? "skipped"
    : answer.isCorrect
      ? "correct"
      : "incorrect";

  const getStatusText = () => {
    if (answer.skipped) return "Skipped";
    return answer.isCorrect ? "Correct" : "Incorrect";
  };

  const getAnswerText = () => {
    if (answer.skipped) {
      return `Correct: ${answer.correct} (Question skipped)`;
    }
    if (answer.isCorrect) {
      return `Your answer: ${answer.selected} ✓`;
    }
    return `Your answer: ${answer.selected} | Correct: ${answer.correct}`;
  };

  return (
    <div className={`result-item ${resultClass}`}>
      <div className="result-number">{index + 1}</div>
      <div className="result-text">
        <p style={{ fontWeight: "500" }}>{answer.question}</p>
        <p style={{ fontSize: "0.9em", marginTop: "5px", opacity: 0.8 }}>
          {getAnswerText()}
        </p>
      </div>
      <div className="result-status">{getStatusText()}</div>
    </div>
  );
};

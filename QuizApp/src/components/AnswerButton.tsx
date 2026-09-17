import React from "react";

interface AnswerButtonProps {
  answer: string;
  onClick: (answer: string) => void;
  disabled: boolean;
  isSelected: boolean;
  isCorrect: boolean;
  showCorrect: boolean;
  isSkipped: boolean;
}

export const AnswerButton: React.FC<AnswerButtonProps> = ({
  answer,
  onClick,
  disabled,
  isSelected,
  isCorrect,
  showCorrect,
  isSkipped,
}) => {
  let className = "answer-button";

  if (showCorrect) {
    if (isCorrect) {
      className += " correct";
    } else if (isSelected) {
      className += " incorrect";
    } else if (isSkipped && isCorrect) {
      className += " correct";
    }
  }

  return (
    <button
      className={className}
      onClick={() => onClick(answer)}
      disabled={disabled}
    >
      {answer}
    </button>
  );
};

import React, { createContext, useContext, useState, useCallback } from "react";
import { Answer, ScreenType } from "../types/quiz";
import { QUIZ_DATA, TIME_LIMIT } from "../data/quizData";

interface QuizContextType {
  // State
  currentQuestionIndex: number;
  score: number;
  answers: Answer[];
  timeLeft: number;
  answered: boolean;
  skipped: boolean;
  currentScreen: ScreenType;

  // Actions
  startQuiz: () => void;
  selectAnswer: (selectedAnswer: string) => void;
  skipQuestion: () => void;
  nextQuestion: () => void;
  retakeQuiz: () => void;
  updateTimeLeft: (time: number) => void;
  getCurrentQuestion: () => (typeof QUIZ_DATA)[0] | null;
}

const QuizContext = createContext<QuizContextType | undefined>(undefined);

export const QuizProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT);
  const [answered, setAnswered] = useState(false);
  const [skipped, setSkipped] = useState(false);
  const [currentScreen, setCurrentScreen] = useState<ScreenType>("start");

  const getCurrentQuestion = useCallback(() => {
    return QUIZ_DATA[currentQuestionIndex] || null;
  }, [currentQuestionIndex]);

  const startQuiz = useCallback(() => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setAnswers([]);
    setTimeLeft(TIME_LIMIT);
    setAnswered(false);
    setSkipped(false);
    setCurrentScreen("quiz");
  }, []);

  const selectAnswer = useCallback(
    (selectedAnswer: string) => {
      const question = getCurrentQuestion();
      if (!question || answered) return;

      const isCorrect = selectedAnswer === question.correctAnswer;
      const newAnswer: Answer = {
        questionIndex: currentQuestionIndex,
        question: question.question,
        selected: selectedAnswer,
        correct: question.correctAnswer,
        isCorrect: isCorrect,
        skipped: false,
      };

      setAnswers((prev) => [...prev, newAnswer]);
      if (isCorrect) {
        setScore((prev) => prev + 1);
      }
      setAnswered(true);
    },
    [currentQuestionIndex, answered, getCurrentQuestion],
  );

  const skipQuestion = useCallback(() => {
    const question = getCurrentQuestion();
    if (!question || answered) return;

    const newAnswer: Answer = {
      questionIndex: currentQuestionIndex,
      question: question.question,
      selected: null,
      correct: question.correctAnswer,
      isCorrect: false,
      skipped: true,
    };

    setAnswers((prev) => [...prev, newAnswer]);
    setScore((prev) => (prev > 0 ? prev - 1 : 0));
    setAnswered(true);
    setSkipped(true);
  }, [currentQuestionIndex, answered, getCurrentQuestion]);

  const nextQuestion = useCallback(() => {
    if (currentQuestionIndex + 1 >= QUIZ_DATA.length) {
      setCurrentScreen("results");
    } else {
      setCurrentQuestionIndex((prev) => prev + 1);
      setTimeLeft(TIME_LIMIT);
      setAnswered(false);
      setSkipped(false);
    }
  }, [currentQuestionIndex]);

  const retakeQuiz = useCallback(() => {
    setCurrentScreen("start");
  }, []);

  const updateTimeLeft = useCallback((time: number) => {
    setTimeLeft(time);
  }, []);

  const value: QuizContextType = {
    currentQuestionIndex,
    score,
    answers,
    timeLeft,
    answered,
    skipped,
    currentScreen,
    startQuiz,
    selectAnswer,
    skipQuestion,
    nextQuestion,
    retakeQuiz,
    updateTimeLeft,
    getCurrentQuestion,
  };

  return <QuizContext.Provider value={value}>{children}</QuizContext.Provider>;
};

export const useQuiz = () => {
  const context = useContext(QuizContext);
  if (!context) {
    throw new Error("useQuiz must be used within a QuizProvider");
  }
  return context;
};

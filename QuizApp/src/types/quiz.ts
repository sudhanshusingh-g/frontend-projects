export interface Question {
  id: number;
  question: string;
  answers: string[];
  correctAnswer: string;
}

export interface Answer {
  questionIndex: number;
  question: string;
  selected: string | null;
  correct: string;
  isCorrect: boolean;
  skipped: boolean;
}

export type ScreenType = "start" | "quiz" | "results";

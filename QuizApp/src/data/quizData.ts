import { Question } from "../types/quiz";

export const QUIZ_DATA: Question[] = [
  {
    id: 1,
    question: "What is the capital of France?",
    answers: ["London", "Berlin", "Paris", "Madrid"],
    correctAnswer: "Paris",
  },
  {
    id: 2,
    question: "Which planet is known as the Red Planet?",
    answers: ["Venus", "Mars", "Jupiter", "Saturn"],
    correctAnswer: "Mars",
  },
  {
    id: 3,
    question: "What is the largest ocean on Earth?",
    answers: [
      "Atlantic Ocean",
      "Indian Ocean",
      "Arctic Ocean",
      "Pacific Ocean",
    ],
    correctAnswer: "Pacific Ocean",
  },
  {
    id: 4,
    question: "Who wrote 'Romeo and Juliet'?",
    answers: [
      "Mark Twain",
      "William Shakespeare",
      "Jane Austen",
      "Charles Dickens",
    ],
    correctAnswer: "William Shakespeare",
  },
  {
    id: 5,
    question: "What is the smallest prime number?",
    answers: ["0", "1", "2", "3"],
    correctAnswer: "2",
  },
  {
    id: 6,
    question: "Which element has the symbol 'Au'?",
    answers: ["Silver", "Gold", "Aluminum", "Argon"],
    correctAnswer: "Gold",
  },
  {
    id: 7,
    question: "What year did the Titanic sink?",
    answers: ["1912", "1920", "1905", "1915"],
    correctAnswer: "1912",
  },
  {
    id: 8,
    question: "How many continents are there?",
    answers: ["5", "6", "7", "8"],
    correctAnswer: "7",
  },
  {
    id: 9,
    question: "What is the fastest land animal?",
    answers: ["Lion", "Cheetah", "Pronghorn Antelope", "Greyhound"],
    correctAnswer: "Cheetah",
  },
  {
    id: 10,
    question: "Which country is home to the kangaroo?",
    answers: ["New Zealand", "South Africa", "Australia", "Brazil"],
    correctAnswer: "Australia",
  },
];

export const TIME_LIMIT = 60;

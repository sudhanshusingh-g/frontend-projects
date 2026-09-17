// Quiz Questions Data
const QUIZ_DATA = [
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

// Time limit per question (in seconds)
const TIME_LIMIT = 60;

// State Management
const state = {
  currentQuestionIndex: 0,
  score: 0,
  answers: [],
  timeLeft: TIME_LIMIT,
  timerInterval: null,
  answered: false,
  skipped: false,
};

// DOM Elements
const startScreen = document.getElementById("startScreen");
const quizScreen = document.getElementById("quizScreen");
const resultsScreen = document.getElementById("resultsScreen");
const startBtn = document.getElementById("startBtn");
const nextBtn = document.getElementById("nextBtn");
const retakeBtn = document.getElementById("retakeBtn");
const questionText = document.getElementById("questionText");
const answersList = document.getElementById("answersList");
const timerDisplay = document.getElementById("timerDisplay");
const questionCounter = document.getElementById("questionCounter");
const progressFill = document.getElementById("progressFill");
const finalScore = document.getElementById("finalScore");
const scorePercentage = document.getElementById("scorePercentage");
const scoreMessage = document.getElementById("scoreMessage");
const resultsList = document.getElementById("resultsList");
const timerElement = document.querySelector(".timer");

// Initialize event listeners
startBtn.addEventListener("click", startQuiz);
nextBtn.addEventListener("click", nextQuestion);
retakeBtn.addEventListener("click", retakeQuiz);

/**
 * Start the quiz
 */
function startQuiz() {
  resetState();
  showScreen("quizScreen");
  loadQuestion();
}

/**
 * Reset state to initial values
 */
function resetState() {
  state.currentQuestionIndex = 0;
  state.score = 0;
  state.answers = [];
  state.timeLeft = TIME_LIMIT;
  state.answered = false;
  state.skipped = false;
  clearInterval(state.timerInterval);
}

/**
 * Show a specific screen and hide others
 */
function showScreen(screenName) {
  startScreen.classList.remove("active");
  quizScreen.classList.remove("active");
  resultsScreen.classList.remove("active");
  document.getElementById(screenName).classList.add("active");
}

/**
 * Load and display the current question
 */
function loadQuestion() {
  const question = getCurrentQuestion();

  if (!question) {
    showResults();
    return;
  }

  // Reset question state
  state.answered = false;
  state.skipped = false;
  state.timeLeft = TIME_LIMIT;
  nextBtn.disabled = true;

  // Update question display
  questionText.textContent = question.question;
  questionCounter.textContent = `Question ${state.currentQuestionIndex + 1} of ${QUIZ_DATA.length}`;

  // Update progress bar
  const progress = ((state.currentQuestionIndex + 1) / QUIZ_DATA.length) * 100;
  progressFill.style.width = progress + "%";

  // Load answers
  loadAnswers(question);

  // Clear timer classes
  timerElement.classList.remove("warning", "critical");

  // Start timer
  startTimer();
}

/**
 * Get the current question object
 */
function getCurrentQuestion() {
  return QUIZ_DATA[state.currentQuestionIndex];
}

/**
 * Load and display answer buttons
 */
function loadAnswers(question) {
  answersList.innerHTML = "";

  question.answers.forEach((answer) => {
    const button = document.createElement("button");
    button.textContent = answer;
    button.className = "answer-button";
    button.addEventListener("click", () =>
      selectAnswer(answer, question.correctAnswer),
    );
    answersList.appendChild(button);
  });
}

/**
 * Handle answer selection
 */
function selectAnswer(selectedAnswer, correctAnswer) {
  if (state.answered) return;

  state.answered = true;
  clearInterval(state.timerInterval);

  const isCorrect = selectedAnswer === correctAnswer;

  // Record answer
  state.answers.push({
    questionIndex: state.currentQuestionIndex,
    question: getCurrentQuestion().question,
    selected: selectedAnswer,
    correct: correctAnswer,
    isCorrect: isCorrect,
    skipped: false,
  });

  // Update score
  if (isCorrect) {
    state.score++;
  }

  // Show visual feedback
  showAnswerFeedback(selectedAnswer, correctAnswer, isCorrect);

  // Enable next button
  nextBtn.disabled = false;
}

/**
 * Show visual feedback for the selected answer
 */
function showAnswerFeedback(selectedAnswer, correctAnswer, isCorrect) {
  const buttons = document.querySelectorAll(".answer-button");

  buttons.forEach((button) => {
    button.disabled = true;

    if (button.textContent === selectedAnswer) {
      button.classList.add(isCorrect ? "correct" : "incorrect");
    } else if (button.textContent === correctAnswer && !isCorrect) {
      button.classList.add("correct");
    }
  });
}

/**
 * Start the timer for the current question
 */
function startTimer() {
  state.timerInterval = setInterval(() => {
    state.timeLeft--;
    timerDisplay.textContent = state.timeLeft;

    // Add warning classes based on time remaining
    timerElement.classList.remove("warning", "critical");
    if (state.timeLeft <= 10 && state.timeLeft > 5) {
      timerElement.classList.add("warning");
    } else if (state.timeLeft <= 5) {
      timerElement.classList.add("critical");
    }

    // Auto-skip if time runs out
    if (state.timeLeft <= 0) {
      skipQuestion();
    }
  }, 1000);
}

/**
 * Skip the current question (when timer runs out)
 */
function skipQuestion() {
  if (state.answered) return;

  clearInterval(state.timerInterval);
  state.answered = true;
  state.skipped = true;

  const correctAnswer = getCurrentQuestion().correctAnswer;

  // Record answer as skipped
  state.answers.push({
    questionIndex: state.currentQuestionIndex,
    question: getCurrentQuestion().question,
    selected: null,
    correct: correctAnswer,
    isCorrect: false,
    skipped: true,
  });

  // Decrement score for skipped question
  if (state.score > 0) {
    state.score--;
  }

  // Show visual feedback for skipped question
  const buttons = document.querySelectorAll(".answer-button");
  buttons.forEach((button) => {
    button.disabled = true;
    if (button.textContent === correctAnswer) {
      button.classList.add("correct");
    } else {
      button.classList.add("skipped");
    }
  });

  // Enable next button
  nextBtn.disabled = false;
}

/**
 * Move to the next question
 */
function nextQuestion() {
  state.currentQuestionIndex++;
  loadQuestion();
}

/**
 * Show final results
 */
function showResults() {
  showScreen("resultsScreen");

  const percentage = Math.round((state.score / QUIZ_DATA.length) * 100);

  // Update score display
  finalScore.textContent = state.score;
  scorePercentage.textContent = percentage + "%";

  // Update message based on score
  if (percentage === 100) {
    scoreMessage.textContent = "Perfect Score! Outstanding! 🌟";
  } else if (percentage >= 80) {
    scoreMessage.textContent = "Excellent! Well done! 👏";
  } else if (percentage >= 60) {
    scoreMessage.textContent = "Good job! Keep practicing! 💪";
  } else if (percentage >= 40) {
    scoreMessage.textContent = "Not bad! Try again to improve! 📚";
  } else {
    scoreMessage.textContent = "Practice makes perfect! 🚀";
  }

  // Display results list
  displayResultsList();
}

/**
 * Display the detailed results for each question
 */
function displayResultsList() {
  resultsList.innerHTML = "";

  state.answers.forEach((answer, index) => {
    const resultItem = document.createElement("div");
    resultItem.className = `result-item ${answer.skipped ? "skipped" : answer.isCorrect ? "correct" : "incorrect"}`;

    const numberBadge = document.createElement("div");
    numberBadge.className = "result-number";
    numberBadge.textContent = index + 1;

    const textDiv = document.createElement("div");
    textDiv.className = "result-text";

    const questionP = document.createElement("p");
    questionP.style.fontWeight = "500";
    questionP.textContent = answer.question;

    const answerP = document.createElement("p");
    answerP.style.fontSize = "0.9em";
    answerP.style.marginTop = "5px";
    answerP.style.opacity = "0.8";

    if (answer.skipped) {
      answerP.textContent = `Correct: ${answer.correct} (Question skipped)`;
    } else if (answer.isCorrect) {
      answerP.textContent = `Your answer: ${answer.selected} ✓`;
    } else {
      answerP.textContent = `Your answer: ${answer.selected} | Correct: ${answer.correct}`;
    }

    textDiv.appendChild(questionP);
    textDiv.appendChild(answerP);

    const statusBadge = document.createElement("div");
    statusBadge.className = "result-status";
    statusBadge.textContent = answer.skipped
      ? "Skipped"
      : answer.isCorrect
        ? "Correct"
        : "Incorrect";

    resultItem.appendChild(numberBadge);
    resultItem.appendChild(textDiv);
    resultItem.appendChild(statusBadge);

    resultsList.appendChild(resultItem);
  });
}

/**
 * Retake the quiz
 */
function retakeQuiz() {
  showScreen("startScreen");
}

// Initialize app
showScreen("startScreen");

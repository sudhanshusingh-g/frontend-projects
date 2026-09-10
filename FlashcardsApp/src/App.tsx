import { useState } from "react";
import "./App.css";

const flashcards = [
  {
    question: "What does HTML stand for?",
    answer:
      "HyperText Markup Language, the standard markup language for creating web pages.",
  },
  {
    question: "What is CSS used for?",
    answer:
      "CSS is used to style and layout web pages, controlling colors, spacing, and typography.",
  },
  {
    question: "What is JavaScript?",
    answer:
      "JavaScript is a programming language that adds interactivity and dynamic behavior to websites.",
  },
  {
    question: "What is a React component?",
    answer:
      "A React component is a reusable UI building block that can render output and manage state.",
  },
  {
    question: "Why are flashcards useful for learning?",
    answer:
      "Flashcards encourage active recall and repetition, which helps strengthen memory retention.",
  },
];

function App() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const currentCard = flashcards[currentIndex];
  const progress = ((currentIndex + 1) / flashcards.length) * 100;

  const flipCard = () => setIsFlipped((prev) => !prev);

  const goToCard = (index: number) => {
    setCurrentIndex(index);
    setIsFlipped(false);
  };

  const goToPrevious = () => {
    if (currentIndex > 0) {
      goToCard(currentIndex - 1);
    }
  };

  const goToNext = () => {
    if (currentIndex === flashcards.length - 1) {
      goToCard(0);
      return;
    }

    goToCard(currentIndex + 1);
  };

  return (
    <main className="app-shell">
      <header className="app-header">
        <p className="eyebrow">Study smarter</p>
        <h1>Flashcards</h1>
      </header>

      <section className="progress-panel" aria-label="Flashcard progress">
        <div className="progress-meta">
          <span>
            Card {currentIndex + 1} of {flashcards.length}
          </span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="progress-bar" aria-hidden="true">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
      </section>

      <section className="flashcard-stage">
        <button
          type="button"
          className={`flashcard ${isFlipped ? "is-flipped" : ""}`}
          onClick={flipCard}
          aria-label={isFlipped ? "Show question" : "Reveal answer"}
        >
          <div className="flashcard-inner">
            <div className="flashcard-face flashcard-front">
              <span className="card-label">Question</span>
              <p>{currentCard.question}</p>
            </div>

            <div className="flashcard-face flashcard-back">
              <span className="card-label">Answer</span>
              <p>{currentCard.answer}</p>
            </div>
          </div>
        </button>
      </section>

      <nav className="controls" aria-label="Flashcard navigation">
        <button
          type="button"
          className="nav-btn"
          onClick={goToPrevious}
          disabled={currentIndex === 0}
        >
          Previous
        </button>

        <button type="button" className="primary-btn" onClick={flipCard}>
          {isFlipped ? "Hide answer" : "Flip card"}
        </button>

        <button type="button" className="nav-btn" onClick={goToNext}>
          {currentIndex === flashcards.length - 1 ? "Restart" : "Next"}
        </button>
      </nav>
    </main>
  );
}

export default App;

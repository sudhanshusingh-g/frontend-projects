import React from "react";
import { QuizProvider, useQuiz } from "./context/QuizContext";
import { StartScreen } from "./components/StartScreen";
import { QuizScreen } from "./components/QuizScreen";
import { ResultsScreen } from "./components/ResultsScreen";
import "./App.css";

const QuizContent: React.FC = () => {
  const { currentScreen } = useQuiz();

  return (
    <div className="container">
      {currentScreen === "start" && <StartScreen />}
      {currentScreen === "quiz" && <QuizScreen />}
      {currentScreen === "results" && <ResultsScreen />}
    </div>
  );
};

function App() {
  return (
    <QuizProvider>
      <QuizContent />
    </QuizProvider>
  );
}

export default App;

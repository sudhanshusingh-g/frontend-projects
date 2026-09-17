# React Quiz App 🎓

A modern, interactive quiz application built with React, TypeScript, and Vite.

## Features

✨ **Start Screen** - Welcome screen with quiz overview and statistics
📝 **Quiz Questions** - 10 diverse multiple-choice questions
⏱️ **1-Minute Timer** - 60-second countdown per question with auto-skip
🎯 **Immediate Feedback** - Color-coded answers (green for correct, red for incorrect)
📊 **Score Tracking** - Real-time score calculation with a 1-point penalty for skipped questions
🏆 **Results Screen** - Comprehensive summary with scores, percentages, and detailed feedback
🔄 **Retake Option** - Reset and try again with a fresh score
📱 **Responsive Design** - Works seamlessly on desktop and mobile devices

## Project Structure

```
QuizApp/
├── src/
│   ├── components/          # React components
│   │   ├── StartScreen.tsx
│   │   ├── QuizScreen.tsx
│   │   ├── ResultsScreen.tsx
│   │   ├── AnswerButton.tsx
│   │   ├── Timer.tsx
│   │   └── ResultItem.tsx
│   ├── context/
│   │   └── QuizContext.tsx  # Quiz state management
│   ├── data/
│   │   └── quizData.ts      # Quiz questions
│   ├── types/
│   │   └── quiz.ts          # TypeScript interfaces
│   ├── App.tsx              # Main app component
│   ├── App.css              # Application styles
│   ├── index.css            # Global styles
│   └── main.tsx             # React entry point
├── index.html               # HTML template
├── package.json
├── tsconfig.json            # TypeScript configuration
├── vite.config.ts           # Vite configuration
└── eslint.config.js         # ESLint configuration
```

## State Management

The app uses **React Context API** with custom hooks for state management:

- **QuizContext** - Manages all quiz state including:
  - Current question index
  - Score and answers
  - Timer state
  - Current screen (start/quiz/results)
  - Quiz actions (start, answer, skip, next, retake)

## Installation & Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```
   The app will open automatically at `http://localhost:5173`

3. **Build for production:**
   ```bash
   npm run build
   ```

4. **Preview production build:**
   ```bash
   npm run preview
   ```

## How to Use

1. **Start** - Click "Start Quiz" on the welcome screen
2. **Answer** - Select one of the four answers for each question
3. **Feedback** - Immediately see if your answer was correct (green) or incorrect (red)
4. **Skip** - If the 60-second timer runs out, the question auto-skips (penalties score by 1)
5. **Results** - View your final score, percentage, and detailed results for each question
6. **Retake** - Start over with a fresh quiz

## Key React Concepts Used

- **Functional Components** - All components are function-based
- **React Hooks** - useState, useEffect, useContext, useCallback
- **Context API** - Global state management without Redux
- **Custom Hooks** - useQuiz hook for accessing quiz context
- **Components Composition** - Reusable ButtonButton, Timer, and ResultItem components
- **TypeScript** - Full type safety with interfaces

## Customization

### Add More Questions

Edit [src/data/quizData.ts](src/data/quizData.ts) and add questions to the `QUIZ_DATA` array:

```typescript
{
  id: 11,
  question: "Your question here?",
  answers: ["Option 1", "Option 2", "Option 3", "Option 4"],
  correctAnswer: "Correct Option"
}
```

### Change Timer Duration

Update `TIME_LIMIT` in [src/data/quizData.ts](src/data/quizData.ts):

```typescript
export const TIME_LIMIT = 60; // Change to desired seconds
```

### Modify Styling

All styles are in [src/App.css](src/App.css) and [src/index.css](src/index.css). Customize colors, fonts, and layouts as needed.

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Technologies

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Fast build tool
- **CSS3** - Styling and animations

## License

MIT

import { useState } from 'react';
import { useProgression } from '../store/useProgression';

const QUESTIONS = [
  {
    difficulty: 'easy',
    q: "What does 'FKN' usually mean in HSE context?",
    options: ["Faculty of Knowledge", "Faculty of Computer Science", "Funny Kittens Network"],
    a: 1
  },
  {
    difficulty: 'easy',
    q: "When you try to exit Vim, what happens?",
    options: ["You successfully exit", "You reboot the PC", "You generate random characters in fear"],
    a: 2
  },
  {
    difficulty: 'medium',
    q: "Is mayonnaise an instrument?",
    options: ["Yes, Patrick", "No"],
    a: 1
  },
  {
    difficulty: 'medium',
    q: "What does 'Yandex Minus' stand for?",
    options: ["A discount tier", "The opposite of Plus", "When your code is so bad it removes features"],
    a: 2
  },
  {
    difficulty: 'hard',
    q: "How many hours of sleep does a hackathon participant get?",
    options: ["8", "0-2", "-1 (Time debt)"],
    a: 2
  }
];

export default function Quiz() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [message, setMessage] = useState('');
  const { updateQuizProgress, quizProgress } = useProgression();

  const handleAnswer = (idx) => {
    const question = QUESTIONS[currentIdx];
    if (idx === question.a) {
      // anti-farm: earn less if you've answered a lot
      const diffCount = quizProgress[question.difficulty];
      let reward = 20;
      if (diffCount > 2) reward = 10;
      if (diffCount > 5) reward = 2; // diminishing returns
      
      updateQuizProgress(question.difficulty, reward);
      setMessage(`Correct! +${reward} coins.`);
    } else {
       setMessage("Wrong. Skill issue.");
    }
    
    setTimeout(() => {
        setMessage('');
        setCurrentIdx((currentIdx + 1) % QUESTIONS.length); 
    }, 1500);
  };

  const question = QUESTIONS[currentIdx];

  return (
    <div className="p-4 bg-yellow-900/40 border-2 border-yellow-500 rounded text-center">
      <h3 className="text-xl font-bold mb-2">Pop Quiz</h3>
      <p className="text-sm opacity-80 mb-4">Answer questions to farm coins. Don't spam, rewards decrease over time.</p>
      
      {!message ? (
        <div>
          <p className="mb-4 font-semibold text-lg">{question.q}</p>
          <div className="flex flex-col gap-2">
            {question.options.map((opt, idx) => (
              <button 
                key={idx}
                className="btn-primary hover:bg-yellow-600 transition"
                onClick={() => handleAnswer(idx)}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-2xl font-bold p-8 animate-pulse">
            {message}
        </div>
      )}
    </div>
  );
}

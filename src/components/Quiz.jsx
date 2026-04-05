import { useState } from 'react';
import { useProgression } from '../store/useProgression';

const QUESTIONS = [
  {
    difficulty: 'easy',
    q: "Что обычно означает 'ФКН' в контексте ВШЭ?",
    options: ["Факультет карточных игр", "Факультет компьютерных наук", "Сеть забавных котят"],
    a: 1
  },
  {
    difficulty: 'easy',
    q: "Что происходит, когда вы пытаетесь выйти из Vim?",
    options: ["Вы успешно выходите", "Вы перезагружаете ПК", "Вы в ужасе печатаете случайные символы"],
    a: 2
  },
  {
    difficulty: 'medium',
    q: "Является ли майонез музыкальным инструментом?",
    options: ["Да, Патрик", "Нет"],
    a: 1
  },
  {
    difficulty: 'medium',
    q: "Что означает 'Яндекс Минус'?",
    options: ["Скидочный уровень", "Противоположность Плюсу", "Когда твой код настолько плох, что удаляет фичи"],
    a: 2
  },
  {
    difficulty: 'hard',
    q: "Сколько часов спит участник хакатона?",
    options: ["8", "0-2", "-1 (Временной долг)"],
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
      setMessage(`Верно! +${reward} монет.`);
    } else {
       setMessage("Неправильно. Проблема навыка (Skill issue).");
    }
    
    setTimeout(() => {
        setMessage('');
        setCurrentIdx((currentIdx + 1) % QUESTIONS.length); 
    }, 1500);
  };

  const question = QUESTIONS[currentIdx];

  return (
    <div className="p-4 bg-yellow-900/40 border-2 border-yellow-500 rounded text-center">
      <h3 className="text-xl font-bold mb-2">Внезапная викторина</h3>
      <p className="text-sm opacity-80 mb-4">Отвечай на вопросы, чтобы фармить монеты. Не спамь, награда со временем уменьшается.</p>
      
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

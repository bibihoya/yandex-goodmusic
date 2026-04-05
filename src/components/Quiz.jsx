import { useState } from 'react';
import { useProgression } from '../store/useProgression';

const SMART_QUESTIONS = [
  {
    q: "Что утверждает условие Линдеберга?",
    options: [
      "Все случайные величины должны быть одинаково распределены",
      "Среднее каждой величины равно нулю",
      "Вклад больших отклонений в сумму становится пренебрежимо малым"
    ],
    a: 2
  },
  {
    q: "Что делает преобразование Фурье?",
    options: [
      "Находит производную функции",
      "Переводит сигнал из временной области в частотную",
      "Считает среднее значение функции"
    ],
    a: 1
  },
  {
    q: "Что не является настоящей теоремой?",
    options: [
      "Теорема о волосатом шаре",
      "Теорема о бутерброде с ветчиной",
      "Крайняя предельная теорема",
      "Теорема о пьяном мужике"
    ],
    a: 2
  },
  {
    q: "Что такое syscall с точки зрения механизма?",
    options: [
      "Функция из стандартной библиотеки (libc)",
      "Прерывание/инструкция, переводящая выполнение из user mode в kernel mode",
      "Любой вызов функции в программе"
    ],
    a: 1
  }
];

const NOT_SMART_QUESTIONS = [
  {
    q: "Что нужно делать, если в аудитории нет маркеров?",
    options: ["Сходить в соседнюю", "Отменить лекцию", "Жать красную кнопку"],
    a: 0
  },
  {
    q: "Какие 2 животных объединяется в триппи-троппи-троппа-триппа?",
    options: ["Рыба и корова", "Кот и креветка", "Богомол и лошадь"],
    a: 1
  },
  {
    q: "Кто снимался в рекламе Яндекс Мопа?",
    options: ["Том Круз", "Тимоти Шаламе", "Райан Гослинг", "Юра Борисов"],
    a: 2
  },
  {
    q: "“Гомоморфный образ группы в честь … изоморфен фактор-группе по ядру гомоморфизма”",
    options: ["Победы коммунизма", "Свержения марксизма", "Отмены гомосексуализма"],
    a: 0
  },
  {
    q: "Как расшифровывается ПМИ?",
    options: ["Прикладная музыка и искусство", "Плейбой-математик-интеллектуал", "Пиво мартини игристое"],
    a: 1
  }
];

export default function Quiz() {
  const [mode, setMode] = useState('smart'); // 'smart' or 'dumb'
  const [currentIdx, setCurrentIdx] = useState(0);
  const [message, setMessage] = useState('');
  const { updateQuizProgress, quizProgress } = useProgression();

  const questions = mode === 'smart' ? SMART_QUESTIONS : NOT_SMART_QUESTIONS;
  const question = questions[currentIdx] || questions[0];

  const handleAnswer = (idx) => {
    if (idx === question.a) {
      // Simplified reward logic for the new types
      const reward = mode === 'smart' ? 30 : 15;
      updateQuizProgress(mode, reward);
      setMessage(`Верно! +${reward} функоинов`);
    } else {
      setMessage("Неправильно. Проблема навыка (Skill issue).");
    }
    
    setTimeout(() => {
        setMessage('');
        setCurrentIdx((prev) => (prev + 1) % questions.length); 
    }, 1500);
  };

  const handleModeChange = (newMode) => {
    setMode(newMode);
    setCurrentIdx(0);
    setMessage('');
  };

  return (
    <div className="p-4 bg-yellow-900/40 border-2 border-yellow-500 rounded text-center flex flex-col min-h-[350px]">
      <h3 className="text-xl font-bold mb-1">Викторина ВШЭ</h3>
      
      <div className="flex justify-center gap-2 mb-4">
        <button 
          onClick={() => handleModeChange('smart')}
          className={`px-3 py-1 text-xs rounded-full font-bold transition ${mode === 'smart' ? 'bg-yellow-500 text-black' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
        >
          🧠 УМНОЕ
        </button>
        <button 
          onClick={() => handleModeChange('dumb')}
          className={`px-3 py-1 text-xs rounded-full font-bold transition ${mode === 'dumb' ? 'bg-pink-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
        >
          🤡 НЕУМНОЕ
        </button>
      </div>

      <p className="text-[10px] opacity-70 mb-4 uppercase tracking-widest">
        {mode === 'smart' ? 'Режим для гигачадов матана' : 'Режим для ценителей мемов'}
      </p>
      
      {!message ? (
        <div className="flex-1 flex flex-col">
          <p className="mb-6 font-semibold text-base leading-snug">{question.q}</p>
          <div className="flex flex-col gap-2 mt-auto">
            {question.options.map((opt, idx) => (
              <button 
                key={idx}
                className="btn-primary py-2 text-sm hover:scale-[1.02] transition-transform active:scale-95"
                onClick={() => handleAnswer(idx)}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-xl font-bold p-8 animate-pulse text-yellow-400">
            {message}
        </div>
      )}
    </div>
  );
}

import React, { useEffect } from 'react';
import { useProgression } from './store/useProgression';
import Player from './components/Player';
import Shop from './components/Shop';
import Quiz from './components/Quiz';
import SnakeGame from './games/SnakeGame';
import Roulette from './games/Roulette';
import DevLog from './components/DevLog';
import YandexMusicClone from './components/YandexMusicClone';
import './index.css';

function ErrorBoundaryFallback({ error }) {
  return (
    <div className="p-8 bg-red-900 text-white font-mono h-screen flex flex-col items-center justify-center">
      <h1 className="text-4xl mb-4 text-yellow-300">ФАТАЛЬНАЯ СИСТЕМНАЯ ОШИБКА</h1>
      <p className="mb-4">Музыка остановилась. Как и дерево React.</p>
      <pre className="bg-black/50 p-4 rounded max-w-2xl overflow-auto">{error.message}</pre>
      <button 
        className="mt-8 px-6 py-2 bg-yellow-500 text-black font-bold hover:bg-yellow-400"
        onClick={() => window.location.reload()}
      >
        Перезагрузить систему
      </button>
    </div>
  );
}

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return <ErrorBoundaryFallback error={this.state.error} />;
    }
    return this.props.children;
  }
}

function FakeAd() {
  const { uiState } = useProgression();
  if (!uiState.adsEnabled) return null;

  return (
    <a 
      href="https://hse-tex.me/course-2/mathematical-analysis.pdf" 
      target="_blank" 
      rel="noreferrer"
      className="fixed top-20 right-10 w-64 bg-yellow-400 border-4 border-red-500 p-4 text-center z-40 transform rotate-3 shadow-2xl animate-pulse text-black cursor-pointer hover:scale-105 transition-transform block"
    >
      <h3 className="font-extrabold text-xl text-red-600 flash">🚀 ВЫИГРАЙ 1 000 000 ФУНКОИНОВ!</h3>
      <p className="text-xs mb-2">Кликни здесь, чтобы забрать свой ежедневный приз в R.Казино!*</p>
      <p className="text-[10px] opacity-70">*Не ведись, это матан!</p>
      <p className="mt-2 text-sm font-bold opacity-80">(Купи 'Антирекламу', чтобы убрать меня)</p>
    </a>
  );
}

function RedButtonEffect() {
  const { redButtonNonce } = useProgression();
  const [active, setActive] = useState(false);
  
  useEffect(() => {
    if (redButtonNonce > 0) {
      setActive(true);
      const s1 = new Audio('/flashbang-gah-dayum.mp3');
      const s2 = new Audio('/headshot_1.mp3');
      s1.play().catch(() => {});
      s2.play().catch(() => {});
      
      const timer = setTimeout(() => {
        setActive(false);
      }, 1600);
      
      return () => clearTimeout(timer);
    }
  }, [redButtonNonce]);

  if (!active) return null;

  return (
    <div key={redButtonNonce} className="fixed inset-0 z-[10000] flex items-center justify-center bg-black animate-red-button-overlay">
       <video 
         src="/gustokashin.MP4" 
         autoPlay 
         className="max-h-screen w-full object-contain"
       />
    </div>
  );
}

function SideBannersRight() {
  const { uiState } = useProgression();
  if (uiState.theme === 'yandex_music') return null;

  return (
    <div className="hidden xl:flex fixed right-4 top-0 bottom-0 w-[200px] flex-col justify-around py-8 pointer-events-none opacity-80 z-0">
        <img 
           src="/linal.png" 
           alt="Linal" 
           className="w-full object-contain animate-bounce drop-shadow-[0_0_15px_rgba(30,144,255,0.8)]" 
           style={{ animationDuration: '3s' }} 
         />
         <img 
           src="/sokolov.png" 
           alt="Sokolov" 
           className="w-full object-contain animate-pulse drop-shadow-[0_0_15px_rgba(255,69,0,0.8)]" 
           style={{ animationDuration: '4s' }} 
         />
    </div>
  );
}

function VipBanners() {
  const { purchasedUpgrades } = useProgression();

  // Убираем шакальные VIP бейджи, если куплен нормальный дизайн
  if (purchasedUpgrades.includes('design_upgrade') || purchasedUpgrades.includes('yandex_music_unlock')) return null;

  return (
    <div className="hidden xl:flex fixed left-4 top-0 bottom-0 w-[200px] flex-col justify-around py-8 pointer-events-none opacity-80 z-0">
       {Array.from({ length: 4 }).map((_, i) => (
         <img 
           key={i} 
           src="/VIP.png" 
           alt="VIP" 
           className="w-full object-contain animate-bounce drop-shadow-[0_0_15px_rgba(255,215,0,0.8)]" 
           style={{ animationDelay: `${i * 0.3}s`, animationDuration: '2s' }} 
         />
       ))}
    </div>
  );
}

function MainContent() {
  const { uiState, playlist } = useProgression();

  useEffect(() => {
    // Intercept F5 or Ctrl+R to play an insane animation before reloading
    const handleKeyDown = (e) => {
      if (e.key === 'F5' || (e.ctrlKey && e.key === 'r') || (e.metaKey && e.key === 'r')) {
        e.preventDefault();
        document.body.classList.add('animate-crazy-refresh');
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Show snake game always in the broken view
  const isSnakeAvailable = true;

  if (uiState.theme === 'yandex_music') {
    return <YandexMusicClone />;
  }

  return (
    <div className={`min-h-screen theme-${uiState.theme} font-${uiState.font} transition-colors duration-1000 overflow-x-hidden p-6 relative flex flex-col items-center`}>
      <header className="w-full max-w-6xl flex justify-between items-center py-4 mb-8">
        <h1 className="text-4xl font-extrabold tracking-tighter">
          Yandex <span className="text-red-500 drop-shadow-md">Minus</span>
        </h1>
        {uiState.theme === 'premium' && (
           <a 
              href="https://www.youtube.com/watch?v=dQw4w9WgXcQ" 
              target="_blank" rel="noreferrer"
              className="text-yellow-400 animate-bounce font-bold"
           >
             ✨ Получить нормальную версию ✨
           </a>
        )}
      </header>

      <FakeAd />
      <VipBanners />
      <SideBannersRight />
      <RedButtonEffect />
      <DevLog />

      <main className="w-full max-w-6xl flex flex-col md:flex-row gap-8 relative z-10">
        {/* Left Column: Player and Games */}
        <div className="flex-1 flex flex-col gap-6">
          <Player />
          
          <div className="grid md:grid-cols-2 gap-4">
            {isSnakeAvailable && <SnakeGame />}
            <Quiz />
          </div>
          
          {/* New Game: Roulette */}
          <div className="w-full">
            <Roulette />
          </div>
        </div>

        {/* Right Column: Shop */}
        <div className="w-full md:w-[350px]">
          <Shop />
        </div>
      </main>
      
      <footer className="mt-16 text-center text-sm opacity-50 pb-8">
        <p>Абсолютно рабочий, совершенно не сломанный макет для хакатона Hackathon.</p>
        <p>Внимание: Содержит высокий уровень фич.</p>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <MainContent />
    </ErrorBoundary>
  );
}

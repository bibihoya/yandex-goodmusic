import React, { useEffect } from 'react';
import { useProgression } from './store/useProgression';
import Player from './components/Player';
import Shop from './components/Shop';
import Quiz from './components/Quiz';
import SnakeGame from './games/SnakeGame';
import DevLog from './components/DevLog';
import './index.css';

function ErrorBoundaryFallback({ error }) {
  return (
    <div className="p-8 bg-red-900 text-white font-mono h-screen flex flex-col items-center justify-center">
      <h1 className="text-4xl mb-4 text-yellow-300">FATAL SYSTEM ERROR</h1>
      <p className="mb-4">The music stopped. And so did the React tree.</p>
      <pre className="bg-black/50 p-4 rounded max-w-2xl overflow-auto">{error.message}</pre>
      <button 
        className="mt-8 px-6 py-2 bg-yellow-500 text-black font-bold hover:bg-yellow-400"
        onClick={() => window.location.reload()}
      >
        Reboot System
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
    <div className="fixed top-20 right-10 w-64 bg-yellow-400 border-4 border-red-500 p-4 text-center z-40 transform rotate-3 shadow-2xl animate-pulse text-black">
      <h3 className="font-extrabold text-xl text-red-600 flash">🚀 WIN 1,000,000 COINS!</h3>
      <p className="text-xs mb-2">Click here to claim your daily prize at R.Casino!*</p>
      <p className="text-[10px] opacity-70">*Actually you can't click because it's a fake ad.</p>
      <p className="mt-2 text-sm font-bold">(Buy 'Ad-Free' to remove me!)</p>
    </div>
  );
}

function MainContent() {
  const { uiState, playlist } = useProgression();

  // Show snake game strictly if playlist is empty or if they are in 'beta/stable/premium'
  const isSnakeAvailable = playlist.length === 0 || uiState.theme !== 'terrible';

  return (
    <div className={`min-h-screen theme-${uiState.theme} transition-colors duration-1000 overflow-x-hidden p-6 relative flex flex-col items-center`}>
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
             ✨ Get Normal Version ✨
           </a>
        )}
      </header>

      <FakeAd />
      <DevLog />

      <main className="w-full max-w-6xl flex flex-col md:flex-row gap-8">
        {/* Left Column: Player and Games */}
        <div className="flex-1 flex flex-col gap-6">
          <Player />
          
          <div className="grid md:grid-cols-2 gap-4">
            {isSnakeAvailable && <SnakeGame />}
            <Quiz />
          </div>
        </div>

        {/* Right Column: Shop */}
        <div className="w-full md:w-[350px]">
          <Shop />
        </div>
      </main>
      
      <footer className="mt-16 text-center text-sm opacity-50 pb-8">
        <p>A completely functional, totally not broken mockup for Yandex Minus hackathon.</p>
        <p>Warning: Contains high levels of "features".</p>
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

import { useState } from 'react';
import { useProgression } from '../store/useProgression';
import VolumeControl from './VolumeControl';
import { Play, Pause, SkipForward, SkipBack } from 'lucide-react';
import { askAIRadio } from '../api/aiRadio';

export default function Player() {
  const { playlist, uiState } = useProgression();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  
  // AI Radio state
  const [aiQuery, setAiQuery] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);

  const track = playlist[currentIdx] || "В плейлисте нет треков";

  const handleNext = () => {
      if (playlist.length === 0) return;
      setCurrentIdx((currentIdx + 1) % playlist.length);
  };

  const handlePrev = () => {
      if (playlist.length === 0) return;
      setCurrentIdx((currentIdx - 1 + playlist.length) % playlist.length);
  };

  const handleAiSearch = async () => {
      if (!aiQuery.trim()) return;
      setIsAiLoading(true);
      setAiResponse('');
      
      const res = await askAIRadio(aiQuery, uiState.aiTuned);
      setAiResponse(res);
      setIsAiLoading(false);
  };

  return (
    <div className="w-full flex w-full flex-col lg:flex-row gap-4 p-4 border-2 border-white/20 rounded-xl bg-black/60 shadow-xl backdrop-blur-sm">
      
      {/* Player Section */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 border border-blue-500/30 rounded-lg">
        <h2 className="text-2xl font-bold mb-2 truncate max-w-full">
            {track}
        </h2>
        <div className="text-sm opacity-50 mb-6">
            Занято слотов плейлиста: {playlist.length} / {uiState.maxPlaylistSize}
        </div>
        
        <div className="flex items-center gap-6 mb-4">
            <button onClick={handlePrev} className="p-3 bg-gray-700 rounded-full hover:bg-gray-600">
                <SkipBack size={24} />
            </button>
            <button onClick={() => setIsPlaying(!isPlaying)} className="p-4 bg-blue-600 rounded-full hover:bg-blue-500">
                {isPlaying ? <Pause size={32} /> : <Play size={32} />}
            </button>
            <button onClick={handleNext} className="p-3 bg-gray-700 rounded-full hover:bg-gray-600">
                <SkipForward size={24} />
            </button>
        </div>

        <VolumeControl />
        
        {playlist.length === 0 && (
            <p className="mt-4 text-orange-400 text-sm animate-pulse">
                Сыграй в Змейку, чтобы найти треки!
            </p>
        )}
      </div>

      {/* AI Radio Section */}
      <div className="flex-1 flex flex-col p-4 border border-purple-500/30 rounded-lg bg-gray-900/50">
          <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
              🤖 ИИ Радио {uiState.aiTuned ? '(Премиум)' : '(Сломано)'}
          </h3>
          <p className="text-xs mb-4 opacity-70">Попроси у ИИ рекомендацию песни или факт.</p>
          
          <div className="flex gap-2 mb-4">
              <input 
                  type="text" 
                  value={aiQuery}
                  onChange={(e) => setAiQuery(e.target.value)}
                  placeholder={uiState.aiTuned ? "Например: Посоветуй немного джаза" : "П0ВРЕЖДЕННЫЙ ВВ0Д.."}
                  className="flex-1 p-2 bg-gray-800 text-white rounded border border-gray-600"
              />
              <button 
                  onClick={handleAiSearch}
                  disabled={isAiLoading}
                  className="btn-primary whitespace-nowrap"
              >
                  {isAiLoading ? '...' : 'Спросить ИИ'}
              </button>
          </div>

          <div className="flex-1 p-3 bg-black/40 rounded border border-gray-700 text-sm overflow-y-auto min-h-[100px]">
              {aiResponse ? aiResponse : <span className="opacity-40">Ожидание запроса...</span>}
          </div>
      </div>
    </div>
  );
}

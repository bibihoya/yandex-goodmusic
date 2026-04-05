import { useState } from 'react';
import { useProgression } from '../store/useProgression';
import VolumeControl from './VolumeControl';
import { Play, Pause, SkipForward, SkipBack } from 'lucide-react';

export default function Player() {
  const { playlist, uiState } = useProgression();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const track = playlist[currentIdx] || "В плейлисте нет треков";

  const handleNext = () => {
      if (!uiState.skipsEnabled) return alert("Сначала купите возможность скипать треки!");
      if (playlist.length === 0) return;
      setCurrentIdx((currentIdx + 1) % playlist.length);
  };

  const handlePrev = () => {
      if (!uiState.skipsEnabled) return alert("Сначала купите возможность скипать треки!");
      if (playlist.length === 0) return;
      setCurrentIdx((currentIdx - 1 + playlist.length) % playlist.length);
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
            <button onClick={handlePrev} className={`p-3 rounded-full ${uiState.skipsEnabled ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-800 opacity-50 cursor-not-allowed'}`}>
                <SkipBack size={24} />
            </button>
            <button onClick={() => setIsPlaying(!isPlaying)} className="p-4 bg-blue-600 rounded-full hover:bg-blue-500">
                {isPlaying ? <Pause size={32} /> : <Play size={32} />}
            </button>
            <button onClick={handleNext} className={`p-3 rounded-full ${uiState.skipsEnabled ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-800 opacity-50 cursor-not-allowed'}`}>
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

      {/* Playlist Section Instead of AI Radio */}
      <div className="flex-1 flex flex-col p-4 border border-purple-500/30 rounded-lg bg-gray-900/50 max-h-[300px]">
          <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
              📋 Мои треки
          </h3>
          <p className="text-xs mb-4 opacity-70">
            Здесь хранятся добытые потом и кровью композиции.
          </p>

          <div className="flex-1 overflow-y-auto pr-2 space-y-2">
             {playlist.length === 0 ? (
                <div className="p-3 bg-black/40 rounded border border-gray-700 text-sm opacity-50 text-center mt-4">
                   Список пуст... Поиграй в змейку!
                </div>
             ) : (
                playlist.map((item, idx) => (
                   <div 
                     key={idx} 
                     className={`p-2 rounded text-sm border ${idx === currentIdx ? 'bg-blue-900/50 border-blue-500' : 'bg-black/40 border-gray-700'}`}
                   >
                     {idx + 1}. {item}
                   </div>
                ))
             )}
          </div>
      </div>
    </div>
  );
}

import { useState, useRef, useEffect } from 'react';
import { useProgression } from '../store/useProgression';
import { Play, Pause, SkipForward, SkipBack, Search, Home, Mic2, Heart, ListMusic, Download, Shuffle, Repeat } from 'lucide-react';

// You can plug real MP3 urls here later. Right now they are just nulls to avoid errors.
export const TRACK_SOURCES = {
  "КИНО - Группа крови": "/Группа крови.mp3", 
  "Дима Билан - Я твой номер один": "/Я твой номер один.mp3", 
  "А4 - Лама Мама": "/А4_ЛАМА_МАМА_ПРЕМЬЕРА_КЛИПА_!_.mp3", 
  "Weezer - Buddy Holly": "/Weezer - Buddy Holly (2024 Remaster).mp3", 
  "Nabeel - Lazim alshams": "/nabeel_lazim_alshams_نبيل_لازم_الشمس_Official_Audio.mp3",
  "Betsy, Мария Янковская - Сигма Бой": "/Betsy,_Мария_Янковская_Сигма_Бой_official_Audio.mp3",
  "Синтий трактор — Синий Трактор": ""
};

export default function YandexMusicClone() {
  const { playlist } = useProgression();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(50);
  
  // Base setup for real audio
  const audioRef = useRef(null);

  const trackName = playlist[currentIdx] || "Неизвестный трек";
  const trackSrc = TRACK_SOURCES[trackName] || "";

  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.volume = volume / 100;
  }, [volume]);

  useEffect(() => {
    if (!audioRef.current) return;
    if (isPlaying) {
      // Catch empty src errors gracefully
      audioRef.current.play().catch(() => {});
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying, currentIdx]);

  const handleNext = () => {
    if (playlist.length === 0) return;
    setCurrentIdx((prev) => (prev + 1) % playlist.length);
    setIsPlaying(true);
  };

  const handlePrev = () => {
    if (playlist.length === 0) return;
    setCurrentIdx((prev) => (prev - 1 + playlist.length) % playlist.length);
    setIsPlaying(true);
  };

  return (
    <div className="w-full h-screen bg-[#0a0a0a] text-white flex flex-col font-sans overflow-hidden select-none">
      
      {/* Hidden audio element ready for your physical mp3s */}
      <audio 
        ref={audioRef}
        src={trackSrc}
        onEnded={handleNext}
      />

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <aside className="w-[240px] bg-[#0a0a0a] flex flex-col text-sm font-semibold border-r border-white/10 shrink-0">
          <div className="p-6 flex items-center gap-3">
             {/* Logo SVG attempt */}
             <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center font-bold text-lg">Я</div>
             <span className="text-xl tracking-tight">Яндекс<strong className="block text-xl leading-none">Музыка</strong></span>
          </div>

          <div className="flex px-4 py-2 text-gray-400 hover:text-white cursor-pointer items-center gap-3">
             <Search size={20} /> Поиск
          </div>

          <nav className="mt-4 flex flex-col gap-1 px-2">
            <div className="flex items-center gap-3 px-3 py-2 rounded bg-white/10 text-white cursor-pointer">
               <Home size={20} /> Главная
            </div>
            <div className="flex items-center gap-3 px-3 py-2 text-gray-400 hover:text-white cursor-pointer transition">
               <Mic2 size={20} /> Подкасты и книги
            </div>
            <div className="flex items-center gap-3 px-3 py-2 text-gray-400 hover:text-white cursor-pointer transition">
               <Heart size={20} /> Детям
            </div>
            <div className="flex items-center gap-3 px-3 py-2 text-gray-400 hover:text-white cursor-pointer transition">
               <ListMusic size={20} /> Коллекция
            </div>
          </nav>

          <div className="mt-auto p-4">
             <div className="bg-white/5 rounded-xl p-4 flex flex-col gap-2">
                 <p className="text-xs text-gray-400">Музыка на Windows</p>
                 <button className="w-full py-2 bg-white/10 hover:bg-white/20 rounded text-center text-sm transition">Скачать</button>
             </div>
             <div className="mt-4 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">ВЫ</div>
                <div className="flex flex-col">
                   <span className="text-sm">Творец ФКН</span>
                   <span className="text-[10px] bg-gradient-to-r from-red-500 to-yellow-500 text-transparent bg-clip-text font-bold uppercase tracking-wider">Плюс активен</span>
                </div>
             </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 relative flex flex-col bg-[#111]">
           {/* Abstract Blur Background */}
           <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-gradient-to-br from-purple-600 via-pink-600 to-yellow-500 opacity-60 rounded-full blur-[100px] animate-vibe-pulse" />
           </div>

           <div className="flex-1 flex flex-col items-center justify-center relative z-10">
              <button 
                 onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                 onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                 onClick={() => setIsPlaying(!isPlaying)}
                 className="flex items-center gap-4 text-5xl font-bold text-white transition-all drop-shadow-2xl mb-8 group"
              >
                 {isPlaying ? <Pause size={56} fill="currentColor" /> : <Play size={56} fill="currentColor" />}
                 Моя волна
              </button>
              <button className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-full text-sm font-semibold backdrop-blur-md border border-white/5 transition flex items-center gap-2">
                  <span className="text-gray-400">≡</span> Настроить
              </button>
           </div>
        </main>
      </div>

      {/* Bottom Player Controller */}
      <footer className="h-[90px] bg-[#1a1a1a] border-t border-white/10 flex items-center px-4 justify-between shrink-0 z-50 shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
         {/* Track Info */}
         <div className="flex items-center gap-4 min-w-[300px]">
             <div className="w-14 h-14 bg-gray-800 rounded flex items-center justify-center overflow-hidden relative group">
                {/* Mock Album Art placeholder */}
                <div className="absolute inset-0 bg-gradient-to-br from-gray-700 to-black"></div>
                {isPlaying && (
                  <div className="absolute bottom-1 right-1 flex gap-0.5 h-3">
                    <div className="w-[3px] bg-white animate-pulse" style={{ animationDelay: '0.1s' }}/>
                    <div className="w-[3px] bg-white animate-pulse" style={{ animationDelay: '0.3s' }}/>
                    <div className="w-[3px] bg-white animate-pulse" style={{ animationDelay: '0.2s' }}/>
                  </div>
                )}
             </div>
             <div className="flex flex-col">
                 <div className="text-sm font-bold hover:underline cursor-pointer">{trackName}</div>
                 <div className="text-xs text-gray-400 hover:underline cursor-pointer">Yandex Minus API</div>
             </div>
             <button className="ml-4 text-gray-400 hover:text-white transition"><Heart size={20} /></button>
         </div>

         {/* Center Controls */}
         <div className="flex flex-col items-center flex-1 max-w-[500px]">
             <div className="flex items-center gap-6 mb-2">
                <button className="text-gray-400 hover:text-white"><Shuffle size={18} /></button>
                <button onClick={handlePrev} className="text-gray-200 hover:text-white"><SkipBack size={24} fill="currentColor" /></button>
                <button 
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-10 h-10 flex items-center justify-center bg-yellow-400 hover:bg-yellow-300 text-black rounded-full transition-transform hover:scale-105"
                >
                  {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-1" />}
                </button>
                <button onClick={handleNext} className="text-gray-200 hover:text-white"><SkipForward size={24} fill="currentColor" /></button>
                <button className="text-gray-400 hover:text-white"><Repeat size={18} /></button>
             </div>
             
             {/* Progress Bar (Visual Mock) */}
             <div className="w-full flex items-center gap-3 text-[11px] text-gray-400 font-mono">
                <span>0:00</span>
                <div className="flex-1 h-1 bg-gray-600 rounded-full relative cursor-pointer group">
                   <div className={`absolute left-0 top-0 h-full rounded-full bg-yellow-400 transition-all duration-1000 ${isPlaying ? 'w-[45%]' : 'w-0'}`}></div>
                   <div className="absolute top-1/2 -translate-y-1/2 -ml-1 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition shadow" style={{ left: isPlaying ? '45%' : '0%' }}></div>
                </div>
                <span>3:20</span>
             </div>
         </div>

         {/* Right Controls */}
         <div className="flex items-center justify-end gap-4 min-w-[300px]">
             <button className="text-gray-400 hover:text-white"><ListMusic size={20} /></button>
             <div className="flex items-center gap-2 group">
                 <span className="text-gray-400 group-hover:text-white">🔈</span>
                 <input 
                   type="range" 
                   min="0" 
                   max="100" 
                   value={volume}
                   onChange={(e) => setVolume(e.target.value)}
                   className="w-24 h-1 bg-gray-600 rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full cursor-pointer"
                 />
             </div>
         </div>
      </footer>
    </div>
  );
}

import { useState, useRef, useEffect } from 'react';
import { useProgression } from '../store/useProgression';
import VolumeControl from './VolumeControl';
import { Play, Pause, SkipForward, SkipBack } from 'lucide-react';
import { TRACK_SOURCES } from './YandexMusicClone';

// DSP Math for absolute trash distortion
function makeDistortionCurve(amount) {
  const k = typeof amount === 'number' ? amount : 50;
  const n_samples = 44100;
  const curve = new Float32Array(n_samples);
  const deg = Math.PI / 180;
  for (let i = 0; i < n_samples; ++i) {
    const x = (i * 2) / n_samples - 1;
    curve[i] = ((3 + k) * x * 20 * deg) / (Math.PI + k * Math.abs(x));
  }
  return curve;
}

export default function Player() {
  const { playlist, uiState, volume } = useProgression();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);
  const audioCtxRef = useRef(null);
  const sourceNodeRef = useRef(null);
  const lowpassRef = useRef(null);
  const distortionRef = useRef(null);

  const track = playlist[currentIdx] || "В плейлисте нет треков";
  const trackSrc = TRACK_SOURCES[track] || "";

  // Initialize Web Audio API and listen to volume
  useEffect(() => {
    if (!audioRef.current) return;
    
    // Create the nightmare processing chain once
    if (!audioCtxRef.current) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) {
            audioCtxRef.current = new AudioContext();
            sourceNodeRef.current = audioCtxRef.current.createMediaElementSource(audioRef.current);
            
            // 1. Muffle it (lowpass filter)
            const lowpass = audioCtxRef.current.createBiquadFilter();
            lowpass.type = "lowpass";
            lowpass.frequency.value = 600; // Sounds like playing from under water
            
            // 2. Overdrive / Clip it heavily (WaveShaper)
            const distortion = audioCtxRef.current.createWaveShaper();
            distortion.curve = makeDistortionCurve(800); 
            distortion.oversample = '4x';

            // Store nodes in refs for live updates
            lowpassRef.current = lowpass;
            distortionRef.current = distortion;

            // String them together
            sourceNodeRef.current.connect(lowpass);
            lowpass.connect(distortion);
            distortion.connect(audioCtxRef.current.destination);
        }
    }

    // Apply or remove distortion based on upgrade
    if (lowpassRef.current && distortionRef.current && audioCtxRef.current) {
        if (uiState.audioTuned) {
            // High-fidelity mode
            lowpassRef.current.frequency.setTargetAtTime(20000, audioCtxRef.current.currentTime, 0.05);
            distortionRef.current.curve = null;
        } else {
            // Trash mode
            lowpassRef.current.frequency.setTargetAtTime(600, audioCtxRef.current.currentTime, 0.05);
            distortionRef.current.curve = makeDistortionCurve(800);
        }
    }

    audioRef.current.volume = (volume || 50) / 100;
  }, [volume, uiState.audioTuned]);

  // Handle play/pause with Context Resuming
  useEffect(() => {
    if (!audioRef.current) return;
    if (isPlaying) {
      if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
         audioCtxRef.current.resume();
      }
      audioRef.current.play().catch(() => {});
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying, currentIdx]);

  const handleNext = () => {
      if (!uiState.skipsEnabled) return alert("Сначала купите возможность скипать треки!");
      if (playlist.length === 0) return;
      setCurrentIdx((currentIdx + 1) % playlist.length);
      setIsPlaying(true);
  };

  const handlePrev = () => {
      if (!uiState.skipsEnabled) return alert("Сначала купите возможность скипать треки!");
      if (playlist.length === 0) return;
      setCurrentIdx((currentIdx - 1 + playlist.length) % playlist.length);
      setIsPlaying(true);
  };

  return (
    <div className="w-full flex w-full flex-col lg:flex-row gap-4 p-4 border-2 border-white/20 rounded-xl bg-black/60 shadow-xl backdrop-blur-sm">
      <audio 
        ref={audioRef}
        src={trackSrc}
        crossOrigin="anonymous"
        onEnded={handleNext}
      />
      
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

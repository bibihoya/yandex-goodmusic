import { useState, useRef } from 'react';
import { useProgression } from '../store/useProgression';

export default function VolumeControl() {
  const { uiState } = useProgression();
  const [volume, setVolume] = useState(50);
  const containerRef = useRef(null);

  const isChaotic = uiState.volumeControlType === 'chaotic';

  const handleMouseEnter = () => {
    if (!isChaotic || !containerRef.current) return;
    // Chaotic move away from mouse occasionally
    if (Math.random() > 0.3) {
      containerRef.current.style.transform = `translate(${Math.random() * 100 - 50}px, ${Math.random() * 50 - 25}px)`;
    }
  };

  const handleChange = (e) => {
    if (isChaotic) {
      // In chaotic mode, you might not get the volume you asked for!
      const jump = Math.random() > 0.5 ? Math.random() * 80 : e.target.value;
      setVolume(jump);
      // throw an intentional silent error for DevLog
      if (Math.random() > 0.8) setTimeout(() => { throw new Error("Volume slider detached from reality"); }, 10);
    } else {
      setVolume(e.target.value);
    }
  };

  return (
    <div 
      ref={containerRef}
      className={`flex items-center gap-2 p-2 ${isChaotic ? 'chaotic-move transition-transform' : 'transition-none'} w-full max-w-xs mx-auto mt-4 bg-gray-800/50 rounded`}
      onMouseEnter={handleMouseEnter}
    >
      <span className="text-xl">🔈</span>
      <input 
        type="range" 
        min="0" 
        max="100" 
        value={volume} 
        onChange={handleChange}
        className={`flex-1 ${isChaotic ? 'cursor-chaotic' : 'cursor-pointer'}`}
      />
      <span>{Math.round(volume)}%</span>
    </div>
  );
}

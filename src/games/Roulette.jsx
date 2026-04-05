import { useState } from 'react';
import { useProgression } from '../store/useProgression';

export default function Roulette() {
  const { coins, addCoins } = useProgression();
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState(null);
  const [isFlashing, setIsFlashing] = useState(false);

  const EVENTS = [
    { label: "🐶 Моп", color: "#3b82f6", text: "Я моп я люблю яндекс", effect: 20, isLoss: false },
    { label: "🤡 Плагиат", color: "#ef4444", text: "вы попались на антиплагиате", effect: -50, isLoss: true },
    { label: "💀 SmartLMS", color: "#8b5cf6", text: "смартлмс временно не работает", effect: 'reset', isLoss: true },
    { label: "✋ Вопрос", color: "#10b981", text: "отличный вопрос!", effect: 10, isLoss: false },
    { label: "🍀 Честность", color: "#eab308", text: "Твоё вращение было таким честным, что даже теория вероятностей прослезилась.", effect: 20, isLoss: false }
  ];

  const sliceAngle = 360 / EVENTS.length;

  const getConicGradient = () => {
    let parts = [];
    EVENTS.forEach((e, i) => {
      const start = i * sliceAngle;
      const end = (i + 1) * sliceAngle;
      parts.push(`${e.color} ${start}deg ${end}deg`);
    });
    return `conic-gradient(${parts.join(', ')})`;
  };

  const handleSpin = () => {
    setIsSpinning(true);
    setResult(null);

    const targetIdx = Math.floor(Math.random() * EVENTS.length);
    const ev = EVENTS[targetIdx];
    
    // We add 5 full rotations (1800deg) for the spinning effect.
    // 0 degrees is the top. The wheel draws slice 0 starting at 12 o'clock, going clockwise.
    // The center of slice targetIdx is (targetIdx * sliceAngle) + (sliceAngle / 2).
    // To align that center to the top (which remains at 0 degrees static while the wheel spins),
    // we need to rotate the wheel backwards by that amount, which is equivalent to 360 - that angle.
    const centerOfSlice = targetIdx * sliceAngle + (sliceAngle / 2);
    const alignToTopRot = 360 - centerOfSlice;
    
    // Some randomness within the slice so it doesn't look rigged (it stops in different parts of the slice)
    const padding = 10;
    const randomWithinSlice = (Math.random() * (sliceAngle - padding * 2)) - ((sliceAngle / 2) - padding);
    
    const totalNewRotation = rotation + 1800 + alignToTopRot + randomWithinSlice;
    
    setRotation(totalNewRotation);

    setTimeout(() => {
      if (ev.effect === 'reset') {
        addCoins(-coins);
      } else {
        addCoins(ev.effect);
      }

      setResult(ev);
      setIsSpinning(false);

      if (ev.isLoss) {
        setIsFlashing(true);
        const flashSound = new Audio('/flashbang-gah-dayum.mp3');
        flashSound.play().catch((e) => console.warn("Не удалось проиграть звук:", e));
        setTimeout(() => setIsFlashing(false), 450);
      }
    }, 4000); // 4 seconds CSS transition duration
  };

  return (
    <div className="flex flex-col items-center p-4 bg-gray-900 border-2 border-red-700/50 rounded-lg text-white shadow-xl isolate relative overflow-hidden">
      {isFlashing && (
        <div className="fixed inset-0 z-[9999] bg-white flash-jumpscare flex items-center justify-center pointer-events-none">
           <img src="/job_application.jpg" alt="Job Application" className="max-h-screen object-contain drop-shadow-2xl" />
        </div>
      )}

      {/* Fake Background element */}
      <div className="absolute top-0 right-0 -m-8 w-32 h-32 bg-yellow-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
      
      <h2 className="text-xl font-bold mb-1 tracking-tight text-red-500 drop-shadow-md">Колесо Высшей Школы</h2>
      <p className="text-xs mb-4 opacity-70">Проверь свою удачу и не отчисляйся!</p>

      {/* Fortune Wheel Container */}
      <div className="relative w-64 h-64 mb-6 z-10 flex flex-col items-center">
         {/* The Top Pointer */}
         <div className="absolute top-[-15px] left-1/2 -ml-[15px] w-0 h-0 border-l-[15px] border-r-[15px] border-t-[30px] border-l-transparent border-r-transparent border-t-white z-20 drop-shadow-[0_2px_5px_rgba(0,0,0,0.8)] pointer-events-none"></div>
         
         {/* The Wheel */}
         <div 
           className="w-full h-full rounded-full overflow-hidden border-[6px] border-[#333] shadow-[0_0_20px_rgba(234,179,8,0.5)]"
           style={{ 
              background: getConicGradient(),
              transform: `rotate(${rotation}deg)`,
              transition: 'transform 4s cubic-bezier(0.2, 0.8, 0.2, 1)' 
           }}
         >
           {EVENTS.map((e, idx) => (
              <div 
                key={idx}
                className="absolute left-[50%] top-0 h-[50%] w-0 flex flex-col items-center justify-start pt-6 origin-bottom font-bold text-[10px]"
                 style={{ transform: `rotate(${idx * sliceAngle + sliceAngle/2}deg)` }}
              >
                 <span className="-ml-[35px] w-[70px] text-center text-white drop-shadow-[0_1px_3px_rgba(0,0,0,1)] uppercase tracking-tight leading-tight">
                    {e.label}
                 </span>
              </div>
           ))}
         </div>
      </div>

      <button
        onClick={handleSpin}
        disabled={isSpinning}
        className={`w-full py-4 rounded-xl font-black text-lg transition-all ${
          isSpinning 
            ? 'bg-gray-600 text-gray-400 cursor-not-allowed animate-pulse' 
            : 'bg-gradient-to-r from-yellow-500 to-orange-500 text-black hover:scale-[1.02] active:scale-95 shadow-[0_0_15px_rgba(234,179,8,0.5)] hover:shadow-[0_0_25px_rgba(234,179,8,0.8)]'
        }`}
      >
        {isSpinning ? 'ВРАЩАЕТСЯ...' : 'ИСПЫТАТЬ УДАЧУ!'}
      </button>

      {result && !isSpinning && (
        <div className={`mt-4 w-full p-3 rounded font-bold border-2 text-center text-sm ${
          !result.isLoss ? 'bg-green-900/50 border-green-500 text-green-300' : 'bg-red-900/50 border-red-500 text-red-300'
        }`}>
          {!result.isLoss 
            ? `🎉 Результат: ${result.text} (+${result.effect} функоинов)`
            : (
               <div className="flex flex-col gap-2">
                 <span>💀 {result.text} {result.effect === 'reset' ? '(обнуление кошелька)' : `(${result.effect} функоинов)`}</span>
                 <span className="opacity-80">
                    Вы проиграли душу Яндексу, пройдите 6 кругов ада месячную стажировку чтобы искупиться — <br/><a href="https://yandex.ru/yaintern" target="_blank" rel="noreferrer" className="underline font-black text-red-400 hover:text-red-200 pointer-events-auto cursor-pointer">подать заявку</a>
                 </span>
               </div>
            )
          }
        </div>
      )}
    </div>
  );
}

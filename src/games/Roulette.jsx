import { useState } from 'react';
import { useProgression } from '../store/useProgression';

export default function Roulette() {
  const { coins, addCoins } = useProgression();
  const [betAmount, setBetAmount] = useState(10);
  const [betColor, setBetColor] = useState('red');
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState(null);

  const colors = [
    { id: 'red', name: 'Красное (x2)', hex: '#dc2626' },
    { id: 'black', name: 'Черное (x2)', hex: '#1f2937' },
    { id: 'green', name: 'Зеленое (x14)', hex: '#16a34a' }
  ];

  const handleSpin = () => {
    if (betAmount <= 0) return alert("Ставка должна быть больше нуля!");
    if (coins < betAmount) return alert("Недостаточно монет для ставки!");

    setSpinning(true);
    setResult(null);

    // Снимаем монеты за ставку
    addCoins(-betAmount);

    setTimeout(() => {
      // 48% chance Red, 48% chance Black, 4% chance Green
      const roll = Math.random();
      let rollColor;
      
      if (roll < 0.04) {
        rollColor = 'green';
      } else if (roll < 0.52) {
        rollColor = 'red';
      } else {
        rollColor = 'black';
      }

      let winAmount = 0;
      if (rollColor === betColor) {
        if (rollColor === 'green') winAmount = betAmount * 14;
        else winAmount = betAmount * 2;
        addCoins(winAmount);
      }

      setResult({ color: rollColor, won: winAmount > 0, amount: winAmount });
      setSpinning(false);
    }, 2000);
  };

  return (
    <div className="flex flex-col items-center p-4 bg-gray-900 border-2 border-red-700/50 rounded-lg text-white shadow-xl isolate relative overflow-hidden">
      {/* Fake Background element */}
      <div className="absolute top-0 right-0 -m-8 w-32 h-32 bg-yellow-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
      
      <h2 className="text-xl font-bold mb-1 tracking-tight text-red-500 drop-shadow-md">R.Casino Рулетка</h2>
      <p className="text-xs mb-4 opacity-70">Спусти весь баланс или сорви джекпот!</p>

      <div className="flex w-full gap-2 mb-4">
        <input 
          type="number" 
          min="1" 
          max={coins} 
          value={betAmount} 
          onChange={(e) => setBetAmount(parseInt(e.target.value) || 0)}
          className="flex-1 p-2 bg-black text-white border border-gray-700 rounded outline-none"
        />
        <button 
          onClick={() => setBetAmount(coins)}
          className="px-3 bg-gray-700 hover:bg-gray-600 rounded text-sm transition"
        >
          All-in
        </button>
      </div>

      <div className="flex gap-2 w-full mb-6">
        {colors.map(c => (
          <button
            key={c.id}
            onClick={() => setBetColor(c.id)}
            style={{ backgroundColor: c.hex }}
            className={`flex-1 py-3 px-1 rounded font-bold text-xs shadow transition-transform ${betColor === c.id ? 'ring-4 ring-yellow-400 scale-105 z-10' : 'opacity-60 hover:opacity-100'}`}
          >
            {c.name}
          </button>
        ))}
      </div>

      <button
        onClick={handleSpin}
        disabled={spinning || coins < betAmount}
        className={`w-full py-4 rounded-xl font-black text-lg transition-all ${
          spinning 
            ? 'bg-gray-600 text-gray-400 cursor-not-allowed animate-pulse' 
            : 'bg-gradient-to-r from-yellow-500 to-orange-500 text-black hover:scale-[1.02] active:scale-95 shadow-[0_0_15px_rgba(234,179,8,0.5)] hover:shadow-[0_0_25px_rgba(234,179,8,0.8)]'
        }`}
      >
        {spinning ? 'ВРАЩАЕТСЯ...' : 'КРУТИТЬ РУЛЕТКУ!'}
      </button>

      {result && !spinning && (
        <div className={`mt-4 w-full p-3 rounded font-bold text-center border-2 ${
          result.won ? 'bg-green-900/50 border-green-500 text-green-300' : 'bg-red-900/50 border-red-500 text-red-300'
        }`}>
          {result.won 
            ? `🎉 ВЫИГРЫШ: +${result.amount} монет! (Выпало: ${colors.find(c=>c.id === result.color).name})`
            : `💀 ПРОИГРЫШ. Карты не легли. (Выпало: ${colors.find(c=>c.id === result.color).name})`
          }
        </div>
      )}
    </div>
  );
}

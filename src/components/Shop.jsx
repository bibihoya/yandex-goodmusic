import { useProgression } from '../store/useProgression';
import { ShoppingCart, Check } from 'lucide-react';

const UPGRADES = [
  { id: 'font_normal', name: 'Системный шрифт', cost: 50, desc: 'Устали от Comic Sans?' },
  { id: 'volume_slider_fixed', name: 'Починить громкость', cost: 50, desc: 'Ползунок ведет себя предсказуемо.' },
  { id: 'ad_free', name: 'Без рекламы', cost: 100, desc: 'Убрать раздражающие баннеры.' },
  { id: 'playlist_expanded_1', name: 'Расширить плейлист', cost: 100, desc: 'Увеличивает максимум треков с 3 до 6.' },
  { id: 'ai_tuning', name: 'Настройка ИИ', cost: 150, desc: 'Делает ИИ полезным, а не пассивно-агрессивным.' }
];

export default function Shop() {
  const { coins, purchasedUpgrades, purchaseUpgrade } = useProgression();

  return (
    <div className="p-4 bg-gray-800/80 rounded-lg border border-gray-600 w-full max-w-md">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <ShoppingCart /> Магазин улучшений
        </h2>
        <div className="text-xl font-bold text-yellow-400">
          💰 {coins}
        </div>
      </div>
      
      <div className="flex flex-col gap-3">
        {UPGRADES.map(upgrade => {
          const isPurchased = purchasedUpgrades.includes(upgrade.id);
          const canAfford = coins >= upgrade.cost;
          
          return (
            <div key={upgrade.id} className="flex flex-col p-3 rounded bg-gray-700/50 border border-gray-600">
              <div className="flex justify-between items-center mb-1">
                <span className="font-semibold">{upgrade.name}</span>
                <span className="text-sm font-mono text-yellow-300 ml-2 shadow-sm">
                  {isPurchased ? 'КУПЛЕНО' : `${upgrade.cost} Монет`}
                </span>
              </div>
              <div className="text-xs opacity-70 mb-2">{upgrade.desc}</div>
              
              <button 
                onClick={() => purchaseUpgrade(upgrade.id)}
                disabled={isPurchased || !canAfford}
                className={`text-sm py-1 px-3 rounded font-medium transition ${
                  isPurchased 
                    ? 'bg-green-600/50 text-white cursor-default' 
                    : canAfford 
                      ? 'bg-blue-600 hover:bg-blue-500 text-white' 
                      : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                }`}
              >
                {isPurchased ? <span className="flex items-center justify-center gap-1"><Check size={16} /> Применено</span> : 'Купить'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

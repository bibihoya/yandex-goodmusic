import { useProgression } from '../store/useProgression';
import { ShoppingCart, Check } from 'lucide-react';

const UPGRADES = [
  { id: 'font_normal', name: 'Системный шрифт', cost: 50, desc: 'Устали от Comic Sans?' },
  { id: 'volume_slider_fixed', name: 'Починить громкость', cost: 50, desc: 'Ползунок ведет себя предсказуемо.' },
  { id: 'track_skips', name: 'Разблокировать скипы', cost: 75, desc: 'Позволяет переключать треки.' },
  { id: 'audio_quality_fix', name: 'Улучшить качество звука', cost: 150, desc: 'Убирает хрипы и глухоту в плеере.' },
  { id: 'ad_free', name: 'Без рекламы', cost: 100, desc: 'Убрать раздражающие баннеры.' },
  { id: 'playlist_expanded_1', name: 'Расширить плейлист', cost: 100, desc: 'Увеличивает максимум треков с 3 до 6.' },
  { id: 'design_upgrade', name: 'Улучшить дизайн', cost: 200, desc: 'Делает сайт немного привлекательнее.' },
  { id: 'yandex_music_unlock', name: 'Настоящая Яндекс Музыка', cost: 500, desc: 'Полностью разблокировать финальный сайт.' }
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
        {UPGRADES.map((upgrade, index) => {
          const isPurchased = purchasedUpgrades.includes(upgrade.id);
          const canAfford = coins >= upgrade.cost;
          
          // Check if previous upgrade in the list was bought
          const isLocked = index > 0 && !purchasedUpgrades.includes(UPGRADES[index - 1].id);
          
          return (
            <div key={upgrade.id} className={`flex flex-col p-3 rounded border transition ${
              isLocked ? 'bg-black/20 border-gray-800 opacity-40' : 'bg-gray-700/50 border-gray-600'
            }`}>
              <div className="flex justify-between items-center mb-1">
                <span className="font-semibold">{upgrade.name}</span>
                <span className="text-sm font-mono text-yellow-300 ml-2 shadow-sm">
                  {isPurchased ? 'КУПЛЕНО' : isLocked ? '🔒 ЗАБЛОКИРОВАНО' : `${upgrade.cost} Монет`}
                </span>
              </div>
              <div className="text-xs opacity-70 mb-2">
                {isLocked ? `Сначала купите "${UPGRADES[index-1].name}"` : upgrade.desc}
              </div>
              
              <button 
                onClick={() => !isLocked && purchaseUpgrade(upgrade.id)}
                disabled={isPurchased || !canAfford || isLocked}
                className={`text-sm py-1 px-3 rounded font-medium transition ${
                  isPurchased 
                    ? 'bg-green-600/50 text-white cursor-default' 
                    : isLocked
                      ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                      : canAfford 
                        ? 'bg-blue-600 hover:bg-blue-500 text-white' 
                        : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                }`}
              >
                {isPurchased ? <span className="flex items-center justify-center gap-1"><Check size={16} /> Применено</span> : isLocked ? 'Закрыто' : 'Купить'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

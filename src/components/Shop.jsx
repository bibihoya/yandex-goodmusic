import { useProgression } from '../store/useProgression';
import { ShoppingCart, Check } from 'lucide-react';

const UPGRADES = [
  { id: 'font_normal', name: 'Purchase System Font', cost: 50, desc: 'Tired of Comic Sans?' },
  { id: 'volume_slider_fixed', name: 'Fix Volume Slider', cost: 50, desc: 'Make the slider behave predictably.' },
  { id: 'ad_free', name: 'Ad-Free Experience', cost: 100, desc: 'Remove annoying popups and banners.' },
  { id: 'playlist_expanded_1', name: 'Expand Playlist', cost: 100, desc: 'Increases max tracks from 3 to 6.' },
  { id: 'ai_tuning', name: 'AI Radio Tuning', cost: 150, desc: 'Makes the AI actually helpful instead of passive-aggressive.' }
];

export default function Shop() {
  const { coins, purchasedUpgrades, purchaseUpgrade } = useProgression();

  return (
    <div className="p-4 bg-gray-800/80 rounded-lg border border-gray-600 w-full max-w-md">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <ShoppingCart /> Upgrade Shop
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
                  {isPurchased ? 'OWNED' : `${upgrade.cost} Coins`}
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
                {isPurchased ? <span className="flex items-center justify-center gap-1"><Check size={16} /> Applied</span> : 'Buy'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

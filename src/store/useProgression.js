import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const UPGRADE_COSTS = {
  font_normal: 50,
  ad_free: 100,
  volume_slider_fixed: 50,
  playlist_expanded_1: 100,
  ai_tuning: 150
};

const getDerivedUiState = (purchases) => {
  const count = purchases.length;
  let theme = 'terrible';
  if (count >= 4) theme = 'premium';
  else if (count >= 2) theme = 'stable';
  else if (count >= 1) theme = 'beta';

  return {
    theme,
    adsEnabled: !purchases.includes('ad_free'),
    font: purchases.includes('font_normal') ? 'system' : 'comic-sans',
    bgStyle: theme === 'terrible' ? 'rainbow' : 'normal',
    volumeControlType: purchases.includes('volume_slider_fixed') ? 'normal' : 'chaotic',
    maxPlaylistSize: purchases.includes('playlist_expanded_1') ? 6 : 3,
    aiTuned: purchases.includes('ai_tuning')
  };
};

export const useProgression = create(
  persist(
    (set, get) => ({
      coins: 0,
      level: 0,
      streak: 0,
      purchasedUpgrades: [],
      playlist: [],
      quizProgress: { easy: 0, medium: 0, hard: 0 },
      snakeHighScore: 0,
      uiState: getDerivedUiState([]),

      addCoins: (amount) => set((state) => ({ coins: state.coins + amount })),
      
      purchaseUpgrade: (upgradeId) => {
        const state = get();
        const cost = UPGRADE_COSTS[upgradeId];
        if (state.coins >= cost && !state.purchasedUpgrades.includes(upgradeId)) {
          const newPurchases = [...state.purchasedUpgrades, upgradeId];
          set({
            coins: state.coins - cost,
            purchasedUpgrades: newPurchases,
            uiState: getDerivedUiState(newPurchases)
          });
        }
      },

      addTrackToPlaylist: (trackName) => set((state) => {
        if (state.playlist.length < state.uiState.maxPlaylistSize && !state.playlist.includes(trackName)) {
          return { playlist: [...state.playlist, trackName] };
        }
        return state;
      }),

      updateQuizProgress: (difficulty, coinsEarned) => set((state) => ({
        quizProgress: {
          ...state.quizProgress,
          [difficulty]: state.quizProgress[difficulty] + 1
        },
        coins: state.coins + coinsEarned
      })),

      updateSnakeHighScore: (score) => set((state) => ({
        snakeHighScore: Math.max(state.snakeHighScore, score)
      })),

      resetState: () => set({
        coins: 0,
        purchasedUpgrades: [],
        playlist: [],
        uiState: getDerivedUiState([])
      })
    }),
    {
      name: 'yandex-minus-storage',
      partialize: (state) => ({
        coins: state.coins,
        purchasedUpgrades: state.purchasedUpgrades,
        playlist: state.playlist,
        quizProgress: state.quizProgress,
        snakeHighScore: state.snakeHighScore,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.uiState = getDerivedUiState(state.purchasedUpgrades);
        }
      }
    }
  )
);

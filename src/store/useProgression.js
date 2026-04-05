import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const UPGRADE_COSTS = {
  font_normal: 50,
  volume_slider_fixed: 50,
  track_skips: 75,
  ad_free: 100,
  playlist_expanded_1: 100,
  design_upgrade: 200,
  yandex_music_unlock: 500
};

const getDerivedUiState = (purchases) => {
  const count = purchases.length;
  let theme = 'terrible';
  if (purchases.includes('yandex_music_unlock')) theme = 'yandex_music';
  else if (purchases.includes('design_upgrade')) theme = 'premium';
  else if (count >= 5) theme = 'stable';
  else if (count >= 3) theme = 'beta';
  else if (count >= 1) theme = 'terrible';

  return {
    theme,
    adsEnabled: !purchases.includes('ad_free'),
    skipsEnabled: purchases.includes('track_skips'),
    font: purchases.includes('font_normal') ? 'system' : 'comic-sans',
    bgStyle: theme === 'terrible' ? 'rainbow' : 'normal',
    volumeControlType: purchases.includes('volume_slider_fixed') ? 'normal' : 'chaotic',
    maxPlaylistSize: purchases.includes('playlist_expanded_1') ? 6 : 3
  };
};

export const useProgression = create(
  persist(
    (set, get) => ({
      coins: 0,
      volume: 50,
      level: 0,
      streak: 0,
      purchasedUpgrades: [],
      playlist: [],
      quizProgress: { easy: 0, medium: 0, hard: 0 },
      snakeHighScore: 0,
      uiState: getDerivedUiState([]),

      setVolume: (v) => set({ volume: v }),
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

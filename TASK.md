## 📌 ROLE AND CONTEXT
You are a Senior Frontend Developer and UX Gamification Specialist. You are participating in the **Yandex Minus** hackathon. Your task is to create a working prototype using **React + Vite** that simulates a broken music streaming service. Initially, the interface is intentionally frustrating, but it gradually improves through game mechanics and currency accumulation. The project must be ready for deployment and presentation within 24–48 hours.

## 🎯 GOAL AND EVALUATION CRITERIA (from PDF)
- **Humor/UX/Presentation (50 points):** Originality, wow-effect, charisma, non-obvious degradation/progression scenario.
- **Technical Implementation (50 points):** Clear state logic, meaningful connection between actions and improvements, real metric tracking, deployment, creativity.
- **Deliverables:** Working prototype + GitHub repo + deployment link + pitch.

## 🛠 TECH STACK AND ARCHITECTURE
- **Framework:** React 18+ + Vite
- **State Management:** Zustand or React Context (Zustand preferred for simplicity)
- **Styling:** CSS Modules / Tailwind (your choice, but start with inline/simple CSS for intentional "bad" UI)
- **Storage:** `localStorage` (profile, currency, playlist, purchased upgrades, game progress)
- **API:** OpenRouter (cheap model, e.g., `google/gemma-2-9b-it` or `meta-llama/llama-3-8b-instruct`)
- **Deployment:** Vercel / Netlify / GitHub Pages (static)

## 🎮 DETAILED MECHANICS DESCRIPTION

1. **Snake Game**
   - Launches **only on first entry** or if the playlist is empty.
   - "Notes"/"tracks" are scattered across the field. When the snake collides with a track, it's added to the playlist.
   - Initially, the playlist is limited to **3 slots**. Slots can be expanded in the shop.
   - Save to `localStorage`: track list, high score, completion status.

2. **Quiz**
   - 3 difficulty levels. Questions are local (FKN memes, song lyrics, absurd facts).
   - Reward: internal currency (`coins`).
   - Progress is saved. Re-playing yields fewer coins (anti-farm mechanic).

3. **Upgrade Shop**
   - Purchase with `coins`: new tracks, playlist expansion, "normal font", ad removal, volume slider normalization.
   - Each purchased upgrade **dynamically changes the UI/UX** (removes elements, changes styles, unlocks features).

4. **AI Radio**
   - Integration via `fetch` to OpenRouter API.
   - Initially: responds nonsensically/funnily, with delays, requires "captcha" or clicks to activate.
   - After purchasing the "AI Tuning" upgrade: responds relevantly, interface simplifies.

5. **Ads and Frustration**
   - Start screen: rainbow animated background, Comic Sans font, flashing banners, pop-ups, fake "R.Casino".
   - Ads and annoying elements are removed only via currency or streaks.

6. **"Get Normal Version" Button**
   - Leads to a rickroll (`https://www.youtube.com/watch?v=dQw4w9WgXcQ`) or opens a modal with the video. Treated as an easter egg/wow-effect.

7. **Error Logs as a Feature**
   - Intercept `window.onerror` and React Error Boundary.
   - Display errors in the UI as "system notifications" or in a separate `🐛 DevLog` panel. This is part of the "broken site" gamification.

## 📊 PROGRESSION SYSTEM AND STORAGE (`localStorage` schema)
```json
{
  "user": {
    "coins": 0,
    "level": 0,
    "streak": 0,
    "lastVisit": "2026-04-05",
    "purchasedUpgrades": ["ad_free", "font_normal", "volume_slider_fixed", "playlist_expanded_1"],
    "playlist": ["track_1", "track_2"],
    "quizProgress": {"easy": 5, "medium": 2, "hard": 0},
    "snakeHighScore": 120,
    "uiState": {
      "theme": "terrible",
      "adsEnabled": true,
      "font": "Comic Sans MS",
      "bgStyle": "rainbow",
      "volumeControlType": "chaotic"
    }
  }
}
```
- Any action (game, quiz, purchase) updates `user.uiState` and applies styles.
- Implement a `useProgression()` hook that listens for changes and triggers animations/notifications.

## 🎨 UI/UX EVOLUTION (transition rules)
| State | Entry Condition | What Changes |
|-------|----------------|--------------|
| `terrible` | Start / lost streak | Comic Sans, rainbow background, ads, frustrating volume control, delays |
| `beta` | 50 coins / 1 upgrade | Font → `system-ui`, ads partially hidden, snake game available again |
| `stable` | 150 coins / 3 upgrades | Background → dark theme, ads disabled, normal player, AI radio without captcha |
| `premium` | 300 coins / all upgrades | Clean UI, expanded playlist, queue priority, rickroll easter egg becomes "friends-only easter egg" |

## ✅ IMPLEMENTATION REQUIREMENTS
1. **Modularity:** Split code into `components/`, `store/`, `games/`, `api/`, `utils/`.
2. **State-first:** First implement `store/progression.js` and the `localStorage` schema, then the UI.
3. **Performance:** Avoid heavy libraries. Use Canvas for snake, plain `fetch` for API.
4. **Deployment-ready:** `.env` for OpenRouter key, optimized `vite.config.js`, `package.json` scripts for `dev`/`build`/`preview`.
5. **Documentation:** `README.md` with launch instructions, deployment link, and mechanics description (for judges).

## 📤 EXPECTED OUTPUT FORMAT FROM AI AGENT
1. 🗂 **Project Structure** (file tree)
2. 📦 **Key Code Files** (complete, ready to copy):
   - `store/progressionStore.js`
   - `components/Player.jsx` + `VolumeControl.jsx`
   - `games/SnakeGame.jsx`
   - `components/Quiz.jsx`
   - `api/aiRadio.js`
   - `main.jsx` with Error Boundary and global styles
3. 📝 **State Transition Rules** (code or table)
4. 🌐 **Deployment Instructions** (Vercel/GitHub Pages)
5. 💡 **Pitch Recommendations** (how to showcase evolution in 2 minutes)
6. ❓ **Clarifying Questions** (if needed)

## ⚠️ IMPORTANT CONSTRAINTS
- No backend complexity. Everything client-side + `localStorage` + 1 external API.
- Don't build perfect UI from the first commit. Start with the "broken" version, then add upgrades.
- Errors should be visible but not break rendering.
- Code must run with `npm i && npm run dev`.
- Respect OpenRouter limits: add fallback mocks for network errors.
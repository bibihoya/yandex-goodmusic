import { useState, useEffect, useCallback } from 'react';
import { useProgression } from '../store/useProgression';

const GRID_SIZE = 15;
const INITIAL_SNAKE = [[7, 7]];
const INITIAL_DIRECTION = [0, -1];
const SPEED = 150;

const ALL_TRACKS = [
  "КИНО - Группа крови",
  "Дима Билан - Я твой номер один",
  "А4 - Лама Мама",
  "Weezer - Buddy Holly",
  "Nabeel - Lazim alshams",
  "Betsy, Мария Янковская - Сигма Бой",
  "Синтий трактор — Синий Трактор"
];

export default function SnakeGame() {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [food, setFood] = useState([3, 3]);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);

  const { addCoins, addTrackToPlaylist, maxPlaylistSize, playlist, uiState } = useProgression();

  const spawnFood = useCallback(() => {
    let newFood;
    while (true) {
      newFood = [Math.floor(Math.random() * GRID_SIZE), Math.floor(Math.random() * GRID_SIZE)];
      // eslint-disable-next-line no-loop-func
      if (!snake.some(segment => segment[0] === newFood[0] && segment[1] === newFood[1])) {
        break;
      }
    }
    setFood(newFood);
  }, [snake]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      switch (e.key) {
        case 'ArrowUp':
          if (direction[1] !== 1) setDirection([0, -1]);
          break;
        case 'ArrowDown':
          if (direction[1] !== -1) setDirection([0, 1]);
          break;
        case 'ArrowLeft':
          if (direction[0] !== 1) setDirection([-1, 0]);
          break;
        case 'ArrowRight':
          if (direction[0] !== -1) setDirection([1, 0]);
          break;
        default:
          break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  useEffect(() => {
    if (gameOver) return;

    const moveSnake = () => {
      setSnake(prevSnake => {
        const head = [prevSnake[0][0] + direction[0], prevSnake[0][1] + direction[1]];
        
        // Wall collision
        if (head[0] < 0 || head[0] >= GRID_SIZE || head[1] < 0 || head[1] >= GRID_SIZE) {
          setGameOver(true);
          return prevSnake;
        }
        
        // Self collision
        if (prevSnake.some(segment => segment[0] === head[0] && segment[1] === head[1])) {
          setGameOver(true);
          return prevSnake;
        }

        const newSnake = [head, ...prevSnake];

        // Food collision
        if (head[0] === food[0] && head[1] === food[1]) {
          setScore(s => s + 1);
          addCoins(7);
          
          const availableTracks = ALL_TRACKS.filter(t => !playlist.includes(t));
          if (availableTracks.length > 0 && playlist.length < uiState.maxPlaylistSize) {
              const randomTrack = availableTracks[Math.floor(Math.random() * availableTracks.length)];
              addTrackToPlaylist(randomTrack);
          }
          
          spawnFood();
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    };

    const intervalId = setInterval(moveSnake, SPEED);
    return () => clearInterval(intervalId);
  }, [direction, food, gameOver, spawnFood, addCoins, addTrackToPlaylist, playlist, uiState.maxPlaylistSize]);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setScore(0);
    setGameOver(false);
    spawnFood();
  };

  return (
    <div className="flex flex-col items-center p-4 bg-gray-800 rounded-lg text-white">
      <h2 className="text-xl font-bold mb-2">Змейка для плейлиста</h2>
      <p className="mb-4">Счет: {score} | Играй, чтобы заработать треки и функоины</p>
      
      <div 
        className="relative bg-black"
        style={{ width: GRID_SIZE * 20, height: GRID_SIZE * 20 }}
      >
        {snake.map((segment, i) => (
          <div
            key={i}
            className="absolute bg-green-500 border border-green-700"
            style={{
              left: segment[0] * 20,
              top: segment[1] * 20,
              width: 20,
              height: 20,
            }}
          />
        ))}
        <div
          className="absolute bg-red-500 rounded-full"
          style={{
            left: food[0] * 20,
            top: food[1] * 20,
            width: 20,
            height: 20,
          }}
        />
        {gameOver && (
          <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center">
            <p className="text-red-500 font-bold text-2xl mb-4">ИГРА ОКОНЧЕНА</p>
            <button onClick={resetGame} className="btn-primary">Попробовать снова</button>
          </div>
        )}
      </div>
      <p className="mt-4 text-xs opacity-70 border p-2 border-dashed">Используйте стрелки для движения. Поедание яблок дает 1000 функоинов и пытается открыть новый трек для плейлиста, если есть свободные слоты.</p>
    </div>
  );
}

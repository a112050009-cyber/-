
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Difficulty, CardItem, BestRecords, LeaderboardEntry } from './types';
import { SUSHI_ICONS, GRID_CONFIG, FLIP_DELAY } from './constants';
import InfoPanel from './components/InfoPanel';
import Controls from './components/Controls';
import Card from './components/Card';
import VictoryModal from './components/VictoryModal';
import Noren from './components/Noren';
import Leaderboard from './components/Leaderboard';

// --- CONFIG ---
// Replace with your Google Apps Script Web App URL
const GAS_URL = "https://script.google.com/macros/s/AKfycby-EXAMPLE-URL/exec";

const App: React.FC = () => {
  const [difficulty, setDifficulty] = useState<Difficulty>(Difficulty.EASY);
  const [cards, setCards] = useState<CardItem[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [matchedIndices, setMatchedIndices] = useState<Set<number>>(new Set());
  const [steps, setSteps] = useState(0);
  const [time, setTime] = useState(0);
  const [isGameActive, setIsGameActive] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [showVictory, setShowVictory] = useState(false);
  const [isNewBest, setIsNewBest] = useState(false);
  const [playerName, setPlayerName] = useState('');
  const [globalScores, setGlobalScores] = useState<LeaderboardEntry[]>([]);
  const [isLoadingScores, setIsLoadingScores] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bestRecords, setBestRecords] = useState<BestRecords>({
    [Difficulty.EASY]: null,
    [Difficulty.MEDIUM]: null,
    [Difficulty.HARD]: null,
  });

  const timerRef = useRef<number | null>(null);

  // Fetch Scores
  const fetchScores = useCallback(async () => {
    if (!GAS_URL.includes("EXAMPLE")) {
      setIsLoadingScores(true);
      try {
        const res = await fetch(GAS_URL);
        const data = await res.json();
        if (Array.isArray(data)) setGlobalScores(data);
      } catch (e) {
        console.warn("Leaderboard fetch failed (expected if URL not set). Mocking data...");
        // Mock data if script is not set up
        setGlobalScores([
          { name: "壽司之神", time: 15, steps: 8, difficulty: Difficulty.EASY },
          { name: "飯糰君", time: 22, steps: 10, difficulty: Difficulty.EASY },
        ]);
      } finally {
        setIsLoadingScores(false);
      }
    } else {
       // Just mock if no URL provided
       setGlobalScores([
          { name: "壽司之神", time: 15, steps: 8, difficulty: Difficulty.EASY },
          { name: "鮭魚狂人", time: 45, steps: 15, difficulty: Difficulty.MEDIUM },
        ]);
    }
  }, []);

  useEffect(() => {
    fetchScores();
  }, [fetchScores]);

  // Local Records
  useEffect(() => {
    const saved = localStorage.getItem('sushi_memory_best_records');
    if (saved) {
      try { setBestRecords(JSON.parse(saved)); } catch (e) {}
    }
  }, []);

  const saveBestRecord = useCallback((diff: Difficulty, newTime: number) => {
    setBestRecords(prev => {
      const currentBest = prev[diff];
      if (currentBest === null || newTime < currentBest) {
        const updated = { ...prev, [diff]: newTime };
        localStorage.setItem('sushi_memory_best_records', JSON.stringify(updated));
        setIsNewBest(true);
        return updated;
      }
      return prev;
    });
  }, []);

  const initGame = useCallback((diff: Difficulty) => {
    const config = GRID_CONFIG[diff];
    const pairsCount = config.total / 2;
    const selectedIcons = SUSHI_ICONS.slice(0, pairsCount);
    const gameIcons = [...selectedIcons, ...selectedIcons];
    
    for (let i = gameIcons.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [gameIcons[i], gameIcons[j]] = [gameIcons[j], gameIcons[i]];
    }

    setCards(gameIcons.map((icon, index) => ({
      id: index, icon, isFlipped: false, isMatched: false
    })));
    setMatchedIndices(new Set());
    setFlippedIndices([]);
    setSteps(0);
    setTime(0);
    setIsGameActive(false);
    setIsLocked(false);
    setShowVictory(false);
    setIsNewBest(false);
    if (timerRef.current) clearInterval(timerRef.current);
  }, []);

  useEffect(() => {
    initGame(Difficulty.EASY);
  }, [initGame]);

  useEffect(() => {
    if (isGameActive && !showVictory) {
      timerRef.current = window.setInterval(() => setTime(t => t + 1), 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isGameActive, showVictory]);

  const handleCardClick = (index: number) => {
    if (isLocked || matchedIndices.has(index) || flippedIndices.includes(index) || showVictory) return;
    if (!isGameActive) setIsGameActive(true);

    const newFlipped = [...flippedIndices, index];
    setFlippedIndices(newFlipped);

    if (newFlipped.length === 2) {
      setSteps(s => s + 1);
      setIsLocked(true);
      const [f, s] = newFlipped;
      if (cards[f].icon === cards[s].icon) {
        setTimeout(() => {
          setMatchedIndices(prev => {
            const next = new Set(prev);
            next.add(f); next.add(s);
            if (next.size === cards.length) {
              setShowVictory(true);
              setIsGameActive(false);
              saveBestRecord(difficulty, time);
            }
            return next;
          });
          setFlippedIndices([]);
          setIsLocked(false);
        }, 500);
      } else {
        setTimeout(() => {
          setFlippedIndices([]);
          setIsLocked(false);
        }, FLIP_DELAY);
      }
    }
  };

  const handleSubmitScore = async () => {
    if (!playerName.trim() || isSubmitting) return;
    setIsSubmitting(true);
    const entry: LeaderboardEntry = { name: playerName, time, steps, difficulty };
    
    try {
      if (!GAS_URL.includes("EXAMPLE")) {
        await fetch(GAS_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(entry),
        });
      }
      setGlobalScores(prev => [...prev, entry]);
      alert("成績已提交！");
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
      setPlayerName('');
    }
  };

  const config = GRID_CONFIG[difficulty];

  return (
    <div className="min-h-screen pb-20 px-4 flex flex-col items-center">
      <Noren />

      <div className="bg-[#1a2a4d] px-6 py-2 rounded-full text-white font-bold mb-6 shadow-lg flex items-center gap-3">
        <span>👨‍🍳 大將建議：</span>
        <span className="text-sm font-normal text-white/80 italic italic">
          「靜心思考，才能在醋飯間尋得那份默契。」
        </span>
      </div>

      <InfoPanel 
        time={time} steps={steps} 
        bestRecord={bestRecords[difficulty]} 
        difficulty={difficulty} 
      />

      <main 
        className="grid gap-2 md:gap-4 p-6 bg-[#d2b48c] watercolor-border rounded-xl shadow-2xl w-full max-w-2xl relative overflow-hidden"
        style={{
          gridTemplateColumns: `repeat(${config.cols}, minmax(0, 1fr))`,
          background: 'linear-gradient(45deg, #d2b48c 0%, #e3c9a6 100%)'
        }}
      >
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-10 bg-[url('https://www.transparenttextures.com/patterns/wood-pattern-with-twigs.png')]"></div>
        {cards.map((card, idx) => (
          <Card 
            key={card.id} icon={card.icon}
            isFlipped={flippedIndices.includes(idx)}
            isMatched={matchedIndices.has(idx)}
            onClick={() => handleCardClick(idx)}
          />
        ))}
      </main>

      <Controls 
        difficulty={difficulty} 
        onDifficultyChange={(d) => { setDifficulty(d); initGame(d); }}
        onRestart={() => initGame(difficulty)}
        gameInProgress={isGameActive && matchedIndices.size > 0 && matchedIndices.size < cards.length}
      />

      <Leaderboard 
        entries={globalScores} 
        difficulty={difficulty} 
        isLoading={isLoadingScores} 
      />

      {showVictory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
          <div className="bg-white rounded-[2rem] p-8 max-w-md w-full shadow-2xl flex flex-col items-center text-center watercolor-border">
            <h2 className="text-3xl font-bold text-[#1a2a4d] mb-4 italic">恭喜大進店！🍣</h2>
            <div className="flex gap-4 mb-6">
              <div className="p-4 bg-gray-50 rounded-2xl">
                <span className="block text-xs font-bold text-gray-400">耗時</span>
                <span className="text-xl font-bold">{Math.floor(time/60)}:{(time%60).toString().padStart(2,'0')}</span>
              </div>
              <div className="p-4 bg-gray-50 rounded-2xl">
                <span className="block text-xs font-bold text-gray-400">步數</span>
                <span className="text-xl font-bold">{steps}</span>
              </div>
            </div>

            <div className="w-full mb-6">
              <p className="text-sm text-gray-500 mb-2 font-bold">登錄名人錄：</p>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  placeholder="輸入你的大名..."
                  className="flex-1 px-4 py-2 border-2 border-[#1a2a4d]/20 rounded-xl outline-none focus:border-[#1a2a4d] transition-all"
                  maxLength={10}
                />
                <button 
                  onClick={handleSubmitScore}
                  disabled={isSubmitting || !playerName.trim()}
                  className="bg-[#1a2a4d] text-white px-4 py-2 rounded-xl font-bold disabled:opacity-50"
                >
                  {isSubmitting ? '...' : '提交'}
                </button>
              </div>
            </div>

            <button
              onClick={() => initGame(difficulty)}
              className="w-full py-4 bg-wasabi hover:bg-[#8ec7c1] text-white bg-[#a3d9a3] font-bold rounded-2xl shadow-lg transition-all"
            >
              再開一局
            </button>
          </div>
        </div>
      )}

      <div className="mt-16 flex flex-col items-center opacity-70">
        <div className="text-5xl float-animation">🐈</div>
        <p className="text-xs font-bold text-gray-400 mt-2 italic">三毛貓正在門口打盹...</p>
      </div>
    </div>
  );
};

export default App;

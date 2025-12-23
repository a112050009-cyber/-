
import React from 'react';
import { LeaderboardEntry, Difficulty } from '../types';

interface LeaderboardProps {
  entries: LeaderboardEntry[];
  difficulty: Difficulty;
  isLoading: boolean;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ entries, difficulty, isLoading }) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const filtered = entries
    .filter(e => e.difficulty === difficulty)
    .sort((a, b) => a.time - b.time)
    .slice(0, 5);

  return (
    <div className="bg-white/90 watercolor-border p-6 rounded-3xl w-full max-w-md mt-10">
      <h3 className="text-xl font-bold text-center text-[#1a2a4d] mb-4 flex items-center justify-center gap-2">
        🏆 店內高手榜 ({difficulty})
      </h3>
      
      {isLoading ? (
        <div className="flex justify-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1a2a4d]"></div>
        </div>
      ) : filtered.length === 0 ? (
        <p className="text-gray-400 text-center py-4">尚無紀錄，期待你大顯身手！</p>
      ) : (
        <div className="space-y-2">
          {filtered.map((entry, idx) => (
            <div key={idx} className="flex justify-between items-center p-3 bg-[#fdfaf5] border border-gray-100 rounded-xl">
              <div className="flex items-center gap-3">
                <span className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold ${idx === 0 ? 'bg-yellow-400 text-white' : 'bg-gray-200 text-gray-500'}`}>
                  {idx + 1}
                </span>
                <span className="font-bold text-gray-700">{entry.name}</span>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <span className="text-gray-400">{entry.steps} 步</span>
                <span className="font-mono font-bold text-[#1a2a4d]">{formatTime(entry.time)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
      <p className="text-[10px] text-gray-300 text-center mt-4">
        * 資料串接 Google Sheets 雲端同步
      </p>
    </div>
  );
};

export default Leaderboard;

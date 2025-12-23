
import React from 'react';
import { Difficulty } from '../types';

interface ControlsProps {
  difficulty: Difficulty;
  onDifficultyChange: (newDifficulty: Difficulty) => void;
  onRestart: () => void;
  gameInProgress: boolean;
}

const Controls: React.FC<ControlsProps> = ({ 
  difficulty, 
  onDifficultyChange, 
  onRestart, 
  gameInProgress 
}) => {
  const handleRestartClick = () => {
    if (gameInProgress) {
      if (window.confirm("Game is in progress. Restarting will lose current progress. Are you sure?")) {
        onRestart();
      }
    } else {
      onRestart();
    }
  };

  return (
    <div className="flex flex-wrap gap-3 items-center justify-center w-full max-w-2xl mt-8">
      <div className="bg-white p-1 rounded-xl shadow-sm border border-gray-100 flex gap-1">
        {(Object.values(Difficulty) as Difficulty[]).map((level) => (
          <button
            key={level}
            onClick={() => onDifficultyChange(level)}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
              difficulty === level 
                ? 'bg-[#a3d9d3] text-white shadow-md' 
                : 'text-gray-400 hover:bg-gray-50'
            }`}
          >
            {level === Difficulty.EASY ? 'Easy' : level === Difficulty.MEDIUM ? 'Medium' : 'Hard'}
          </button>
        ))}
      </div>

      <button
        onClick={handleRestartClick}
        className="px-8 py-2.5 bg-[#ff8a8a] hover:bg-[#ff7575] text-white font-bold rounded-xl shadow-lg transition-all active:scale-95"
      >
        Restart Game
      </button>
    </div>
  );
};

export default Controls;


import React from 'react';

interface VictoryModalProps {
  time: number;
  steps: number;
  isNewBest: boolean;
  onRestart: () => void;
}

const VictoryModal: React.FC<VictoryModalProps> = ({ time, steps, isNewBest, onRestart }) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl flex flex-col items-center text-center transform animate-bounce-short">
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="text-3xl font-bold text-[#2c3e50] mb-2">Sushi Master!</h2>
        <p className="text-gray-500 mb-6">You've successfully matched all sushi!</p>
        
        <div className="grid grid-cols-2 gap-4 w-full mb-8">
          <div className="bg-gray-50 p-4 rounded-2xl">
            <span className="block text-xs font-bold text-gray-400 uppercase mb-1">Total Time</span>
            <span className="text-2xl font-bold text-[#2c3e50]">{formatTime(time)}</span>
          </div>
          <div className="bg-gray-50 p-4 rounded-2xl">
            <span className="block text-xs font-bold text-gray-400 uppercase mb-1">Total Steps</span>
            <span className="text-2xl font-bold text-[#2c3e50]">{steps}</span>
          </div>
        </div>

        {isNewBest && (
          <div className="mb-6 px-4 py-2 bg-yellow-100 text-yellow-700 rounded-full text-sm font-bold flex items-center gap-2">
            ✨ New Best Record! ✨
          </div>
        )}

        <button
          onClick={onRestart}
          className="w-full py-4 bg-[#a3d9d3] hover:bg-[#8ec7c1] text-white font-bold rounded-2xl shadow-lg transition-all active:scale-95 text-lg"
        >
          Play Again
        </button>
      </div>
    </div>
  );
};

export default VictoryModal;

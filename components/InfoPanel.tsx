
import React from 'react';
import { Difficulty } from '../types';

interface InfoPanelProps {
  time: number;
  steps: number;
  bestRecord: number | null;
  difficulty: Difficulty;
}

const InfoPanel: React.FC<InfoPanelProps> = ({ time, steps, bestRecord, difficulty }) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl shadow-lg border border-white flex flex-wrap gap-4 items-center justify-between w-full max-w-2xl mb-6">
      <div className="flex items-center gap-2">
        <span className="text-gray-500 text-sm font-semibold uppercase tracking-wider">Level:</span>
        <span className="bg-[#a3d9d3] px-3 py-1 rounded-full text-white font-bold text-sm">{difficulty}</span>
      </div>
      
      <div className="flex items-center gap-6">
        <div className="flex flex-col items-center">
          <span className="text-gray-400 text-xs font-bold uppercase">Time</span>
          <span className="text-2xl font-bold text-[#2c3e50] tabular-nums">{formatTime(time)}</span>
        </div>
        <div className="h-8 w-px bg-gray-200"></div>
        <div className="flex flex-col items-center">
          <span className="text-gray-400 text-xs font-bold uppercase">Steps</span>
          <span className="text-2xl font-bold text-[#2c3e50] tabular-nums">{steps}</span>
        </div>
        <div className="h-8 w-px bg-gray-200"></div>
        <div className="flex flex-col items-center">
          <span className="text-gray-400 text-xs font-bold uppercase">Best</span>
          <span className="text-2xl font-bold text-yellow-500 tabular-nums">
            {bestRecord ? formatTime(bestRecord) : '--:--'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default InfoPanel;

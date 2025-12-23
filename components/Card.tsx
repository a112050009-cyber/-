
import React from 'react';

interface CardProps {
  icon: string;
  isFlipped: boolean;
  isMatched: boolean;
  onClick: () => void;
}

const Card: React.FC<CardProps> = ({ icon, isFlipped, isMatched, onClick }) => {
  return (
    <div 
      className={`relative w-full aspect-square cursor-pointer perspective-1000 group ${isMatched ? 'opacity-80' : ''}`}
      onClick={onClick}
    >
      <div 
        className={`relative w-full h-full transition-transform duration-500 transform-style-3d ${isFlipped || isMatched ? 'rotate-y-180' : ''}`}
      >
        {/* Card Back - Wood texture feel */}
        <div className="absolute inset-0 w-full h-full bg-[#e3c9a6] rounded-lg border-[3px] border-[#c4a484] shadow-md flex items-center justify-center backface-hidden">
          <div className="w-10 h-10 border border-[#b39373]/30 rounded-full flex items-center justify-center">
            <span className="text-[#b39373]/50 text-xl font-bold">🍣</span>
          </div>
        </div>

        {/* Card Front - Clean Plate feel */}
        <div className="absolute inset-0 w-full h-full bg-white rounded-lg border-[3px] border-[#1a2a4d]/20 shadow-inner flex items-center justify-center backface-hidden rotate-y-180">
          <span className="text-3xl md:text-5xl select-none drop-shadow-sm">{icon}</span>
        </div>
      </div>
      
      {isMatched && (
        <div className="absolute inset-0 flex items-center justify-center animate-pulse pointer-events-none">
          <div className="w-full h-full bg-[#a3d9a3]/10 border-2 border-[#a3d9a3] rounded-lg"></div>
        </div>
      )}
    </div>
  );
};

export default Card;

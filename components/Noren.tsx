
import React from 'react';

const Noren: React.FC = () => {
  return (
    <div className="w-full flex justify-center mb-8 pt-4">
      <div className="flex gap-1">
        {['す', 'し', '語', '辭', '典'].map((char, i) => (
          <div 
            key={i} 
            className="noren-segment w-16 h-24 md:w-20 md:h-32 flex items-center justify-center text-white text-3xl md:text-5xl font-bold shadow-lg rounded-b-sm"
          >
            <span style={{ writingMode: 'vertical-rl' }}>{char}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Noren;

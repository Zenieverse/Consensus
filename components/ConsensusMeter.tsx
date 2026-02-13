
import React, { useEffect, useState } from 'react';

interface ConsensusMeterProps {
  label: string;
  percentage: number;
  isWinner: boolean;
  isUserChoice: boolean;
  index: number;
}

const ConsensusMeter: React.FC<ConsensusMeterProps> = ({ label, percentage, isWinner, isUserChoice, index }) => {
  const [displayWidth, setDisplayWidth] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDisplayWidth(percentage);
    }, 100 * index);
    return () => clearTimeout(timer);
  }, [percentage, index]);

  return (
    <div className={`relative p-4 rounded-xl border-2 transition-all duration-500 ${
      isWinner ? 'border-reddit-orange bg-orange-50' : 'border-gray-100 bg-white'
    }`}>
      <div className="flex justify-between items-center mb-2 relative z-10">
        <div className="flex items-center gap-2">
          <span className={`font-bold ${isWinner ? 'text-reddit-orange' : 'text-gray-800'}`}>
            {label}
          </span>
          {isWinner && <i className="fa-solid fa-crown text-yellow-500 animate-bounce"></i>}
          {isUserChoice && (
            <span className="text-[9px] bg-gray-800 text-white px-1.5 py-0.5 rounded font-black tracking-tighter uppercase">
              You
            </span>
          )}
        </div>
        <span className={`text-sm font-black ${isWinner ? 'text-reddit-orange' : 'text-gray-400'}`}>
          {percentage}%
        </span>
      </div>
      
      <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden relative">
        <div 
          className={`h-full bar-transition rounded-full ${
            isWinner ? 'bg-reddit-orange' : 'bg-gray-400'
          }`}
          style={{ width: `${displayWidth}%` }}
        />
      </div>

      {isWinner && (
        <div className="absolute inset-0 bg-orange-500/5 pointer-events-none rounded-xl" />
      )}
    </div>
  );
};

export default ConsensusMeter;

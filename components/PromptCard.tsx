
import React from 'react';
import { Prompt } from '../types';

interface PromptCardProps {
  prompt: Prompt;
  dayNumber: number;
}

const PromptCard: React.FC<PromptCardProps> = ({ prompt, dayNumber }) => {
  return (
    <div className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-200 mb-4 transition-all hover:shadow-md">
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2">
          <div className="bg-orange-50 px-2 py-0.5 rounded text-[9px] font-black text-reddit-orange uppercase tracking-wider">
            Today's Debate
          </div>
          <span className="text-[10px] font-bold text-gray-400">Day {dayNumber}</span>
        </div>
        <span className="text-[10px] font-medium text-gray-400">
          <i className="fa-regular fa-calendar mr-1"></i> {new Date(prompt.day).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        </span>
      </div>
      <h2 className="text-xl md:text-2xl font-black text-gray-900 leading-tight mb-2">
        {prompt.question}
      </h2>
      <div className="h-1 w-12 bg-reddit-orange rounded-full mb-3"></div>
      <p className="text-xs text-gray-500 font-medium leading-relaxed">
         Reddit is voting right now. Can you guess which way the community will tilt?
      </p>
    </div>
  );
};

export default PromptCard;


import React from 'react';
import { Prompt } from '../types';

interface PromptCardProps {
  prompt: Prompt;
  dayNumber: number;
}

const PromptCard: React.FC<PromptCardProps> = ({ prompt, dayNumber }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-4">
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
          Daily Challenge #{dayNumber}
        </span>
        <span className="text-xs font-medium text-reddit-orange">
          {prompt.day}
        </span>
      </div>
      <h1 className="text-xl md:text-2xl font-bold text-gray-900 leading-tight">
        {prompt.question}
      </h1>
      <p className="text-sm text-gray-600 mt-2">
        The community is currently deciding. Cast your vote and predict the outcome!
      </p>
    </div>
  );
};

export default PromptCard;

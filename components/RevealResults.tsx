
import React from 'react';
import { Prompt, UserSubmission } from '../types';
import ConsensusMeter from './ConsensusMeter';

interface RevealResultsProps {
  prompt: Prompt;
  userSubmission?: UserSubmission;
}

const RevealResults: React.FC<RevealResultsProps> = ({ prompt, userSubmission }) => {
  const results = prompt.results || {};
  const total = prompt.totalVotes || 0;

  let winnerIndex = -1;
  let maxVotes = -1;
  Object.entries(results).forEach(([idx, count]) => {
    const voteCount = count as number;
    if (voteCount > maxVotes) {
      maxVotes = voteCount;
      winnerIndex = parseInt(idx);
    }
  });

  const isPredictionCorrect = userSubmission && userSubmission.predictedTopOption === winnerIndex;

  return (
    <div className="animate-in fade-in zoom-in duration-500">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden mb-6">
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-8 text-white text-center">
          <div className="inline-block px-3 py-1 bg-reddit-orange rounded-full text-[10px] font-black uppercase tracking-widest mb-3">
            Day {prompt.day} Final Results
          </div>
          <h2 className="text-2xl font-black mb-2">The Community Consensus</h2>
          <p className="text-gray-400 text-sm italic">"{prompt.question}"</p>
        </div>

        <div className="p-6 space-y-4 bg-gray-50/50">
          {prompt.options.map((option, index) => {
            const votes = results[index] || 0;
            const percentage = total > 0 ? Math.round((votes / total) * 100) : 0;
            return (
              <ConsensusMeter
                key={index}
                index={index}
                label={option}
                percentage={percentage}
                isWinner={index === winnerIndex}
                isUserChoice={userSubmission?.voteOption === index}
              />
            );
          })}
        </div>

        {userSubmission && (
          <div className="px-6 pb-6">
             <div className={`p-5 rounded-2xl border-2 flex items-center gap-4 ${
              isPredictionCorrect 
                ? 'bg-green-50 border-green-200 text-green-800' 
                : 'bg-red-50 border-red-200 text-red-800'
            }`}>
              <div className={`w-14 h-14 rounded-full flex-shrink-0 flex items-center justify-center text-xl shadow-inner ${
                isPredictionCorrect ? 'bg-green-500 text-white' : 'bg-red-400 text-white'
              }`}>
                <i className={`fa-solid ${isPredictionCorrect ? 'fa-trophy' : 'fa-face-frown-open'}`}></i>
              </div>
              <div>
                <h4 className="font-black text-lg leading-tight">
                  {isPredictionCorrect ? 'ORACLE STATUS ACHIEVED!' : 'BETTER LUCK NEXT TIME'}
                </h4>
                <p className="text-sm opacity-80">
                  {isPredictionCorrect 
                    ? `You accurately predicted the Reddit hivemind! +5 Points rewarded.`
                    : `You thought ${prompt.options[userSubmission.predictedTopOption]} would win, but it was ${prompt.options[winnerIndex]}.`}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white p-6 rounded-2xl border border-dashed border-gray-300 text-center">
        <p className="text-gray-500 font-bold mb-3 italic">
          "The debate continues in the comments..."
        </p>
        <div className="flex justify-center gap-4">
          <button className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-reddit-orange transition-colors">
            <i className="fa-solid fa-comment"></i> 1.2k Comments
          </button>
          <button className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-blue-500 transition-colors">
            <i className="fa-solid fa-share"></i> Share Result
          </button>
        </div>
      </div>
    </div>
  );
};

export default RevealResults;

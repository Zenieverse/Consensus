
import React from 'react';
import { MOCK_LEADERBOARD } from '../constants';

const LeaderboardPanel: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-4 border-b border-gray-100 flex items-center justify-between">
        <h3 className="font-bold text-gray-800 flex items-center gap-2">
          <i className="fa-solid fa-trophy text-yellow-500"></i>
          Community Oracles
        </h3>
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">All Time</span>
      </div>
      <div className="divide-y divide-gray-100">
        {MOCK_LEADERBOARD.map((entry, idx) => (
          <div key={idx} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-4">
              <span className={`w-6 text-sm font-black ${
                idx === 0 ? 'text-yellow-500' : idx === 1 ? 'text-gray-400' : idx === 2 ? 'text-orange-400' : 'text-gray-300'
              }`}>
                #{idx + 1}
              </span>
              <div>
                <p className="text-sm font-bold text-gray-800">u/{entry.username}</p>
                <div className="flex items-center gap-2 text-[10px] text-gray-500 font-medium">
                  <span className="flex items-center gap-0.5">
                    <i className="fa-solid fa-fire text-orange-500"></i> {entry.streak} Day Streak
                  </span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-black text-reddit-orange">{entry.score}</p>
              <p className="text-[9px] text-gray-400 font-bold uppercase">Points</p>
            </div>
          </div>
        ))}
      </div>
      <div className="bg-gray-50 p-3 text-center">
        <button className="text-xs font-bold text-blue-600 hover:underline">
          View Full Leaderboard
        </button>
      </div>
    </div>
  );
};

export default LeaderboardPanel;

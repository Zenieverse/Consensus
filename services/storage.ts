
import { UserSubmission, UserStats, Prompt, UGCPrompt } from '../types';

const STORAGE_KEYS = {
  SUBMISSIONS: 'consensus_submissions',
  STATS: 'consensus_user_stats',
  UGC: 'consensus_ugc_queue',
  VOTES: 'consensus_live_votes'
};

export const StorageService = {
  getSubmissions: (): UserSubmission[] => {
    const data = localStorage.getItem(STORAGE_KEYS.SUBMISSIONS);
    return data ? JSON.parse(data) : [];
  },

  saveSubmission: (sub: UserSubmission) => {
    const subs = StorageService.getSubmissions();
    subs.push(sub);
    localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify(subs));
    
    // Also track local vote counts
    const votes = StorageService.getLiveVotes(sub.promptId);
    votes[sub.voteOption] = (votes[sub.voteOption] || 0) + 1;
    StorageService.saveLiveVotes(sub.promptId, votes);
  },

  getLiveVotes: (promptId: string): Record<string, number> => {
    const data = localStorage.getItem(`${STORAGE_KEYS.VOTES}_${promptId}`);
    return data ? JSON.parse(data) : {};
  },

  saveLiveVotes: (promptId: string, votes: Record<string, number>) => {
    localStorage.setItem(`${STORAGE_KEYS.VOTES}_${promptId}`, JSON.stringify(votes));
  },

  getUserStats: (userId: string): UserStats => {
    const data = localStorage.getItem(`${STORAGE_KEYS.STATS}_${userId}`);
    return data ? JSON.parse(data) : {
      userId,
      username: 'User_' + userId.slice(0, 4),
      totalScore: 0,
      currentStreak: 0,
      bestStreak: 0,
      predictionsMade: 0,
      correctPredictions: 0
    };
  },

  updateUserStats: (stats: UserStats) => {
    localStorage.setItem(`${STORAGE_KEYS.STATS}_${stats.userId}`, JSON.stringify(stats));
  },

  getUGCQueue: (): UGCPrompt[] => {
    const data = localStorage.getItem(STORAGE_KEYS.UGC);
    return data ? JSON.parse(data) : [];
  },

  submitUGC: (prompt: UGCPrompt) => {
    const queue = StorageService.getUGCQueue();
    queue.push(prompt);
    localStorage.setItem(STORAGE_KEYS.UGC, JSON.stringify(queue));
  }
};


export interface Prompt {
  id: string;
  day: string; // YYYY-MM-DD
  question: string;
  options: string[];
  totalVotes?: number;
  results?: Record<string, number>; // option index -> count
  status: 'active' | 'closed';
}

export interface UserSubmission {
  userId: string;
  promptId: string;
  voteOption: number;
  predictedTopOption: number;
  timestamp: number;
}

export interface UserStats {
  userId: string;
  username: string;
  totalScore: number;
  currentStreak: number;
  bestStreak: number;
  predictionsMade: number;
  correctPredictions: number;
}

export interface UGCPrompt {
  id: string;
  author: string;
  question: string;
  options: string[];
  status: 'pending' | 'approved' | 'rejected';
}

export enum GameView {
  VOTING = 'VOTING',
  REVEAL = 'REVEAL',
  LEADERBOARD = 'LEADERBOARD',
  UGC = 'UGC'
}


import { Prompt } from './types';

export const COLORS = {
  redditOrange: '#FF4500',
  redditBlue: '#0079D3',
  bgGray: '#DAE0E6',
  surfaceWhite: '#FFFFFF',
};

export const MOCK_PROMPTS: Prompt[] = [
  {
    id: 'p42',
    day: '2024-05-20',
    question: "Which movie ending is most overrated?",
    options: ["Inception", "Titanic", "Joker", "Interstellar"],
    status: 'closed',
    totalVotes: 1240,
    results: { '0': 450, '1': 120, '2': 380, '3': 290 }
  },
  {
    id: 'p43',
    day: '2024-05-21',
    question: "What is the best type of pizza topping?",
    options: ["Pepperoni", "Pineapple", "Mushrooms", "Sausage", "Plain Cheese"],
    status: 'active',
  }
];

export const MOCK_LEADERBOARD = [
  { username: 'SnooProphet', score: 450, streak: 12 },
  { username: 'RedditOracle', score: 425, streak: 8 },
  { username: 'KarmaCaster', score: 390, streak: 5 },
  { username: 'TheVoterGuy', score: 380, streak: 3 },
  { username: 'LogicLeaker', score: 310, streak: 1 },
];

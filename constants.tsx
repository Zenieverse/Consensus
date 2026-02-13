
import { Prompt } from './types';

export const COLORS = {
  redditOrange: '#FF4500',
  redditBlue: '#0079D3',
  bgGray: '#DAE0E6',
  surfaceWhite: '#FFFFFF',
};

const MOCK_COMMENTS = [
  { id: 'c1', author: 'DeepThinker42', text: "Inception's ending isn't overrated, it's literally perfect. People just like to hate popular things.", upvotes: 142, timestamp: Date.now() - 100000 },
  { id: 'c2', author: 'PizzaLover99', text: "If you don't pick Pepperoni you're actually lying to yourself.", upvotes: 89, timestamp: Date.now() - 50000 },
  { id: 'c3', author: 'TheOracle', text: "I predict Pineapple will win because Redditors love being contrarian.", upvotes: 210, timestamp: Date.now() - 20000 }
];

export const MOCK_PROMPTS: Prompt[] = [
  {
    id: 'p42',
    day: '2024-05-20',
    question: "Which movie ending is most overrated?",
    options: ["Inception", "Titanic", "Joker", "Interstellar"],
    status: 'closed',
    totalVotes: 1240,
    results: { '0': 450, '1': 120, '2': 380, '3': 290 },
    comments: [MOCK_COMMENTS[0]]
  },
  {
    id: 'p43',
    day: '2024-05-21',
    question: "What is the best type of pizza topping?",
    options: ["Pepperoni", "Pineapple", "Mushrooms", "Sausage", "Plain Cheese"],
    status: 'active',
    comments: [MOCK_COMMENTS[1], MOCK_COMMENTS[2]]
  }
];

export const MOCK_LEADERBOARD = [
  { username: 'SnooProphet', score: 450, streak: 12 },
  { username: 'RedditOracle', score: 425, streak: 8 },
  { username: 'KarmaCaster', score: 390, streak: 5 },
  { username: 'TheVoterGuy', score: 380, streak: 3 },
  { username: 'LogicLeaker', score: 310, streak: 1 },
];

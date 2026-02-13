
import React, { useState, useEffect } from 'react';
import { GameView, Prompt, UserSubmission, UserStats, UGCPrompt } from './types';
import { MOCK_PROMPTS } from './constants';
import { StorageService } from './services/storage';
import { GeminiService } from './services/gemini';
import PromptCard from './components/PromptCard';
import OptionGrid from './components/OptionGrid';
import PredictionSelector from './components/PredictionSelector';
import RevealResults from './components/RevealResults';
import LeaderboardPanel from './components/LeaderboardPanel';
import UGCModal from './components/UGCModal';

// Declare confetti from global window object
declare const confetti: any;

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<GameView>(GameView.VOTING);
  const [activePrompt, setActivePrompt] = useState<Prompt>(MOCK_PROMPTS[1]);
  const [pastPrompt, setPastPrompt] = useState<Prompt>(MOCK_PROMPTS[0]);
  const [userVote, setUserVote] = useState<number | null>(null);
  const [userPrediction, setUserPrediction] = useState<number | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isLocking, setIsLocking] = useState(false);
  const [userStats, setUserStats] = useState<UserStats>(StorageService.getUserStats('current_user'));
  const [isUGCModalOpen, setIsUGCModalOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState('14:22:05');

  // Load submissions and trigger celebration if viewing a correct prediction
  useEffect(() => {
    const subs = StorageService.getSubmissions();
    const existing = subs.find(s => s.promptId === activePrompt.id);
    if (existing) {
      setUserVote(existing.voteOption);
      setUserPrediction(existing.predictedTopOption);
      setHasSubmitted(true);
    }
  }, [activePrompt.id]);

  // Daily AI Refresh (Optional logic to simulate dynamic daily content)
  useEffect(() => {
    const refreshPrompt = async () => {
      // In a real app, we'd fetch the day's prompt from a database.
      // Here, we'll occasionally "spice it up" with Gemini if it's a new day.
      const today = new Date().toISOString().split('T')[0];
      if (activePrompt.day !== today) {
        try {
          const aiPrompt = await GeminiService.generateDailyPrompt();
          if (aiPrompt.question) {
            setActivePrompt(prev => ({
              ...prev,
              day: today,
              question: aiPrompt.question!,
              options: aiPrompt.options!,
            }));
          }
        } catch (err) {
          console.error("Gemini prompt refresh failed", err);
        }
      }
    };
    refreshPrompt();
  }, []);

  // Celebration Logic
  const triggerConfetti = () => {
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#FF4500', '#0079D3', '#FFFFFF', '#FFD700']
    });
  };

  useEffect(() => {
    if (currentView === GameView.REVEAL) {
      const subs = StorageService.getSubmissions();
      const pastSub = subs.find(s => s.promptId === pastPrompt.id);
      
      // Determine winner of past prompt
      let winnerIdx = -1;
      let maxVotes = -1;
      Object.entries(pastPrompt.results || {}).forEach(([idx, count]) => {
        if ((count as number) > maxVotes) {
          maxVotes = count as number;
          winnerIdx = parseInt(idx);
        }
      });

      if (pastSub && pastSub.predictedTopOption === winnerIdx) {
        setTimeout(triggerConfetti, 500);
      }
    }
  }, [currentView, pastPrompt]);

  const handleSubmit = async () => {
    if (userVote === null || userPrediction === null) return;
    
    setIsLocking(true);
    
    // Simulate server "locking" delay for dramatic effect
    await new Promise(resolve => setTimeout(resolve, 1500));

    const submission: UserSubmission = {
      userId: 'current_user',
      promptId: activePrompt.id,
      voteOption: userVote,
      predictedTopOption: userPrediction,
      timestamp: Date.now()
    };

    StorageService.saveSubmission(submission);
    setHasSubmitted(true);
    setIsLocking(false);

    const newStats = { ...userStats };
    newStats.predictionsMade += 1;
    StorageService.updateUserStats(newStats);
    setUserStats(newStats);
    
    // Initial celebration for participating
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#FF4500', '#FFFFFF']
    });
  };

  // Added handleUGCSubmit function to process user prompt submissions
  const handleUGCSubmit = (question: string, options: string[]) => {
    const newPrompt: UGCPrompt = {
      id: `ugc_${Date.now()}`,
      author: 'current_user',
      question,
      options,
      status: 'pending'
    };
    StorageService.submitUGC(newPrompt);
    setIsUGCModalOpen(false);
  };

  const NavButton = ({ view, icon, label }: { view: GameView, icon: string, label: string }) => (
    <button
      onClick={() => setCurrentView(view)}
      className={`flex flex-col items-center justify-center py-2 px-6 transition-all duration-300 relative ${
        currentView === view ? 'text-reddit-orange scale-110' : 'text-gray-400 hover:text-gray-600'
      }`}
    >
      <i className={`fa-solid ${icon} text-xl mb-1`}></i>
      <span className="text-[9px] font-black uppercase tracking-wider">{label}</span>
      {currentView === view && (
        <span className="absolute -top-1 w-1 h-1 bg-reddit-orange rounded-full animate-ping"></span>
      )}
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center pb-24">
      {/* Dynamic Header */}
      <header className="w-full bg-white border-b border-gray-200 sticky top-0 z-40 px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-reddit-orange rounded-xl flex items-center justify-center text-white text-lg shadow-lg shadow-orange-100 transform -rotate-3">
             <i className="fa-solid fa-brain"></i>
          </div>
          <div>
            <h1 className="font-black text-lg tracking-tighter text-gray-900 leading-none">CONSENSUS</h1>
            <p className="text-[9px] text-reddit-orange font-black uppercase tracking-widest">Oracle Lab</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
           <div className="hidden md:flex flex-col items-end">
              <span className="text-[9px] font-black text-gray-400 uppercase">Daily Streak</span>
              <div className="flex items-center gap-1 text-orange-600 font-black text-sm">
                <i className="fa-solid fa-fire-flame-curved"></i>
                {userStats.currentStreak}
              </div>
           </div>
           <button 
             onClick={() => setIsUGCModalOpen(true)}
             className="w-10 h-10 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-white hover:shadow-md transition-all active:scale-95"
           >
             <i className="fa-solid fa-plus"></i>
           </button>
        </div>
      </header>

      {/* Main Game Container */}
      <main className="w-full max-w-lg px-4 pt-8">
        {currentView === GameView.VOTING && (
          <div className="space-y-6">
            <PromptCard prompt={activePrompt} dayNumber={43} />
            
            <div className={`bg-white p-6 rounded-3xl shadow-xl border border-gray-200 transition-all ${isLocking ? 'opacity-50 pointer-events-none grayscale' : ''}`}>
              <OptionGrid 
                options={activePrompt.options} 
                selectedOption={userVote} 
                onSelect={(idx) => !hasSubmitted && setUserVote(idx)} 
                disabled={hasSubmitted}
              />
              
              <div className="my-8 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>

              <PredictionSelector 
                options={activePrompt.options} 
                prediction={userPrediction} 
                onSelect={(idx) => !hasSubmitted && setUserPrediction(idx)}
                disabled={hasSubmitted}
              />

              {!hasSubmitted ? (
                <button
                  onClick={handleSubmit}
                  disabled={userVote === null || userPrediction === null || isLocking}
                  className={`w-full py-5 rounded-2xl text-lg font-black transition-all shadow-2xl relative overflow-hidden group ${
                    userVote !== null && userPrediction !== null
                      ? 'bg-reddit-orange text-white hover:bg-orange-600 active:scale-[0.97]'
                      : 'bg-gray-100 text-gray-300 cursor-not-allowed'
                  }`}
                >
                  {isLocking ? (
                    <span className="flex items-center justify-center gap-2">
                       <i className="fa-solid fa-circle-notch animate-spin"></i> LOCKING...
                    </span>
                  ) : (
                    <>
                      <span className="relative z-10">LOCK IN PREDICTION</span>
                      <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                    </>
                  )}
                </button>
              ) : (
                <div className="text-center p-6 bg-orange-50 rounded-2xl border-2 border-reddit-orange border-dashed animate-pulse-soft">
                  <div className="w-12 h-12 bg-reddit-orange text-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
                    <i className="fa-solid fa-lock"></i>
                  </div>
                  <p className="font-black text-gray-900 mb-1 tracking-tight">VOTE RECORDED</p>
                  <p className="text-xs text-gray-600 font-medium">
                    Consensus reveals in <span className="text-reddit-orange font-black">{timeLeft}</span>.
                  </p>
                </div>
              )}
            </div>
            
            {!hasSubmitted && (
               <div className="text-center py-4 text-[11px] text-gray-400 font-bold uppercase tracking-widest">
                  <i className="fa-solid fa-shield-halved mr-1"></i> Votes are anonymous and permanent
               </div>
            )}
          </div>
        )}

        {currentView === GameView.REVEAL && (
          <RevealResults 
            prompt={pastPrompt} 
            userSubmission={StorageService.getSubmissions().find(s => s.promptId === pastPrompt.id)} 
          />
        )}

        {currentView === GameView.LEADERBOARD && (
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-reddit-orange to-orange-600 p-8 rounded-3xl shadow-2xl text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10 transform translate-x-4 -translate-y-4">
                 <i className="fa-solid fa-award text-9xl"></i>
              </div>
              <h2 className="text-xl font-black mb-6 flex items-center gap-2">
                 <i className="fa-solid fa-user-astronaut"></i> Your Oracle Profile
              </h2>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20">
                  <p className="text-[9px] font-black uppercase tracking-widest opacity-70 mb-1">Score</p>
                  <p className="text-2xl font-black">{userStats.totalScore}</p>
                </div>
                <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20">
                  <p className="text-[9px] font-black uppercase tracking-widest opacity-70 mb-1">Accuracy</p>
                  <p className="text-2xl font-black">
                    {userStats.predictionsMade > 0 
                      ? Math.round((userStats.correctPredictions / userStats.predictionsMade) * 100) 
                      : 0}%
                  </p>
                </div>
                <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20">
                  <p className="text-[9px] font-black uppercase tracking-widest opacity-70 mb-1">Rank</p>
                  <p className="text-2xl font-black">#4.2k</p>
                </div>
              </div>
            </div>
            <LeaderboardPanel />
          </div>
        )}
      </main>

      {/* Modern Fixed Bottom Nav */}
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-xl border border-gray-200 px-2 py-2 flex items-center gap-2 z-50 rounded-2xl shadow-2xl">
        <NavButton view={GameView.VOTING} icon="fa-bolt-lightning" label="Predict" />
        <div className="w-px h-8 bg-gray-200 mx-1"></div>
        <NavButton view={GameView.REVEAL} icon="fa-chart-simple" label="Results" />
        <div className="w-px h-8 bg-gray-200 mx-1"></div>
        <NavButton view={GameView.LEADERBOARD} icon="fa-trophy" label="Ranks" />
      </nav>

      {/* Modals */}
      <UGCModal 
        isOpen={isUGCModalOpen} 
        onClose={() => setIsUGCModalOpen(false)} 
        onSubmit={handleUGCSubmit}
      />
    </div>
  );
};

export default App;

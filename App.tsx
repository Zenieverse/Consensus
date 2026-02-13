
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
import CommentsSection from './components/CommentsSection';

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
  const [showHowToPlay, setShowHowToPlay] = useState(false);

  // Load submissions and check status
  useEffect(() => {
    const subs = StorageService.getSubmissions();
    const existing = subs.find(s => s.promptId === activePrompt.id);
    if (existing) {
      setUserVote(existing.voteOption);
      setUserPrediction(existing.predictedTopOption);
      setHasSubmitted(true);
    }
  }, [activePrompt.id]);

  // Show how to play to first-time users
  useEffect(() => {
    const hasSeen = localStorage.getItem('consensus_onboarding_seen');
    if (!hasSeen) {
      setShowHowToPlay(true);
      localStorage.setItem('consensus_onboarding_seen', 'true');
    }
  }, []);

  // Timer simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        const [h, m, s] = prev.split(':').map(Number);
        let ns = s - 1, nm = m, nh = h;
        if (ns < 0) { ns = 59; nm -= 1; }
        if (nm < 0) { nm = 59; nh -= 1; }
        return `${String(nh).padStart(2, '0')}:${String(nm).padStart(2, '0')}:${String(ns).padStart(2, '0')}`;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const triggerConfetti = () => {
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#FF4500', '#0079D3', '#FFFFFF', '#FFD700']
    });
  };

  const handleShare = async () => {
    const text = `Can Reddit agree... for once? I just predicted today's Consensus on ${activePrompt.question}. Play with me!`;
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Consensus Game', text, url: window.location.href });
      } catch (err) { console.log('Error sharing', err); }
    } else {
      navigator.clipboard.writeText(text);
      alert('Link copied to clipboard!');
    }
  };

  const handleSubmit = async () => {
    if (userVote === null || userPrediction === null) return;
    setIsLocking(true);
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

    // Update stats logic
    const newStats = { ...userStats };
    newStats.predictionsMade += 1;
    newStats.totalScore += 2; // Participation points
    StorageService.updateUserStats(newStats);
    setUserStats(newStats);
    
    triggerConfetti();
  };

  const handleUGCSubmit = (question: string, options: string[]) => {
    StorageService.submitUGC({
      id: `ugc_${Date.now()}`,
      author: 'u/current_user',
      question,
      options,
      status: 'pending'
    });
    alert("Prompt submitted! The community will see it soon.");
    setIsUGCModalOpen(false);
  };

  const NavButton = ({ view, icon, label }: { view: GameView, icon: string, label: string }) => (
    <button
      onClick={() => setCurrentView(view)}
      className={`flex flex-col items-center justify-center py-2 px-6 transition-all duration-300 relative rounded-xl ${
        currentView === view ? 'text-reddit-orange bg-orange-50/50' : 'text-gray-400 hover:text-gray-600'
      }`}
    >
      <i className={`fa-solid ${icon} text-xl mb-1`}></i>
      <span className="text-[9px] font-black uppercase tracking-wider">{label}</span>
      {currentView === view && (
        <span className="absolute bottom-1 w-1 h-1 bg-reddit-orange rounded-full"></span>
      )}
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center pb-32">
      {/* Header */}
      <header className="w-full bg-white border-b border-gray-200 sticky top-0 z-40 px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-reddit-orange rounded-xl flex items-center justify-center text-white text-lg shadow-lg shadow-orange-100 transform -rotate-3 hover:rotate-0 transition-transform cursor-pointer">
             <i className="fa-solid fa-brain"></i>
          </div>
          <div>
            <h1 className="font-black text-lg tracking-tighter text-gray-900 leading-none">CONSENSUS</h1>
            <p className="text-[9px] text-reddit-orange font-black uppercase tracking-widest">Oracle Lab v1.0</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
           <div className="flex flex-col items-end">
              <span className="text-[9px] font-black text-gray-400 uppercase">Points</span>
              <p className="font-black text-gray-900 leading-none">{userStats.totalScore}</p>
           </div>
           <button 
             onClick={() => setShowHowToPlay(true)}
             className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:text-gray-800 transition-colors"
           >
             <i className="fa-solid fa-question text-xs"></i>
           </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="w-full max-w-lg px-4 pt-8">
        {currentView === GameView.VOTING && (
          <div className="space-y-6">
            <PromptCard prompt={activePrompt} dayNumber={43} />
            
            <div className={`bg-white p-6 rounded-3xl shadow-xl border border-gray-200 transition-all ${isLocking ? 'opacity-50 pointer-events-none' : ''}`}>
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
                       <i className="fa-solid fa-circle-notch animate-spin"></i> CALCULATING...
                    </span>
                  ) : (
                    "LOCK IN PREDICTION"
                  )}
                </button>
              ) : (
                <div className="space-y-4">
                  <div className="text-center p-6 bg-orange-50 rounded-2xl border-2 border-reddit-orange border-dashed animate-pulse-soft">
                    <p className="font-black text-gray-900 mb-1 tracking-tight">VOTE RECORDED 🔒</p>
                    <p className="text-xs text-gray-600 font-medium">
                      Results reveal in <span className="text-reddit-orange font-black">{timeLeft}</span>.
                    </p>
                  </div>
                  <button 
                    onClick={handleShare}
                    className="w-full py-3 bg-white border-2 border-gray-100 rounded-xl font-bold text-gray-600 hover:bg-gray-50 flex items-center justify-center gap-2 transition-all active:scale-95"
                  >
                    <i className="fa-solid fa-share-nodes"></i> Invite Challengers
                  </button>
                </div>
              )}
            </div>
            
            <CommentsSection comments={activePrompt.comments || []} />
          </div>
        )}

        {currentView === GameView.REVEAL && (
          <div className="space-y-6">
            <RevealResults 
              prompt={pastPrompt} 
              userSubmission={StorageService.getSubmissions().find(s => s.promptId === pastPrompt.id)} 
            />
            <CommentsSection comments={pastPrompt.comments || []} />
          </div>
        )}

        {currentView === GameView.LEADERBOARD && (
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-reddit-orange to-orange-600 p-8 rounded-3xl shadow-2xl text-white relative overflow-hidden">
              <h2 className="text-xl font-black mb-6 flex items-center gap-2 relative z-10">
                 <i className="fa-solid fa-user-astronaut"></i> Your Oracle Stats
              </h2>
              <div className="grid grid-cols-3 gap-4 relative z-10">
                <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20">
                  <p className="text-[9px] font-black uppercase tracking-widest opacity-70 mb-1">XP</p>
                  <p className="text-2xl font-black">{userStats.totalScore}</p>
                </div>
                <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20">
                  <p className="text-[9px] font-black uppercase tracking-widest opacity-70 mb-1">Predictions</p>
                  <p className="text-2xl font-black">{userStats.predictionsMade}</p>
                </div>
                <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20">
                  <p className="text-[9px] font-black uppercase tracking-widest opacity-70 mb-1">Streak</p>
                  <p className="text-2xl font-black flex items-center gap-1">
                    {userStats.currentStreak} <i className="fa-solid fa-fire text-sm text-yellow-300"></i>
                  </p>
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 opacity-10 transform rotate-12">
                 <i className="fa-solid fa-award text-9xl"></i>
              </div>
            </div>
            <LeaderboardPanel />
          </div>
        )}
      </main>

      {/* Modern Navigation */}
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-xl border border-gray-200 p-1.5 flex items-center gap-1 z-50 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] ring-1 ring-black/5">
        <NavButton view={GameView.VOTING} icon="fa-bolt-lightning" label="Predict" />
        <div className="w-px h-10 bg-gray-100 mx-1"></div>
        <NavButton view={GameView.REVEAL} icon="fa-chart-simple" label="Results" />
        <div className="w-px h-10 bg-gray-100 mx-1"></div>
        <NavButton view={GameView.LEADERBOARD} icon="fa-ranking-star" label="Ranks" />
      </nav>

      {/* Onboarding / About Modal */}
      {showHowToPlay && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md">
          <div className="bg-white rounded-[32px] w-full max-w-sm p-8 text-center animate-in zoom-in-95 duration-300">
            <div className="w-20 h-20 bg-orange-100 text-reddit-orange rounded-3xl flex items-center justify-center text-4xl mx-auto mb-6">
               <i className="fa-solid fa-lightbulb"></i>
            </div>
            <h2 className="text-2xl font-black text-gray-900 mb-2">How to play</h2>
            <div className="space-y-6 text-left mb-8">
               <div className="flex gap-4">
                  <span className="w-6 h-6 rounded-full bg-reddit-orange text-white text-xs font-bold flex items-center justify-center shrink-0">1</span>
                  <p className="text-sm text-gray-600 font-medium">Cast your personal vote on today's daily question.</p>
               </div>
               <div className="flex gap-4">
                  <span className="w-6 h-6 rounded-full bg-blue-500 text-white text-xs font-bold flex items-center justify-center shrink-0">2</span>
                  <p className="text-sm text-gray-600 font-medium">Predict which option the Reddit community will pick most.</p>
               </div>
               <div className="flex gap-4">
                  <span className="w-6 h-6 rounded-full bg-green-500 text-white text-xs font-bold flex items-center justify-center shrink-0">3</span>
                  <p className="text-sm text-gray-600 font-medium">Earn Oracle points and build streaks for accurate predictions!</p>
               </div>
            </div>
            <button 
              onClick={() => setShowHowToPlay(false)}
              className="w-full py-4 bg-reddit-orange text-white rounded-2xl font-black shadow-lg shadow-orange-200 active:scale-95 transition-transform"
            >
              GOT IT, LET'S PLAY!
            </button>
          </div>
        </div>
      )}

      {/* UGC Modal */}
      <UGCModal 
        isOpen={isUGCModalOpen} 
        onClose={() => setIsUGCModalOpen(false)} 
        onSubmit={handleUGCSubmit}
      />
    </div>
  );
};

export default App;

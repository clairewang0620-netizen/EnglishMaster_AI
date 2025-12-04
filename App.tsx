import React, { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import FlashcardMode from './components/FlashcardMode';
import QuizMode from './components/QuizMode';
import WordListMode from './components/WordListMode';
import MistakeBook from './components/MistakeBook';
import { COURSE_CONTENT } from './constants';
import { ArrowLeft, Layers, Brain, CheckSquare, MessageCircle } from 'lucide-react';

const App: React.FC = () => {
  const [view, setView] = useState('dashboard'); // dashboard, level, mistake, chat
  const [activeLevelId, setActiveLevelId] = useState<string | null>(null);
  const [learnMode, setLearnMode] = useState<'list' | 'flashcard' | 'quiz'>('list');
  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('english_pro');
    if (saved === 'true') setIsPremium(true);
  }, []);

  const handleUnlock = () => {
      setIsPremium(true);
      localStorage.setItem('english_pro', 'true');
      alert("Pro features unlocked! 🚀");
  };

  const currentLevel = COURSE_CONTENT.find(l => l.id === activeLevelId);

  // Render Dashboard
  if (view === 'dashboard') {
      return <Dashboard 
        onLevelSelect={(id) => { setActiveLevelId(id); setView('level'); }}
        onMistakeBook={() => setView('mistake')}
        onAiChat={() => alert("AI Chat Feature is coming in next update!")} 
        isPremium={isPremium}
        onUnlock={handleUnlock}
      />;
  }

  // Render Mistake Book
  if (view === 'mistake') {
      return <MistakeBook onBack={() => setView('dashboard')} />;
  }

  // Render Level View
  return (
    <div className="h-screen flex flex-col bg-slate-50">
        {/* Top Bar */}
        <div className="bg-white px-4 py-4 shadow-sm z-10 flex flex-col gap-4">
            <div className="flex items-center gap-3">
                <button onClick={() => setView('dashboard')} className="p-2 hover:bg-slate-100 rounded-full text-slate-600"><ArrowLeft size={20}/></button>
                <div>
                    <h1 className="font-bold text-slate-800 leading-none">{currentLevel?.title}</h1>
                    <p className="text-xs text-slate-400">{currentLevel?.words.length} Words</p>
                </div>
            </div>
            {/* Mode Switcher */}
            <div className="flex bg-slate-100 p-1 rounded-xl">
                <button onClick={() => setLearnMode('list')} className={`flex-1 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1 ${learnMode === 'list' ? 'bg-white shadow-sm text-teal-600' : 'text-slate-400'}`}>
                    <Layers size={14}/> List
                </button>
                <button onClick={() => setLearnMode('flashcard')} className={`flex-1 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1 ${learnMode === 'flashcard' ? 'bg-white shadow-sm text-teal-600' : 'text-slate-400'}`}>
                    <Brain size={14}/> Cards
                </button>
                <button onClick={() => setLearnMode('quiz')} className={`flex-1 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1 ${learnMode === 'quiz' ? 'bg-white shadow-sm text-teal-600' : 'text-slate-400'}`}>
                    <CheckSquare size={14}/> Quiz
                </button>
            </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto px-4 pb-20">
            {learnMode === 'list' && <WordListMode words={currentLevel?.words || []} />}
            {learnMode === 'flashcard' && <FlashcardMode words={currentLevel?.words || []} />}
            {learnMode === 'quiz' && <QuizMode words={currentLevel?.words || []} />}
        </div>
    </div>
  );
};

export default App;
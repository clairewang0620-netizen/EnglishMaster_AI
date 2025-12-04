import React, { useState, useEffect } from 'react';
import { COURSE_CONTENT } from './constants';
import { playTextToSpeech, generateExplanation } from './geminiService';
import { Level, Word } from './types';
import { 
  ArrowLeft, Layers, Brain, CheckSquare, MessageCircle, 
  Lock, Crown, KeyRound, Star, Map, Zap, Book, 
  BrainCircuit, History, Volume2, Sparkles, BookOpen, 
  PlayCircle, Mic, Loader2, Trash2, ChevronRight, ChevronLeft,
  RefreshCw
} from 'lucide-react';

// --- 组件 1: Dashboard (主页) ---
interface DashboardProps {
  onLevelSelect: (id: string) => void;
  onMistakeBook: () => void;
  onAiChat: () => void;
  isPremium: boolean;
  onUnlock: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onLevelSelect, onMistakeBook, onAiChat, isPremium, onUnlock }) => {
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [licenseKey, setLicenseKey] = useState('');
  const [error, setError] = useState('');

  const handleLevelClick = (id: string, isLocked: boolean) => {
    if (isLocked) {
      setShowUpgradeModal(true);
      setError('');
    } else {
      onLevelSelect(id);
    }
  };

  const verifyLicense = () => {
    if (licenseKey.trim().toUpperCase() === 'ENGLISH2025') {
        onUnlock();
        setShowUpgradeModal(false);
    } else {
        setError('Invalid code. Try "ENGLISH2025"');
    }
  };

  return (
    <div className="min-h-screen pb-32 bg-slate-50">
      <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-slate-200 px-6 py-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-2">
            <div className="bg-teal-600 p-1.5 rounded-lg">
                <Map size={18} className="text-white" />
            </div>
            <span className="font-extrabold text-slate-800 text-lg tracking-tight">Lumière English</span>
        </div>
        
        {isPremium ? (
             <div className="flex items-center gap-1.5 bg-amber-100 px-3 py-1 rounded-full border border-amber-200 shadow-sm">
                <Crown size={14} className="text-amber-600 fill-amber-600" />
                <span className="text-xs font-bold text-amber-700 uppercase">Pro</span>
            </div>
        ) : (
            <button 
                onClick={() => setShowUpgradeModal(true)}
                className="flex items-center gap-1.5 bg-slate-900 text-white px-4 py-1.5 rounded-full text-xs font-bold hover:bg-slate-700 transition-colors"
            >
                <Zap size={12} fill="currentColor" />
                Unlock All
            </button>
        )}
      </header>

      <div className="max-w-md mx-auto px-4 pt-6 space-y-6">
        <div className="grid grid-cols-2 gap-3">
            <button 
                onClick={onMistakeBook}
                className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center gap-2 hover:border-red-200 hover:bg-red-50 transition-colors group"
            >
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-500 group-hover:scale-110 transition-transform">
                    <History size={20} />
                </div>
                <span className="font-bold text-slate-700 text-sm">Mistake Book</span>
            </button>
            <button 
                onClick={onAiChat}
                className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center gap-2 hover:border-purple-200 hover:bg-purple-50 transition-colors group"
            >
                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-500 group-hover:scale-110 transition-transform">
                    <BrainCircuit size={20} />
                </div>
                <span className="font-bold text-slate-700 text-sm">AI Tutor</span>
            </button>
        </div>

        <div className="space-y-4">
            <h2 className="text-lg font-black text-slate-800 px-1">Curriculum</h2>
            {COURSE_CONTENT.map((level) => {
                const isLocked = level.isPremium && !isPremium;
                return (
                    <button
                        key={level.id}
                        onClick={() => handleLevelClick(level.id, isLocked)}
                        className={`w-full text-left p-5 rounded-3xl border transition-all relative overflow-hidden group ${
                            isLocked 
                            ? 'bg-slate-100 border-slate-200' 
                            : 'bg-white border-slate-200 shadow-sm hover:shadow-md hover:border-teal-300'
                        }`}
                    >
                        <div className="flex items-center gap-4 relative z-10">
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-inner ${isLocked ? 'bg-slate-200 grayscale' : 'bg-teal-50'}`}>
                                {level.icon}
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center justify-between mb-1">
                                    <h3 className={`font-bold text-lg ${isLocked ? 'text-slate-500' : 'text-slate-800'}`}>{level.title}</h3>
                                    {isLocked && <Lock size={16} className="text-slate-400" />}
                                    {!isLocked && <div className="bg-teal-100 text-teal-700 text-[10px] font-bold px-2 py-0.5 rounded-full">OPEN</div>}
                                </div>
                                <p className="text-xs font-bold text-teal-600 uppercase tracking-wide mb-0.5">{level.subTitle}</p>
                                <p className="text-xs text-slate-400 truncate">{level.description}</p>
                            </div>
                        </div>
                    </button>
                )
            })}
        </div>
      </div>

      {showUpgradeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fadeIn">
             <div className="bg-white rounded-[2rem] p-6 w-full max-w-sm shadow-2xl relative">
                <button onClick={() => setShowUpgradeModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">✕</button>
                <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Crown size={30} className="text-amber-500" />
                    </div>
                    <h2 className="text-xl font-black text-slate-800">Unlock All Levels</h2>
                    <p className="text-slate-500 text-sm mt-1">Get full access to Advanced vocabulary, Business English, and AI features.</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 mb-4">
                    <div className="relative">
                        <KeyRound className="absolute left-3 top-3.5 text-slate-400" size={18} />
                        <input 
                            type="text" 
                            value={licenseKey}
                            onChange={(e) => setLicenseKey(e.target.value)}
                            placeholder="Enter Code (ENGLISH2025)"
                            className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 font-mono text-sm"
                        />
                    </div>
                    {error && <p className="text-red-500 text-xs mt-2 font-bold">{error}</p>}
                </div>
                <button onClick={verifyLicense} className="w-full bg-slate-900 text-white font-bold py-3.5 rounded-xl">Activate Premium</button>
             </div>
        </div>
      )}
    </div>
  );
};

// --- 组件 2: FlashcardMode (抽认卡) ---
const FlashcardMode: React.FC<{ words: Word[] }> = ({ words }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const currentWord = words[currentIndex];

  const handleNext = () => {
    setIsFlipped(false);
    setTimeout(() => { if (currentIndex < words.length - 1) setCurrentIndex(prev => prev + 1); }, 150);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setTimeout(() => { if (currentIndex > 0) setCurrentIndex(prev => prev - 1); }, 150);
  };

  return (
    <div className="flex flex-col h-full py-4">
        <div className="flex justify-between items-center mb-4 px-2">
            <span className="text-slate-400 font-mono text-xs font-bold">CARD {currentIndex + 1} / {words.length}</span>
            <div className="flex gap-2">
                <button onClick={handlePrev} disabled={currentIndex === 0} className="p-2 bg-white rounded-full shadow-sm disabled:opacity-30"><ChevronLeft size={20} /></button>
                <button onClick={handleNext} disabled={currentIndex === words.length - 1} className="p-2 bg-white rounded-full shadow-sm disabled:opacity-30"><ChevronRight size={20} /></button>
            </div>
        </div>

        <div className="flex-1 perspective-1000 relative group cursor-pointer" onClick={() => setIsFlipped(!isFlipped)}>
            <div className={`w-full h-full transition-all duration-500 transform-style-3d relative ${isFlipped ? 'rotate-y-180' : ''}`}>
                <div className="absolute inset-0 backface-hidden bg-white rounded-3xl shadow-xl flex flex-col items-center justify-center p-8 border border-slate-100">
                    <span className="text-teal-600 font-bold tracking-widest text-xs uppercase mb-4">English</span>
                    <h2 className="text-4xl font-black text-slate-800 text-center mb-2">{currentWord.english}</h2>
                    <p className="text-slate-400 font-mono mb-6">{currentWord.ipa}</p>
                    <button onClick={(e) => { e.stopPropagation(); playTextToSpeech(currentWord.english); }} className="w-12 h-12 bg-teal-50 rounded-full flex items-center justify-center text-teal-600 hover:bg-teal-100"><Volume2 size={24} /></button>
                    <p className="absolute bottom-6 text-slate-300 text-xs">Tap to flip</p>
                </div>
                <div className="absolute inset-0 backface-hidden rotate-y-180 bg-teal-600 rounded-3xl shadow-xl flex flex-col items-center justify-center p-8 text-white">
                    <span className="text-teal-200 font-bold tracking-widest text-xs uppercase mb-4">Meaning</span>
                    <h2 className="text-3xl font-bold text-center mb-6">{currentWord.chinese}</h2>
                    <div className="bg-white/10 p-4 rounded-xl w-full text-center backdrop-blur-sm">
                        <p className="text-lg italic font-medium mb-1">"{currentWord.exampleEn}"</p>
                        <p className="text-sm text-teal-100">{currentWord.exampleCn}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};

// --- 组件 3: QuizMode (测验) ---
const QuizMode: React.FC<{ words: Word[] }> = ({ words }) => {
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    const q = words.map((word) => {
        const type = Math.random() > 0.5 ? 'mc' : 'spelling';
        if (type === 'mc') {
            const otherWords = words.filter(w => w.id !== word.id);
            const wrongOptions = otherWords.sort(() => 0.5 - Math.random()).slice(0, 3).map(w => w.chinese);
            const options = [...wrongOptions, word.chinese].sort(() => 0.5 - Math.random());
            return { type: 'mc', word, options, correct: word.chinese };
        } else {
            return { type: 'spelling', word, correct: word.english };
        }
    }).sort(() => 0.5 - Math.random());
    setQuestions(q);
  }, [words]);

  const handleAnswer = (answer: string) => {
    const currentQ = questions[currentIndex];
    const isCorrect = answer.toLowerCase().trim() === currentQ.correct.toLowerCase().trim();
    setSelectedOption(answer);
    setShowResult(true);
    if (isCorrect) {
        setScore(prev => prev + 1);
        playTextToSpeech("Correct");
    } else {
        playTextToSpeech("Incorrect");
        const mistakes = JSON.parse(localStorage.getItem('mistakes') || '[]');
        if (!mistakes.includes(currentQ.word.id)) {
            mistakes.push(currentQ.word.id);
            localStorage.setItem('mistakes', JSON.stringify(mistakes));
        }
    }
  };

  const nextQuestion = () => {
    setShowResult(false);
    setSelectedOption(null);
    setInputValue('');
    if (currentIndex < questions.length - 1) setCurrentIndex(prev => prev + 1);
    else setIsCompleted(true);
  };

  if (questions.length === 0) return <div>Loading...</div>;
  if (isCompleted) {
      return (
          <div className="h-full flex flex-col items-center justify-center p-8 text-center">
              <div className="w-24 h-24 bg-teal-100 rounded-full flex items-center justify-center mb-6"><span className="text-4xl">🏆</span></div>
              <h2 className="text-3xl font-black text-slate-800 mb-2">Quiz Complete!</h2>
              <p className="text-slate-500 mb-8">You scored {score} out of {questions.length}</p>
              <button onClick={() => window.location.reload()} className="bg-teal-600 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2"><RefreshCw size={18} /> Restart</button>
          </div>
      )
  }

  const currentQ = questions[currentIndex];

  return (
    <div className="py-6 h-full flex flex-col max-w-lg mx-auto">
        <div className="w-full bg-slate-100 h-2 rounded-full mb-8 overflow-hidden">
            <div className="bg-teal-500 h-full transition-all duration-300" style={{ width: `${((currentIndex) / questions.length) * 100}%` }}></div>
        </div>
        <div className="flex-1">
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 text-center mb-8">
                {currentQ.type === 'mc' ? (
                    <>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Translate</span>
                        <h2 className="text-3xl font-black text-slate-800 mt-2">{currentQ.word.english}</h2>
                        <button onClick={() => playTextToSpeech(currentQ.word.english)} className="mt-4 mx-auto w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-600"><Volume2 size={18}/></button>
                    </>
                ) : (
                    <>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Spell the word</span>
                        <h2 className="text-2xl font-bold text-slate-800 mt-2 mb-1">{currentQ.word.chinese}</h2>
                    </>
                )}
            </div>
            <div className="space-y-3">
                {currentQ.type === 'mc' ? (
                    currentQ.options.map((opt: string) => {
                        let btnClass = "bg-white border-2 border-slate-100 text-slate-700 hover:border-teal-200";
                        if (showResult) {
                            if (opt === currentQ.correct) btnClass = "bg-teal-100 border-teal-500 text-teal-800";
                            else if (opt === selectedOption) btnClass = "bg-red-100 border-red-500 text-red-800";
                            else btnClass = "opacity-50 border-transparent bg-slate-50";
                        }
                        return <button key={opt} disabled={showResult} onClick={() => handleAnswer(opt)} className={`w-full p-4 rounded-xl font-bold text-left transition-all ${btnClass}`}>{opt}</button>;
                    })
                ) : (
                    <div className="relative">
                        <input type="text" disabled={showResult} value={inputValue} onChange={(e) => setInputValue(e.target.value)} placeholder="Type English word..." className="w-full p-4 rounded-xl border-2 border-slate-200 text-lg font-bold text-center focus:border-teal-500 focus:outline-none" />
                        {!showResult && <button onClick={() => handleAnswer(inputValue)} className="mt-4 w-full bg-teal-600 text-white font-bold py-3 rounded-xl">Submit</button>}
                        {showResult && <div className={`mt-4 p-4 rounded-xl text-center font-bold ${inputValue.toLowerCase().trim() === currentQ.correct.toLowerCase() ? 'bg-teal-100 text-teal-800' : 'bg-red-100 text-red-800'}`}>Correct: {currentQ.correct}</div>}
                    </div>
                )}
            </div>
        </div>
        {showResult && <button onClick={nextQuestion} className="w-full bg-slate-900 text-white font-bold py-4 rounded-2xl shadow-xl mt-6 animate-slide-up">{currentIndex === questions.length - 1 ? "Finish Quiz" : "Next Question"}</button>}
    </div>
  );
};

// --- 组件 4: WordListMode (单词表) ---
const WordListMode: React.FC<{ words: Word[] }> = ({ words }) => {
  return (
    <div className="space-y-4 py-4">
        {words.map((word, idx) => (
            <div key={word.id} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 animate-slide-up" style={{ animationDelay: `${idx * 0.05}s` }}>
                <div className="flex justify-between items-start mb-2">
                    <div><h3 className="text-xl font-black text-slate-800">{word.english}</h3><span className="text-slate-400 text-sm font-mono">{word.ipa}</span></div>
                    <button onClick={() => playTextToSpeech(word.english)} className="w-10 h-10 bg-slate-50 text-slate-600 rounded-full flex items-center justify-center"><Volume2 size={18}/></button>
                </div>
                <div className="border-t border-slate-50 pt-2 mt-2">
                    <p className="text-teal-700 font-bold">{word.chinese}</p>
                    <p className="text-slate-400 text-xs mt-1 italic">"{word.exampleEn}"</p>
                    <p className="text-slate-300 text-xs">{word.exampleCn}</p>
                </div>
            </div>
        ))}
    </div>
  );
};

// --- 组件 5: MistakeBook (错题本) ---
const MistakeBook: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const [mistakeWords, setMistakeWords] = useState<Word[]>([]);
    useEffect(() => {
        const ids = JSON.parse(localStorage.getItem('mistakes') || '[]');
        const words: Word[] = [];
        COURSE_CONTENT.forEach(lvl => lvl.words.forEach(w => { if (ids.includes(w.id)) words.push(w); }));
        setMistakeWords(words);
    }, []);
    const removeMistake = (id: string) => {
        const newIds = mistakeWords.filter(w => w.id !== id).map(w => w.id);
        localStorage.setItem('mistakes', JSON.stringify(newIds));
        setMistakeWords(prev => prev.filter(w => w.id !== id));
    };
    return (
        <div className="min-h-screen bg-slate-50 p-6">
            <div className="flex items-center gap-4 mb-8">
                <button onClick={onBack} className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-slate-600"><ArrowLeft size={20}/></button>
                <h1 className="text-2xl font-black text-slate-800">Mistake Book</h1>
            </div>
            {mistakeWords.length === 0 ? <div className="text-center text-slate-400 mt-20"><p>No mistakes yet!</p></div> : (
                <div className="space-y-4">{mistakeWords.map(word => (
                    <div key={word.id} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex justify-between items-center">
                        <div><h3 className="text-lg font-bold text-slate-800">{word.english}</h3><p className="text-slate-500 text-sm">{word.chinese}</p></div>
                        <div className="flex gap-2"><button onClick={() => playTextToSpeech(word.english)} className="p-2 text-teal-600 bg-teal-50 rounded-lg"><Volume2 size={18}/></button><button onClick={() => removeMistake(word.id)} className="p-2 text-red-400 hover:bg-red-50 rounded-lg"><Trash2 size={18}/></button></div>
                    </div>
                ))}</div>
            )}
        </div>
    );
};

// --- 组件 6: LessonDetail (课程详情) ---
const LessonDetail: React.FC<{ lessonId: string; onBack: () => void }> = ({ lessonId, onBack }) => {
  const [level, setLevel] = useState<Level | null>(null);
  const [activeTab, setActiveTab] = useState<'vocab' | 'phrases' | 'scenario'>('vocab');
  const [explanation, setExplanation] = useState<string | null>(null);
  const [loadingExpl, setLoadingExpl] = useState(false);
  const [playingItem, setPlayingItem] = useState<string | null>(null);

  useEffect(() => { setLevel(COURSE_CONTENT.find(l => l.id === lessonId) || null); }, [lessonId]);
  if (!level) return <div className="p-8 text-center text-slate-500">Loading...</div>;

  const handlePlayAudio = async (text: string, id: string, voice: any = 'Kore') => {
      if (playingItem === id) return;
      setPlayingItem(id);
      try { await playTextToSpeech(text, voice); } finally { setTimeout(() => setPlayingItem(null), 1000); }
  };
  const handleExplain = async (text: string) => {
    setLoadingExpl(true); setExplanation(null);
    const result = await generateExplanation(text);
    setExplanation(result); setLoadingExpl(false);
  };

  return (
    <div className="flex flex-col h-screen bg-[#F3F0FF] overflow-hidden">
      <div className="bg-white px-6 pt-6 pb-4 shadow-sm z-20 rounded-b-[2rem]">
        <div className="flex items-center gap-4 mb-4 mt-8">
            <button onClick={onBack} className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors"><ArrowLeft size={20} strokeWidth={2.5} /></button>
            <div className="flex-1"><span className="text-[10px] font-black tracking-widest uppercase text-indigo-500 bg-indigo-50 px-2 py-1 rounded-md">{level.subTitle}</span><h1 className="text-xl font-extrabold text-slate-800 mt-1">{level.title}</h1></div>
            <div className="text-3xl">{level.icon}</div>
        </div>
        <div className="flex bg-slate-100 p-1 rounded-xl">
            {['vocab', 'phrases', 'scenario'].map((tab) => (
                <button key={tab} onClick={() => setActiveTab(tab as any)} className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${activeTab === tab ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>
                    {tab === 'vocab' && <BookOpen size={14} />}{tab === 'phrases' && <MessageCircle size={14} />}{tab === 'scenario' && <PlayCircle size={14} />}<span className="capitalize">{tab}</span>
                </button>
            ))}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto no-scrollbar p-6 pb-24">
        {activeTab === 'vocab' && <div className="grid gap-4">{level.words.map((item, idx) => (
            <div key={item.id} className="bg-white p-5 rounded-3xl shadow-[0_4px_20px_-10px_rgba(0,0,0,0.1)] flex items-center justify-between border-2 border-transparent hover:border-indigo-100 transition-all animate-slide-up active:scale-95" onClick={() => handlePlayAudio(item.english, item.id)}>
                <div><div className="flex items-center gap-2 mb-1"><h3 className="text-xl font-black text-slate-800 tracking-tight">{item.english}</h3></div>{item.ipa && <p className="text-indigo-400 font-mono text-sm mb-1">{item.ipa}</p>}<p className="text-slate-500 font-medium text-sm">{item.chinese}</p></div>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${playingItem === item.id ? 'bg-indigo-500 text-white scale-110' : 'bg-indigo-50 text-indigo-600'}`}>{playingItem === item.id ? <Loader2 size={20} className="animate-spin" /> : <Volume2 size={20} />}</div>
            </div>
        ))}</div>}
        {activeTab === 'phrases' && <div className="space-y-4">{level.words.map((item, idx) => (
            <div key={item.id + '_ph'} className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 animate-slide-up">
                <div className="flex justify-between items-start mb-3"><span className={`text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wide bg-purple-100 text-purple-700`}>Example</span><button onClick={(e) => { e.stopPropagation(); handleExplain(item.exampleEn); }} className="text-xs font-bold text-indigo-500 flex items-center gap-1 bg-indigo-50 px-2 py-1 rounded-full hover:bg-indigo-100"><Sparkles size={12} /> Explain</button></div>
                <h3 className="text-lg font-bold text-slate-800 mb-1 leading-tight">{item.exampleEn}</h3><p className="text-slate-500 text-sm mb-4">{item.exampleCn}</p>
                <button onClick={() => handlePlayAudio(item.exampleEn, item.id + '_ph')} className={`w-full py-3 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${playingItem === item.id + '_ph' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-indigo-50 hover:text-indigo-600'}`}>{playingItem === item.id + '_ph' ? <><Loader2 size={16} className="animate-spin" /> Loading...</> : <><Volume2 size={16} /> Listen</>}</button>
            </div>
        ))}{(explanation || loadingExpl) && <div className="fixed bottom-6 left-4 right-4 bg-slate-900 text-white p-5 rounded-3xl shadow-2xl z-50 animate-slide-up"><div className="flex justify-between items-center mb-2"><div className="flex items-center gap-2 text-amber-400"><Sparkles size={18} fill="currentColor" /><span className="font-bold text-sm">Gemini Tutor</span></div><button onClick={() => setExplanation(null)} className="text-slate-400 hover:text-white">✕</button></div>{loadingExpl ? <div className="h-10 flex items-center gap-2 text-slate-400 text-sm"><Loader2 size={16} className="animate-spin" /> Thinking...</div> : <p className="text-sm leading-relaxed text-slate-200">{explanation}</p>}</div>}</div>}
        {activeTab === 'scenario' && <div className="space-y-6">{level.scenarios.length > 0 ? level.scenarios.map((scenario) => (
            <div key={scenario.id}><div className="bg-gradient-to-br from-indigo-600 to-indigo-700 text-white p-6 rounded-3xl shadow-lg shadow-indigo-200 mb-6"><h3 className="font-bold text-lg">{scenario.title}</h3><p className="text-indigo-100 text-sm mt-1 opacity-80">{scenario.description}</p></div><div className="space-y-4">{scenario.lines.map((line, idx) => { const isUser = idx % 2 === 0; return (<div key={idx} className={`flex gap-3 animate-slide-up ${isUser ? 'flex-row' : 'flex-row-reverse'}`}><div className="flex-shrink-0 w-10 h-10 rounded-full bg-white border-2 border-slate-100 flex items-center justify-center text-lg shadow-sm">{line.avatar}</div><div className={`flex-1 p-4 rounded-2xl max-w-[85%] relative group cursor-pointer transition-transform active:scale-95 ${isUser ? 'bg-white rounded-tl-none shadow-sm text-slate-800' : 'bg-indigo-500 text-white rounded-tr-none shadow-md'}`} onClick={() => handlePlayAudio(line.english, `s-${scenario.id}-${idx}`, isUser ? 'Kore' : 'Fenrir')}><p className="font-bold text-base mb-1 leading-snug">{line.english}</p><p className={`text-xs ${isUser ? 'text-slate-400' : 'text-indigo-200'}`}>{line.chinese}</p>{playingItem === `s-${scenario.id}-${idx}` && <div className="absolute top-2 right-2"><Loader2 size={14} className="animate-spin text-current opacity-50" /></div>}</div></div>); })}</div></div>
        )) : <div className="text-center text-slate-400 mt-10"><p>No scenarios available for this level yet.</p></div>}</div>}
      </div>
    </div>
  );
};

// --- Main App Component ---
const App: React.FC = () => {
  const [view, setView] = useState('dashboard');
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

  if (view === 'dashboard') {
      return <Dashboard onLevelSelect={(id) => { setActiveLevelId(id); setView('level'); }} onMistakeBook={() => setView('mistake')} onAiChat={() => alert("AI Chat Feature is coming in next update!")} isPremium={isPremium} onUnlock={handleUnlock} />;
  }
  if (view === 'mistake') {
      return <MistakeBook onBack={() => setView('dashboard')} />;
  }

  return (
    <div className="h-screen flex flex-col bg-slate-50">
        <div className="bg-white px-4 py-4 shadow-sm z-10 flex flex-col gap-4">
            <div className="flex items-center gap-3"><button onClick={() => setView('dashboard')} className="p-2 hover:bg-slate-100 rounded-full text-slate-600"><ArrowLeft size={20}/></button><div><h1 className="font-bold text-slate-800 leading-none">{currentLevel?.title}</h1><p className="text-xs text-slate-400">{currentLevel?.words.length} Words</p></div></div>
            <div className="flex bg-slate-100 p-1 rounded-xl">
                <button onClick={() => setLearnMode('list')} className={`flex-1 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1 ${learnMode === 'list' ? 'bg-white shadow-sm text-teal-600' : 'text-slate-400'}`}><Layers size={14}/> List</button>
                <button onClick={() => setLearnMode('flashcard')} className={`flex-1 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1 ${learnMode === 'flashcard' ? 'bg-white shadow-sm text-teal-600' : 'text-slate-400'}`}><Brain size={14}/> Cards</button>
                <button onClick={() => setLearnMode('quiz')} className={`flex-1 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1 ${learnMode === 'quiz' ? 'bg-white shadow-sm text-teal-600' : 'text-slate-400'}`}><CheckSquare size={14}/> Quiz</button>
            </div>
        </div>
        <div className="flex-1 overflow-y-auto px-4 pb-20">
            {learnMode === 'list' && <WordListMode words={currentLevel?.words || []} />}
            {learnMode === 'flashcard' && <FlashcardMode words={currentLevel?.words || []} />}
            {learnMode === 'quiz' && <QuizMode words={currentLevel?.words || []} />}
        </div>
        {/* Lesson Detail Overlay if needed for scenarios/phrases (Currently simplified to modes, but if we want detail view, we can add it here or use learnMode) 
            Wait, the design has LessonDetail for 'Learn' mode. Let's map 'list' to LessonDetail logic if needed, or keep WordListMode simple.
            Actually, let's keep it simple: List -> WordListMode, Cards -> FlashcardMode, Quiz -> QuizMode.
            But wait, LessonDetail had tabs for Vocab/Phrases/Scenario.
            Let's re-enable LessonDetail as the default view for "List" mode to keep that rich functionality.
        */}
    </div>
  );
};

export default App;

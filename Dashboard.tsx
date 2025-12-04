import React, { useState } from 'react';
import { COURSE_CONTENT } from '../constants';
import { Lock, Crown, KeyRound, Star, Map, Zap, Book, BrainCircuit, History } from 'lucide-react';

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
      {/* Header */}
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
        
        {/* Quick Actions */}
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

        {/* Course Levels */}
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

      {/* Unlock Modal */}
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

export default Dashboard;
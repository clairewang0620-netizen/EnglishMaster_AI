import React, { useState } from 'react';
import { Word } from '../types';
import { playTextToSpeech } from '../services/geminiService';
import { Volume2, RotateCcw, ChevronRight, ChevronLeft } from 'lucide-react';

interface FlashcardModeProps {
  words: Word[];
}

const FlashcardMode: React.FC<FlashcardModeProps> = ({ words }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const currentWord = words[currentIndex];

  const handleNext = () => {
    setIsFlipped(false);
    setTimeout(() => {
        if (currentIndex < words.length - 1) setCurrentIndex(prev => prev + 1);
    }, 150);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setTimeout(() => {
        if (currentIndex > 0) setCurrentIndex(prev => prev - 1);
    }, 150);
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
                
                {/* Front Side (English) */}
                <div className="absolute inset-0 backface-hidden bg-white rounded-3xl shadow-xl flex flex-col items-center justify-center p-8 border border-slate-100">
                    <span className="text-teal-600 font-bold tracking-widest text-xs uppercase mb-4">English</span>
                    <h2 className="text-4xl font-black text-slate-800 text-center mb-2">{currentWord.english}</h2>
                    <p className="text-slate-400 font-mono mb-6">{currentWord.ipa}</p>
                    <button 
                        onClick={(e) => { e.stopPropagation(); playTextToSpeech(currentWord.english); }}
                        className="w-12 h-12 bg-teal-50 rounded-full flex items-center justify-center text-teal-600 hover:bg-teal-100"
                    >
                        <Volume2 size={24} />
                    </button>
                    <p className="absolute bottom-6 text-slate-300 text-xs">Tap to flip</p>
                </div>

                {/* Back Side (Chinese & Context) */}
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

export default FlashcardMode;
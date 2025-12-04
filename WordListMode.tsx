import React from 'react';
import { Word } from '../types';
import { playTextToSpeech } from '../services/geminiService';
import { Volume2 } from 'lucide-react';

const WordListMode: React.FC<{ words: Word[] }> = ({ words }) => {
  return (
    <div className="space-y-4 py-4">
        {words.map((word, idx) => (
            <div key={word.id} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 animate-slide-up" style={{ animationDelay: `${idx * 0.05}s` }}>
                <div className="flex justify-between items-start mb-2">
                    <div>
                        <h3 className="text-xl font-black text-slate-800">{word.english}</h3>
                        <span className="text-slate-400 text-sm font-mono">{word.ipa}</span>
                    </div>
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
export default WordListMode;
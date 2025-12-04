import React, { useState, useEffect } from 'react';
import { COURSE_CONTENT } from '../constants';
import { Word } from '../types';
import { playTextToSpeech } from '../services/geminiService';
import { Trash2, Volume2, ArrowLeft } from 'lucide-react';

interface MistakeBookProps {
    onBack: () => void;
}

const MistakeBook: React.FC<MistakeBookProps> = ({ onBack }) => {
    const [mistakeWords, setMistakeWords] = useState<Word[]>([]);

    useEffect(() => {
        const ids = JSON.parse(localStorage.getItem('mistakes') || '[]');
        const words: Word[] = [];
        COURSE_CONTENT.forEach(lvl => {
            lvl.words.forEach(w => {
                if (ids.includes(w.id)) words.push(w);
            });
        });
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

            {mistakeWords.length === 0 ? (
                <div className="text-center text-slate-400 mt-20">
                    <p>No mistakes yet! Good job.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {mistakeWords.map(word => (
                        <div key={word.id} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex justify-between items-center">
                            <div>
                                <h3 className="text-lg font-bold text-slate-800">{word.english}</h3>
                                <p className="text-slate-500 text-sm">{word.chinese}</p>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => playTextToSpeech(word.english)} className="p-2 text-teal-600 bg-teal-50 rounded-lg"><Volume2 size={18}/></button>
                                <button onClick={() => removeMistake(word.id)} className="p-2 text-red-400 hover:bg-red-50 rounded-lg"><Trash2 size={18}/></button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MistakeBook;
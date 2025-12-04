import React, { useState, useEffect } from 'react';
import { Word } from '../types';
import { playTextToSpeech } from '../services/geminiService';
import { Check, X, Volume2, RefreshCw } from 'lucide-react';

interface QuizModeProps {
  words: Word[];
}

const QuizMode: React.FC<QuizModeProps> = ({ words }) => {
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  // Initialize Quiz
  useEffect(() => {
    const q = words.map((word, idx) => {
        // Mix question types: 50% MC, 50% Spelling
        const type = Math.random() > 0.5 ? 'mc' : 'spelling';
        
        if (type === 'mc') {
            // Generate wrong options
            const otherWords = words.filter(w => w.id !== word.id);
            const wrongOptions = otherWords.sort(() => 0.5 - Math.random()).slice(0, 3).map(w => w.chinese);
            const options = [...wrongOptions, word.chinese].sort(() => 0.5 - Math.random());
            return { type: 'mc', word, options, correct: word.chinese };
        } else {
            return { type: 'spelling', word, correct: word.english };
        }
    }).sort(() => 0.5 - Math.random()); // Shuffle questions
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
        // Save to Mistake Book
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
    if (currentIndex < questions.length - 1) {
        setCurrentIndex(prev => prev + 1);
    } else {
        setIsCompleted(true);
    }
  };

  if (questions.length === 0) return <div>Loading...</div>;
  if (isCompleted) {
      return (
          <div className="h-full flex flex-col items-center justify-center p-8 text-center">
              <div className="w-24 h-24 bg-teal-100 rounded-full flex items-center justify-center mb-6">
                  <span className="text-4xl">🏆</span>
              </div>
              <h2 className="text-3xl font-black text-slate-800 mb-2">Quiz Complete!</h2>
              <p className="text-slate-500 mb-8">You scored {score} out of {questions.length}</p>
              <button onClick={() => window.location.reload()} className="bg-teal-600 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2">
                  <RefreshCw size={18} /> Restart
              </button>
          </div>
      )
  }

  const currentQ = questions[currentIndex];

  return (
    <div className="py-6 h-full flex flex-col max-w-lg mx-auto">
        {/* Progress Bar */}
        <div className="w-full bg-slate-100 h-2 rounded-full mb-8 overflow-hidden">
            <div className="bg-teal-500 h-full transition-all duration-300" style={{ width: `${((currentIndex) / questions.length) * 100}%` }}></div>
        </div>

        <div className="flex-1">
            {/* Question Card */}
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
                        <button onClick={() => playTextToSpeech(currentQ.word.english)} className="mx-auto text-teal-600 text-sm font-bold flex items-center gap-1"><Volume2 size={14}/> Listen hint</button>
                    </>
                )}
            </div>

            {/* Answer Area */}
            <div className="space-y-3">
                {currentQ.type === 'mc' ? (
                    currentQ.options.map((opt: string) => {
                        let btnClass = "bg-white border-2 border-slate-100 text-slate-700 hover:border-teal-200";
                        if (showResult) {
                            if (opt === currentQ.correct) btnClass = "bg-teal-100 border-teal-500 text-teal-800";
                            else if (opt === selectedOption) btnClass = "bg-red-100 border-red-500 text-red-800";
                            else btnClass = "opacity-50 border-transparent bg-slate-50";
                        }
                        return (
                            <button
                                key={opt}
                                disabled={showResult}
                                onClick={() => handleAnswer(opt)}
                                className={`w-full p-4 rounded-xl font-bold text-left transition-all ${btnClass}`}
                            >
                                {opt}
                            </button>
                        );
                    })
                ) : (
                    <div className="relative">
                        <input 
                            type="text" 
                            disabled={showResult}
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="Type English word..."
                            className="w-full p-4 rounded-xl border-2 border-slate-200 text-lg font-bold text-center focus:border-teal-500 focus:outline-none"
                        />
                        {!showResult && (
                            <button onClick={() => handleAnswer(inputValue)} className="mt-4 w-full bg-teal-600 text-white font-bold py-3 rounded-xl">Submit</button>
                        )}
                        {showResult && (
                            <div className={`mt-4 p-4 rounded-xl text-center font-bold ${inputValue.toLowerCase().trim() === currentQ.correct.toLowerCase() ? 'bg-teal-100 text-teal-800' : 'bg-red-100 text-red-800'}`}>
                                Correct answer: {currentQ.correct}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>

        {/* Next Button */}
        {showResult && (
            <button onClick={nextQuestion} className="w-full bg-slate-900 text-white font-bold py-4 rounded-2xl shadow-xl mt-6 animate-slide-up">
                {currentIndex === questions.length - 1 ? "Finish Quiz" : "Next Question"}
            </button>
        )}
    </div>
  );
};

export default QuizMode;
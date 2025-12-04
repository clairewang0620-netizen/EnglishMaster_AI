import React, { useState, useEffect } from 'react';
import { COURSE_CONTENT } from './constants';
import { Level, Word } from './types';
import { playTextToSpeech, generateExplanation } from './geminiService';
import { 
  ArrowLeft, Layers, Brain, CheckSquare, MessageCircle, 
  Lock, Crown, KeyRound, Map, Zap, BookOpen, 
  PlayCircle, Mic, Loader2, Trash2, ChevronRight, ChevronLeft,
  RefreshCw, Sparkles, History, BrainCircuit, Volume2
} from 'lucide-react';

// --- Dashboard Component ---
const Dashboard: React.FC<{onLevelSelect:(id:string)=>void, onMistakeBook:()=>void, onAiChat:()=>void, isPremium:boolean, onUnlock:()=>void}> = ({ onLevelSelect, onMistakeBook, onAiChat, isPremium, onUnlock }) => {
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [key, setKey] = useState('');

  const verify = () => {
    if (key.trim().toUpperCase() === 'ENGLISH2025') {
        onUnlock(); setShowUpgrade(false); alert("🎉 Unlocked Successfully!");
    } else {
        alert("❌ Invalid Code");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      {/* Premium Header */}
      <div className="bg-gradient-to-r from-teal-600 to-emerald-600 text-white p-6 pb-12 rounded-b-[2.5rem] shadow-lg">
        <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2 font-black text-xl"><Map size={24}/> Lumière</div>
            <button onClick={() => setShowUpgrade(true)} className="bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold border border-white/30 flex items-center gap-1">
                {isPremium ? <><Crown size={12}/> PRO</> : <><Zap size={12}/> UPGRADE</>}
            </button>
        </div>
        <h1 className="text-2xl font-bold mb-2">Hello, Student 👋</h1>
        <p className="opacity-90 text-sm">Continue your daily practice.</p>
        
        <div className="flex gap-4 mt-6">
            <button onClick={onMistakeBook} className="flex-1 bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/20 flex flex-col items-center gap-1 hover:bg-white/20 transition-colors">
                <History className="text-amber-300" size={20}/>
                <span className="text-xs font-bold">Mistakes</span>
            </button>
            <button onClick={onAiChat} className="flex-1 bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/20 flex flex-col items-center gap-1 hover:bg-white/20 transition-colors">
                <BrainCircuit className="text-purple-300" size={20}/>
                <span className="text-xs font-bold">AI Tutor</span>
            </button>
        </div>
      </div>

      {/* Course List */}
      <div className="px-5 -mt-6 space-y-4">
        {COURSE_CONTENT.map((level, idx) => {
            const locked = level.isPremium && !isPremium;
            return (
                <div key={level.id} onClick={() => locked ? setShowUpgrade(true) : onLevelSelect(level.id)} className={`bg-white p-5 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-4 transition-transform active:scale-95 ${locked ? 'opacity-75 grayscale' : ''}`}>
                    <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-3xl shadow-inner">{level.icon}</div>
                    <div className="flex-1">
                        <div className="flex justify-between items-center">
                            <h3 className="font-bold text-slate-800 text-lg">{level.title}</h3>
                            {locked ? <Lock size={16} className="text-slate-400"/> : <div className="bg-teal-50 text-teal-600 text-[10px] font-bold px-2 py-0.5 rounded-full">OPEN</div>}
                        </div>
                        <p className="text-xs font-bold text-teal-600 uppercase tracking-wide">{level.subTitle}</p>
                        <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{level.description}</p>
                    </div>
                </div>
            )
        })}
      </div>

      {/* Unlock Modal */}
      {showUpgrade && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-6 animate-fadeIn">
            <div className="bg-white rounded-3xl p-6 w-full max-w-sm text-center shadow-2xl">
                <Crown size={48} className="mx-auto text-amber-500 mb-4 drop-shadow-sm" fill="currentColor"/>
                <h2 className="text-2xl font-black text-slate-800 mb-2">Unlock Everything</h2>
                <p className="text-slate-500 text-sm mb-6">Get access to Advanced Levels, Business English, and AI features.</p>
                <input value={key} onChange={e=>setKey(e.target.value)} placeholder="Enter Code: ENGLISH2025" className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl p-3 text-center font-bold font-mono mb-4 focus:border-teal-500 outline-none"/>
                <button onClick={verify} className="w-full bg-slate-900 text-white py-3.5 rounded-xl font-bold shadow-lg shadow-slate-300">Unlock Now</button>
                <button onClick={()=>setShowUpgrade(false)} className="mt-4 text-slate-400 text-sm font-bold">Maybe Later</button>
            </div>
        </div>
      )}
    </div>
  );
}

// --- Sub Components ---
const FlashcardView = ({words}: {words: any[]}) => {
  const [idx, setIdx] = useState(0); const [flip, setFlip] = useState(false);
  const w = words[idx];
  return (
    <div className="h-full flex flex-col py-4">
      <div className="flex-1 perspective-1000 cursor-pointer group" onClick={()=>setFlip(!flip)}>
        <div className={`relative w-full h-full transition-all duration-500 transform-style-3d ${flip?'rotate-y-180':''}`}>
          <div className="absolute inset-0 backface-hidden bg-white rounded-[2rem] shadow-xl border border-slate-100 flex flex-col items-center justify-center p-8">
            <span className="bg-teal-50 text-teal-600 px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase mb-6">English</span>
            <h2 className="text-4xl font-black text-slate-800 text-center mb-2">{w.english}</h2>
            <p className="text-slate-400 font-mono mb-8">{w.ipa}</p>
            <button onClick={(e)=>{e.stopPropagation();playTextToSpeech(w.english)}} className="w-14 h-14 bg-teal-500 text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"><Volume2 size={24}/></button>
            <p className="absolute bottom-8 text-slate-300 text-xs font-bold animate-pulse">TAP TO FLIP</p>
          </div>
          <div className="absolute inset-0 backface-hidden rotate-y-180 bg-teal-600 rounded-[2rem] shadow-xl flex flex-col items-center justify-center p-8 text-white">
            <h2 className="text-3xl font-bold mb-6 text-center">{w.chinese}</h2>
            <div className="bg-white/10 p-5 rounded-2xl w-full text-center backdrop-blur-sm">
                <p className="text-lg italic font-medium mb-2 leading-relaxed">"{w.exampleEn}"</p>
                <p className="text-sm text-teal-100 opacity-80">{w.exampleCn}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-between items-center mt-6 px-4">
        <button disabled={idx===0} onClick={()=>{setFlip(false);setTimeout(()=>setIdx(i=>i-1),150)}} className="p-4 bg-white rounded-full shadow-md text-slate-600 disabled:opacity-30"><ChevronLeft/></button>
        <div className="font-bold text-slate-400 font-mono">{idx+1} / {words.length}</div>
        <button disabled={idx===words.length-1} onClick={()=>{setFlip(false);setTimeout(()=>setIdx(i=>i+1),150)}} className="p-4 bg-white rounded-full shadow-md text-slate-600 disabled:opacity-30"><ChevronRight/></button>
      </div>
    </div>
  )
}

const QuizView = ({words}: {words: any[]}) => {
  const [qIdx, setQIdx] = useState(0); const [score, setScore] = useState(0); const [showRes, setShowRes] = useState(false);
  const w = words[qIdx];
  const options = React.useMemo(() => {
      if(!w) return [];
      return [w.chinese, ...words.filter(x=>x.id!==w.id).sort(()=>0.5-Math.random()).slice(0,3).map(x=>x.chinese)].sort(()=>0.5-Math.random());
  }, [w]);
  
  if(qIdx>=words.length) return <div className="h-full flex flex-col items-center justify-center text-center p-8"><div className="text-6xl mb-4">🏆</div><h2 className="text-3xl font-black mb-2 text-slate-800">Quiz Done!</h2><p className="text-slate-500 mb-8">Score: {score}/{words.length}</p><button onClick={()=>window.location.reload()} className="bg-teal-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:bg-teal-700">Restart</button></div>;
  if(!w) return <div>Loading...</div>;

  return (
    <div className="py-6 h-full flex flex-col max-w-md mx-auto">
      <div className="w-full bg-slate-200 h-1.5 rounded-full mb-8"><div className="bg-teal-500 h-full rounded-full transition-all duration-300" style={{width:`${((qIdx)/words.length)*100}%`}}></div></div>
      <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 text-center mb-8 flex-1 flex flex-col justify-center">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Translate this</span>
        <h2 className="text-3xl font-black text-slate-800 mb-6">{w.english}</h2>
        <button onClick={()=>playTextToSpeech(w.english)} className="mx-auto w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center text-slate-600 hover:bg-slate-100"><Volume2/></button>
      </div>
      <div className="space-y-3">
        {options.map(opt => {
            let style = "bg-white border-2 border-slate-100 text-slate-600";
            if(showRes) { if(opt===w.chinese) style="bg-teal-500 border-teal-500 text-white shadow-md"; else style="opacity-40 border-transparent"; }
            return <button key={opt} disabled={showRes} onClick={()=>{setShowRes(true); if(opt===w.chinese){setScore(s=>s+1);playTextToSpeech("Correct");}else{playTextToSpeech("Incorrect");} setTimeout(()=>{setShowRes(false);setQIdx(i=>i+1)},1200)}} className={`w-full p-4 rounded-xl font-bold text-left transition-all ${style}`}>{opt}</button>
        })}
      </div>
    </div>
  )
}

const MistakeBook = ({onBack}:{onBack:()=>void}) => {
    const [list, setList] = useState<any[]>([]);
    useEffect(() => {
        const ids = JSON.parse(localStorage.getItem('mistakes')||'[]');
        const allWords = COURSE_CONTENT.flatMap(l=>l.words);
        setList(allWords.filter(w=>ids.includes(w.id)));
    },[]);
    const remove = (id: string) => {
        const newIds = list.filter(w=>w.id!==id).map(w=>w.id);
        localStorage.setItem('mistakes',JSON.stringify(newIds));
        setList(prev=>prev.filter(w=>w.id!==id));
    };
    return (
        <div className="min-h-screen bg-slate-50 p-6">
            <div className="flex items-center gap-4 mb-8"><button onClick={onBack} className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm"><ArrowLeft size={20}/></button><h1 className="text-2xl font-black">Mistake Book</h1></div>
            {list.length===0 ? <div className="text-center text-slate-400 mt-20">No mistakes yet!</div> : <div className="space-y-3">{list.map(w=><div key={w.id} className="bg-white p-4 rounded-2xl flex justify-between items-center shadow-sm"><div><h3 className="font-bold">{w.english}</h3><p className="text-sm text-slate-500">{w.chinese}</p></div><div className="flex gap-2"><button onClick={()=>playTextToSpeech(w.english)} className="p-2 bg-slate-50 rounded-full"><Volume2 size={16}/></button><button onClick={()=>remove(w.id)} className="p-2 bg-red-50 text-red-500 rounded-full"><Trash2 size={16}/></button></div></div>)}</div>}
        </div>
    )
}

const LessonDetail: React.FC<{lessonId:string, onBack:()=>void}> = ({lessonId, onBack}) => {
    const level = COURSE_CONTENT.find(l=>l.id===lessonId);
    return (
        <div className="flex-1">
            <div className="space-y-3">
                {level?.words.map((w,i)=><div key={w.id} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 animate-slide-up" style={{animationDelay:`${i*0.05}s`}}><div className="flex justify-between items-start"><div><h3 className="text-xl font-black text-slate-800">{w.english}</h3><span className="text-slate-400 text-sm font-mono">{w.ipa}</span></div><button onClick={()=>playTextToSpeech(w.english)} className="w-10 h-10 bg-slate-50 text-teal-600 rounded-full flex items-center justify-center"><Volume2 size={18}/></button></div><div className="mt-3 pt-3 border-t border-slate-50"><p className="text-teal-700 font-bold mb-1">{w.chinese}</p><p className="text-xs text-slate-400 italic">"{w.exampleEn}"</p></div></div>)}
            </div>
        </div>
    )
}

// --- Main App ---
const App: React.FC = () => {
  const [view, setView] = useState('dash');
  const [lvlId, setLvlId] = useState<string|null>(null);
  const [mode, setMode] = useState('list');
  const [isPro, setPro] = useState(false);

  useEffect(() => { if(localStorage.getItem('english_pro')==='true') setPro(true); }, []);
  const unlock = () => { setPro(true); localStorage.setItem('english_pro','true'); };
  const level = COURSE_CONTENT.find(l=>l.id===lvlId);

  if(view==='dash') return <Dashboard onLevelSelect={(id)=>{setLvlId(id);setView('lvl');}} onMistakeBook={()=>setView('err')} onAiChat={()=>alert("AI Tutor coming soon!")} isPremium={isPro} onUnlock={unlock}/>;
  if(view==='err') return <MistakeBook onBack={()=>setView('dash')}/>;

  return (
    <div className="h-screen flex flex-col bg-slate-50">
      <div className="bg-white p-4 shadow-sm z-10">
        <div className="flex items-center gap-3 mb-4"><button onClick={()=>setView('dash')} className="p-2 bg-slate-50 rounded-full text-slate-600"><ArrowLeft size={20}/></button><div><h1 className="font-bold text-slate-800">{level?.title}</h1><p className="text-xs text-slate-400">{level?.words.length} Words</p></div></div>
        <div className="flex bg-slate-100 p-1 rounded-xl"><button onClick={()=>setMode('list')} className={`flex-1 py-2 rounded-lg text-xs font-bold ${mode==='list'?'bg-white shadow-sm text-teal-600':'text-slate-400'}`}>List</button><button onClick={()=>setMode('flashcard')} className={`flex-1 py-2 rounded-lg text-xs font-bold ${mode==='flashcard'?'bg-white shadow-sm text-teal-600':'text-slate-400'}`}>Cards</button><button onClick={()=>setMode('quiz')} className={`flex-1 py-2 rounded-lg text-xs font-bold ${mode==='quiz'?'bg-white shadow-sm text-teal-600':'text-slate-400'}`}>Quiz</button></div>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        {mode==='list' && level && <LessonDetail lessonId={level.id} onBack={()=>setView('dash')}/>}
        {mode==='flashcard' && <FlashcardView words={level?.words||[]}/>}
        {mode==='quiz' && <QuizView words={level?.words||[]}/>}
      </div>
    </div>
  );
};

export default App;

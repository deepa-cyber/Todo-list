
import React, { useState, useEffect, useCallback } from 'react';
import { 
  CheckCircle, 
  Circle, 
  Calendar as CalendarIcon, 
  BarChart2, 
  List, 
  Plus, 
  Trash2, 
  Flame, 
  Star,
  RefreshCw,
  Info,
  CalendarDays,
  LayoutDashboard
} from 'lucide-react';
import { Task, AppView, MotivationalQuote } from './types';
import { fetchDailyMotivation } from './services/geminiService';
import TaskList from './components/TaskList';
import CalendarView from './components/CalendarView';
import StatsView from './components/StatsView';

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [view, setView] = useState<AppView>('tasks');
  const [quote, setQuote] = useState<MotivationalQuote | null>(null);
  const [isQuoteLoading, setIsQuoteLoading] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [inputDate, setInputDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    const saved = localStorage.getItem('zentask-tasks');
    if (saved) {
      setTasks(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('zentask-tasks', JSON.stringify(tasks));
  }, [tasks]);

  const refreshMotivation = useCallback(async () => {
    setIsQuoteLoading(true);
    const pendingCount = tasks.filter(t => !t.completed).length;
    const newQuote = await fetchDailyMotivation(pendingCount);
    setQuote(newQuote);
    setIsQuoteLoading(false);
  }, [tasks]);

  useEffect(() => {
    refreshMotivation();
  }, []);

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    const newTask: Task = {
      id: crypto.randomUUID(),
      text: inputValue,
      completed: false,
      priority: 'medium',
      createdAt: Date.now(),
      dueDate: inputDate,
    };
    setTasks([newTask, ...tasks]);
    setInputValue('');
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const completedCount = tasks.filter(t => t.completed).length;
  const progress = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  return (
    <div className="min-h-screen bg-transparent flex flex-col md:flex-row backdrop-blur-[2px]">
      {/* Sidebar Navigation - More Vibrant */}
      <nav className="w-full md:w-24 lg:w-64 bg-slate-900 border-r border-slate-800 flex flex-col items-center py-8 px-4 sticky top-0 h-auto md:h-screen z-20 shadow-2xl shadow-indigo-500/10">
        <div className="flex items-center gap-3 mb-12">
          <div className="bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 p-2.5 rounded-2xl text-white shadow-lg shadow-indigo-500/20">
            <CheckCircle size={28} />
          </div>
          <h1 className="hidden lg:block font-serif text-2xl font-bold text-white tracking-tight">ZenTask</h1>
        </div>

        <div className="flex flex-row md:flex-col gap-4 w-full justify-around md:justify-start">
          <NavButton 
            active={view === 'tasks'} 
            onClick={() => setView('tasks')} 
            icon={<List size={22} />} 
            label="My Day" 
            activeColor="from-indigo-600 to-blue-600"
          />
          <NavButton 
            active={view === 'calendar'} 
            onClick={() => setView('calendar')} 
            icon={<CalendarIcon size={22} />} 
            label="Calendar" 
            activeColor="from-purple-600 to-pink-600"
          />
          <NavButton 
            active={view === 'stats'} 
            onClick={() => setView('stats')} 
            icon={<BarChart2 size={22} />} 
            label="Progress" 
            activeColor="from-rose-500 to-orange-500"
          />
        </div>

        <div className="mt-auto hidden lg:block w-full">
          <div className="bg-slate-800/50 p-5 rounded-3xl border border-slate-700/50 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-2 text-orange-400">
              <Flame size={20} fill="currentColor" />
              <span className="font-bold text-white">3 Day Streak</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">Consistency is the bridge between goals and accomplishment.</p>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10 lg:p-14 overflow-y-auto">
        <header className="mb-12">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-8">
            <div className="space-y-2">
              <p className="text-indigo-600 font-bold tracking-widest uppercase text-xs">Today's Journey</p>
              <h2 className="text-5xl font-serif font-bold text-slate-900 leading-tight">Create & Conquer</h2>
              <div className="flex items-center gap-4 text-sm font-medium text-slate-500 pt-2">
                <span className="bg-white/80 backdrop-blur shadow-sm px-4 py-1.5 rounded-full border border-indigo-100 flex items-center gap-2">
                  <CalendarDays size={16} className="text-indigo-500" />
                  {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                </span>
                <span className="flex items-center gap-1.5 bg-amber-50 text-amber-700 px-4 py-1.5 rounded-full border border-amber-100">
                  <Star size={16} fill="currentColor" />
                  {tasks.length - completedCount} Challenges Remaining
                </span>
              </div>
            </div>

            {/* AI Motivation Widget - More Vibrant */}
            <div className="relative group max-w-sm w-full">
              <div className="absolute -inset-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-[2.5rem] blur opacity-25 group-hover:opacity-40 transition duration-1000 animate-pulse"></div>
              <div className="relative bg-white p-6 rounded-[2rem] border border-white shadow-xl flex flex-col gap-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-indigo-500 animate-ping"></div>
                    <span className="text-[10px] uppercase tracking-[0.2em] font-black text-indigo-500">Neural Spark</span>
                  </div>
                  <button 
                    onClick={refreshMotivation}
                    disabled={isQuoteLoading}
                    className="p-1.5 hover:bg-slate-100 rounded-full transition-all text-slate-400 hover:text-indigo-500"
                  >
                    <RefreshCw size={16} className={isQuoteLoading ? 'animate-spin' : ''} />
                  </button>
                </div>
                {isQuoteLoading ? (
                  <div className="animate-pulse space-y-3">
                    <div className="h-4 bg-slate-100 rounded-full w-full"></div>
                    <div className="h-4 bg-slate-100 rounded-full w-2/3"></div>
                  </div>
                ) : (
                  <>
                    <p className="text-slate-800 font-bold text-lg leading-snug">"{quote?.quote}"</p>
                    <p className="text-xs font-medium text-slate-400 text-right italic">— {quote?.author}</p>
                  </>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic View Rendering */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8 space-y-8">
            {view === 'tasks' && (
              <div className="space-y-8">
                <form onSubmit={addTask} className="bg-white/80 backdrop-blur-md p-6 rounded-[2.5rem] border border-indigo-50 shadow-2xl shadow-indigo-500/5 space-y-5">
                  <div className="relative">
                    <input 
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder="What's your next victory?"
                      className="w-full bg-slate-50 border-none rounded-2xl py-5 pl-14 pr-6 text-slate-800 shadow-inner focus:ring-4 focus:ring-indigo-500/10 transition-all placeholder:text-slate-300 text-xl font-medium"
                    />
                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-indigo-400">
                      <Plus size={28} strokeWidth={3} />
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    <div className="flex-1 w-full relative group">
                      <div className="absolute left-5 top-1/2 -translate-y-1/2 text-indigo-500 pointer-events-none transition-colors">
                        <CalendarDays size={20} />
                      </div>
                      <input 
                        type="date"
                        value={inputDate}
                        onChange={(e) => setInputDate(e.target.value)}
                        className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-14 pr-6 text-slate-700 font-bold text-sm focus:ring-4 focus:ring-indigo-500/10 appearance-none shadow-inner"
                      />
                    </div>
                    <button 
                      type="submit"
                      className="w-full sm:w-auto bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-sm hover:from-indigo-700 hover:to-purple-700 transition-all shadow-xl shadow-indigo-500/30 transform hover:-translate-y-1 active:translate-y-0"
                    >
                      Manifest Task
                    </button>
                  </div>
                </form>

                <div className="bg-white/90 backdrop-blur-sm rounded-[3rem] border border-slate-100 shadow-xl overflow-hidden min-h-[500px]">
                  <TaskList 
                    tasks={tasks} 
                    onToggle={toggleTask} 
                    onDelete={deleteTask} 
                  />
                </div>
              </div>
            )}

            {view === 'calendar' && <CalendarView />}
            {view === 'stats' && <StatsView tasks={tasks} />}
          </div>

          {/* Progress Widget - Colorful Gradient Progress */}
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full -mr-16 -mt-16 opacity-50"></div>
              <h3 className="font-black text-slate-800 mb-8 flex items-center gap-3 tracking-tight text-xl">
                <div className="p-2 bg-indigo-100 rounded-xl text-indigo-600">
                  <LayoutDashboard size={20} />
                </div>
                Your Momentum
              </h3>
              
              <div className="relative flex items-center justify-center mb-8">
                <svg className="w-40 h-40 transform -rotate-90">
                  <circle
                    cx="80"
                    cy="80"
                    r="72"
                    stroke="currentColor"
                    strokeWidth="12"
                    fill="transparent"
                    className="text-slate-50"
                  />
                  <circle
                    cx="80"
                    cy="80"
                    r="72"
                    stroke="url(#gradient)"
                    strokeWidth="12"
                    fill="transparent"
                    strokeDasharray={452}
                    strokeDashoffset={452 - (452 * progress) / 100}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out"
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#6366f1" />
                      <stop offset="50%" stopColor="#a855f7" />
                      <stop offset="100%" stopColor="#ec4899" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute text-center flex flex-col items-center">
                  <span className="text-4xl font-black text-slate-900 leading-none">{progress}%</span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Flow State</span>
                </div>
              </div>

              <div className="space-y-5">
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Completed</p>
                    <p className="text-2xl font-black text-slate-900">{completedCount}<span className="text-slate-300 text-lg font-medium mx-1">/</span>{tasks.length}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Efficiency</p>
                    <p className="text-xl font-bold text-indigo-500">High</p>
                  </div>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden shadow-inner">
                  <div 
                    className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 h-full transition-all duration-1000 rounded-full" 
                    style={{ width: `${progress}%` }} 
                  />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-800 p-8 rounded-[2.5rem] shadow-2xl text-white overflow-hidden relative group">
              <div className="absolute -right-12 -bottom-12 opacity-10 group-hover:scale-125 transition-transform duration-700">
                <CheckCircle size={220} />
              </div>
              <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>
              
              <h3 className="font-bold mb-5 flex items-center gap-3 text-lg relative z-10">
                <div className="bg-white/10 backdrop-blur-md p-2 rounded-xl">
                  <Info size={20} className="text-indigo-300" />
                </div>
                The Zen Protocol
              </h3>
              <p className="text-indigo-100/90 text-sm leading-relaxed font-medium relative z-10">
                A colorful workspace isn't just aesthetic—it's neuro-stimulating. High contrast and vibrant tones keep the brain alert and creative.
              </p>
              <div className="mt-6 relative z-10">
                <div className="h-1 w-12 bg-indigo-400/50 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

interface NavButtonProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  activeColor: string;
}

const NavButton: React.FC<NavButtonProps> = ({ active, onClick, icon, label, activeColor }) => (
  <button 
    onClick={onClick}
    className={`flex items-center gap-4 p-4 rounded-2xl transition-all w-full group relative ${
      active 
        ? `bg-gradient-to-r ${activeColor} text-white shadow-xl shadow-indigo-500/20` 
        : 'text-slate-500 hover:bg-slate-800 hover:text-white'
    }`}
  >
    <div className={`transition-transform duration-300 ${active ? 'scale-110' : 'group-hover:scale-110'}`}>
      {icon}
    </div>
    <span className="hidden lg:block font-bold text-sm tracking-wide">{label}</span>
    {active && (
      <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-white rounded-full hidden lg:block"></div>
    )}
  </button>
);

export default App;

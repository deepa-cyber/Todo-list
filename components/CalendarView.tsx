
import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, ExternalLink, Settings, Info, ListTodo } from 'lucide-react';
import { Task } from '../types';

const CalendarView: React.FC = () => {
  const [calendarUrl, setCalendarUrl] = useState<string>('');
  const [isSettingUrl, setIsSettingUrl] = useState(false);
  const [localTasks, setLocalTasks] = useState<Task[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('zentask-tasks');
    if (saved) {
      setLocalTasks(JSON.parse(saved));
    }
  }, []);

  const defaultEmbed = "https://calendar.google.com/calendar/embed?src=en.usa%23holiday%40group.v.calendar.google.com&ctz=America%2FLos_Angeles";

  const today = new Date().toISOString().split('T')[0];
  const upcomingTasks = localTasks
    .filter(t => !t.completed && t.dueDate >= today)
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
    .slice(0, 5);

  return (
    <div className="space-y-8 h-full">
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8 h-[750px]">
        {/* Agenda Sidebar - More Colorful */}
        <div className="xl:col-span-1 bg-slate-900 rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden text-white relative border border-slate-800">
          <div className="p-6 border-b border-white/5 bg-white/5 flex items-center gap-3">
            <div className="p-2 bg-indigo-500 rounded-xl">
              <ListTodo size={20} className="text-white" />
            </div>
            <h3 className="font-black tracking-tight text-lg">Your Agenda</h3>
          </div>
          <div className="flex-1 overflow-y-auto p-6 space-y-5 custom-scrollbar">
            {upcomingTasks.length > 0 ? (
              upcomingTasks.map((task, idx) => {
                const accentColors = ['bg-indigo-500', 'bg-purple-500', 'bg-pink-500', 'bg-rose-500', 'bg-orange-500'];
                const accent = accentColors[idx % accentColors.length];
                return (
                  <div key={task.id} className="relative pl-6 group">
                    <div className={`absolute left-0 top-0 w-1.5 h-full rounded-full ${accent} opacity-40 group-hover:opacity-100 transition-opacity`}></div>
                    <p className="text-sm font-bold text-white mb-1 group-hover:text-indigo-300 transition-colors leading-snug">{task.text}</p>
                    <div className="flex items-center gap-2">
                      <p className={`text-[10px] font-black uppercase tracking-widest ${accent.replace('bg-', 'text-')}`}>
                        {task.dueDate === today ? "Present Moment" : new Date(task.dueDate + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </p>
                    </div>
                  </div>
                )
              })
            ) : (
              <div className="flex flex-col items-center justify-center h-full opacity-20 py-20">
                <div className="p-5 border-2 border-dashed border-white rounded-full mb-4">
                  <CalendarIcon size={32} />
                </div>
                <p className="text-xs font-bold uppercase tracking-widest">Horizon Clear</p>
              </div>
            )}
          </div>
          <div className="p-6 bg-white/5 border-t border-white/5">
            <div className="flex items-center gap-2 text-indigo-400 mb-2">
              <Info size={14} />
              <span className="text-[10px] font-black uppercase tracking-widest">Protocol</span>
            </div>
            <p className="text-[10px] text-slate-400 leading-relaxed font-medium">
              Synchronize your local intent with global commitments. Push tasks to G-Cal using the manifest icon.
            </p>
          </div>
        </div>

        {/* Calendar Frame */}
        <div className="xl:col-span-3 bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl overflow-hidden flex flex-col">
          <div className="p-5 border-b border-slate-50 flex items-center justify-between bg-white">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                <CalendarIcon size={20} />
              </div>
              <h3 className="text-slate-900 font-black tracking-tight text-xl">Chronos View</h3>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => setIsSettingUrl(!isSettingUrl)}
                className="p-2.5 hover:bg-slate-50 rounded-2xl transition-all text-slate-400 hover:text-indigo-600 border border-transparent hover:border-slate-100"
                title="Configuration"
              >
                <Settings size={20} />
              </button>
              <a 
                href="https://calendar.google.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2.5 hover:bg-slate-50 rounded-2xl transition-all text-slate-400 hover:text-indigo-600 border border-transparent hover:border-slate-100"
              >
                <ExternalLink size={20} />
              </a>
            </div>
          </div>

          {isSettingUrl && (
            <div className="p-6 bg-indigo-50/50 border-b border-indigo-100 animate-in slide-in-from-top duration-300">
              <label className="block text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-3">Manifest URL Configuration</label>
              <div className="flex gap-3">
                <input 
                  type="text" 
                  placeholder="Paste G-Cal Embed SRC..."
                  className="flex-1 bg-white border-none rounded-2xl px-6 py-3 text-sm focus:ring-4 focus:ring-indigo-500/10 shadow-sm"
                  value={calendarUrl}
                  onChange={(e) => setCalendarUrl(e.target.value)}
                />
                <button 
                  onClick={() => setIsSettingUrl(false)}
                  className="bg-indigo-600 text-white px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-indigo-500/20"
                >
                  Anchor
                </button>
              </div>
            </div>
          )}

          <div className="flex-1 bg-slate-50 relative p-4">
             <div className="absolute inset-0 bg-white/20 backdrop-blur-3xl z-0 pointer-events-none"></div>
             <div className="relative z-10 w-full h-full rounded-2xl overflow-hidden border border-slate-100 shadow-inner">
                <iframe 
                  src={calendarUrl || defaultEmbed}
                  style={{ border: 0 }} 
                  width="100%" 
                  height="100%" 
                  frameBorder="0" 
                  scrolling="no"
                  className="bg-white"
                ></iframe>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarView;


import React, { useMemo } from 'react';
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import { Task } from '../types';
import { TrendingUp, Award, Zap, Target, Star, Rocket } from 'lucide-react';

interface StatsViewProps {
  tasks: Task[];
}

const StatsView: React.FC<StatsViewProps> = ({ tasks }) => {
  const completedTasks = tasks.filter(t => t.completed);
  
  const data = useMemo(() => [
    { name: 'Mon', tasks: Math.floor(Math.random() * 5) + 2 },
    { name: 'Tue', tasks: Math.floor(Math.random() * 5) + 3 },
    { name: 'Wed', tasks: Math.floor(Math.random() * 5) + 1 },
    { name: 'Thu', tasks: Math.floor(Math.random() * 5) + 4 },
    { name: 'Fri', tasks: Math.floor(Math.random() * 5) + 2 },
    { name: 'Sat', tasks: Math.floor(Math.random() * 5) + 0 },
    { name: 'Sun', tasks: completedTasks.length },
  ], [completedTasks.length]);

  return (
    <div className="space-y-10 pb-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <StatCard 
          icon={<Star size={24} className="text-amber-500" fill="currentColor" />}
          label="Peak Victories"
          value={completedTasks.length}
          sub="Total Completed"
          color="from-amber-50 to-orange-50"
          border="border-amber-100"
          accent="bg-amber-100"
        />
        <StatCard 
          icon={<Zap size={24} className="text-indigo-500" fill="currentColor" />}
          label="Power Flow"
          value="8.4"
          sub="Zen Index"
          color="from-indigo-50 to-blue-50"
          border="border-indigo-100"
          accent="bg-indigo-100"
        />
        <StatCard 
          icon={<Rocket size={24} className="text-emerald-500" fill="currentColor" />}
          label="Manifestation"
          value={`${tasks.length > 0 ? Math.round((completedTasks.length / tasks.length) * 100) : 0}%`}
          sub="Success Ratio"
          color="from-emerald-50 to-teal-50"
          border="border-emerald-100"
          accent="bg-emerald-100"
        />
      </div>

      <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-2xl shadow-indigo-500/5">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h3 className="font-black text-slate-800 flex items-center gap-3 text-2xl tracking-tight">
              <div className="bg-rose-100 p-2.5 rounded-2xl text-rose-500">
                <Target size={24} />
              </div>
              Velocity Tracker
            </h3>
            <p className="text-slate-400 font-medium text-sm mt-1">Your productivity spectrum over the last week</p>
          </div>
          <div className="hidden sm:flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-slate-200"></div>
              <span className="text-xs font-bold text-slate-400 uppercase">Average</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-indigo-500"></div>
              <span className="text-xs font-bold text-slate-400 uppercase">Your Peak</span>
            </div>
          </div>
        </div>
        
        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f8fafc" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 700 }}
                dy={15}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 700 }}
              />
              <Tooltip 
                cursor={{ fill: '#f8fafc', radius: 12 }}
                contentStyle={{ 
                  borderRadius: '24px', 
                  border: 'none', 
                  boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                  padding: '20px',
                  fontWeight: 'bold'
                }}
              />
              <Bar 
                dataKey="tasks" 
                radius={[12, 12, 0, 0]}
                barSize={50}
              >
                {data.map((entry, index) => {
                  const colors = ['#6366f1', '#8b5cf6', '#d946ef', '#ec4899', '#f43f5e', '#f97316', '#eab308'];
                  return (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={colors[index % colors.length]} 
                      fillOpacity={index === data.length - 1 ? 1 : 0.2}
                    />
                  );
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-[3rem] p-10 text-white relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 rounded-full blur-3xl -mr-40 -mt-40"></div>
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <h3 className="text-4xl font-serif font-bold mb-6 text-white leading-tight">Mastery Through <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-pink-400">Consistency</span></h3>
            <p className="text-slate-400 text-lg leading-relaxed max-w-md">
              Every completed task is a neural pathway strengthened. You aren't just checking boxes—you're re-wiring your future.
            </p>
          </div>
          <div className="flex justify-end gap-4">
             <div className="bg-white/5 backdrop-blur-xl p-6 rounded-3xl border border-white/10 flex flex-col items-center">
                <span className="text-4xl font-black text-indigo-400">{completedTasks.length}</span>
                <span className="text-[10px] uppercase font-bold text-slate-500 tracking-widest mt-2 text-center">Wins this <br/> Week</span>
             </div>
             <div className="bg-indigo-500 p-6 rounded-3xl shadow-xl shadow-indigo-500/20 flex flex-col items-center">
                <span className="text-4xl font-black text-white">Top</span>
                <span className="text-[10px] uppercase font-bold text-indigo-100 tracking-widest mt-2 text-center">1% Performer</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  sub: string;
  color: string;
  border: string;
  accent: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, label, value, sub, color, border, accent }) => (
  <div className={`bg-gradient-to-br ${color} p-8 rounded-[2.5rem] border ${border} shadow-sm transition-all hover:scale-105 duration-300 group`}>
    <div className={`${accent} p-4 rounded-2xl w-fit mb-6 transition-transform group-hover:rotate-12`}>
      {icon}
    </div>
    <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-1">{label}</p>
    <div className="flex items-baseline gap-2">
      <span className="text-4xl font-black text-slate-900 tracking-tight">{value}</span>
      <span className="text-xs font-bold text-slate-400">{sub}</span>
    </div>
  </div>
);

export default StatsView;

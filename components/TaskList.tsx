
import React from 'react';
import { Circle, CheckCircle2, Trash2, GripVertical, CalendarDays, CalendarPlus } from 'lucide-react';
import { Task } from '../types';

interface TaskListProps {
  tasks: Task[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onToggle, onDelete }) => {
  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-20 text-slate-400 px-6 text-center">
        <div className="bg-gradient-to-tr from-slate-50 to-indigo-50 p-8 rounded-full mb-6">
          <Circle size={56} className="text-slate-200" />
        </div>
        <h3 className="text-2xl font-serif font-bold text-slate-800 mb-2">Tabula Rasa</h3>
        <p className="max-w-xs text-slate-400 font-medium">Your canvas is clear. What magnificent achievement will you record first?</p>
      </div>
    );
  }

  const groupedTasks = tasks.reduce((groups, task) => {
    const date = task.dueDate;
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(task);
    return groups;
  }, {} as Record<string, Task[]>);

  const sortedDates = Object.keys(groupedTasks).sort();

  const getHeaderStyle = (dateStr: string) => {
    const today = new Date().toISOString().split('T')[0];
    if (dateStr === today) return "bg-indigo-600 text-white shadow-lg shadow-indigo-200";
    if (dateStr < today) return "bg-rose-50 text-rose-600 border-rose-100";
    return "bg-slate-900 text-white";
  };

  const formatDateLabel = (dateStr: string) => {
    const today = new Date().toISOString().split('T')[0];
    if (dateStr === today) return "Today's Battlefield";
    
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
  };

  const getGoogleCalendarUrl = (task: Task) => {
    const date = task.dueDate.replace(/-/g, '');
    const title = encodeURIComponent(task.text);
    const endDate = new Date(task.dueDate + 'T00:00:00');
    endDate.setDate(endDate.getDate() + 1);
    const endDateStr = endDate.toISOString().split('T')[0].replace(/-/g, '');
    return `https://www.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${date}/${endDateStr}&details=Task+managed+by+ZenTask+AI&sf=true&output=xml`;
  };

  return (
    <div className="space-y-0">
      {sortedDates.map(date => (
        <div key={date} className="group/date">
          <div className={`px-8 py-4 flex items-center justify-between transition-all ${getHeaderStyle(date)}`}>
            <div className="flex items-center gap-3">
              <CalendarDays size={18} />
              <h4 className="text-sm uppercase tracking-[0.2em] font-black">
                {formatDateLabel(date)}
              </h4>
            </div>
            <span className="text-xs font-bold opacity-60">
              {groupedTasks[date].length} {groupedTasks[date].length === 1 ? 'Task' : 'Tasks'}
            </span>
          </div>
          <ul className="divide-y divide-slate-100 bg-white">
            {groupedTasks[date].sort((a, b) => b.createdAt - a.createdAt).map((task) => (
              <li 
                key={task.id} 
                className={`group flex items-center gap-5 p-6 hover:bg-slate-50/80 transition-all border-l-4 border-transparent hover:border-indigo-500 ${task.completed ? 'opacity-40' : ''}`}
              >
                <div className="text-slate-200 opacity-0 group-hover:opacity-100 transition-opacity">
                  <GripVertical size={20} />
                </div>
                
                <button 
                  onClick={() => onToggle(task.id)}
                  className={`flex-shrink-0 transition-all duration-500 transform hover:scale-125 ${task.completed ? 'text-emerald-500' : 'text-slate-300 hover:text-indigo-500'}`}
                >
                  {task.completed ? <CheckCircle2 size={28} strokeWidth={2.5} /> : <Circle size={28} strokeWidth={2} />}
                </button>

                <div className="flex-1 min-w-0">
                  <p className={`text-xl font-medium transition-all ${task.completed ? 'line-through text-slate-400 italic' : 'text-slate-800'}`}>
                    {task.text}
                  </p>
                </div>

                <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                  {!task.completed && (
                    <a 
                      href={getGoogleCalendarUrl(task)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-400 hover:text-white p-2.5 hover:bg-indigo-500 rounded-2xl transition-all shadow-sm"
                      title="Sync to Calendar"
                    >
                      <CalendarPlus size={20} />
                    </a>
                  )}
                  <button 
                    onClick={() => onDelete(task.id)}
                    className="text-slate-300 hover:text-white p-2.5 hover:bg-rose-500 rounded-2xl transition-all"
                    title="Banish Task"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default TaskList;

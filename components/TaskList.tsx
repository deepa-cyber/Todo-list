
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
        <div className="bg-slate-50 p-6 rounded-full mb-4">
          <Circle size={48} className="opacity-20" />
        </div>
        <h3 className="text-lg font-medium text-slate-600 mb-1">Clear Mind</h3>
        <p className="max-w-xs">No tasks scheduled. Why not add something for a specific date?</p>
      </div>
    );
  }

  // Group tasks by date
  const groupedTasks = tasks.reduce((groups, task) => {
    const date = task.dueDate;
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(task);
    return groups;
  }, {} as Record<string, Task[]>);

  // Sort dates
  const sortedDates = Object.keys(groupedTasks).sort();

  const formatDateLabel = (dateStr: string) => {
    const today = new Date().toISOString().split('T')[0];
    if (dateStr === today) return "Today";
    
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
  };

  const getGoogleCalendarUrl = (task: Task) => {
    const date = task.dueDate.replace(/-/g, '');
    const title = encodeURIComponent(task.text);
    // Google Calendar all-day event end date is exclusive, so we add 1 day
    const endDate = new Date(task.dueDate + 'T00:00:00');
    endDate.setDate(endDate.getDate() + 1);
    const endDateStr = endDate.toISOString().split('T')[0].replace(/-/g, '');
    return `https://www.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${date}/${endDateStr}&details=Task+managed+by+ZenTask+AI&sf=true&output=xml`;
  };

  return (
    <div className="divide-y divide-slate-100">
      {sortedDates.map(date => (
        <div key={date} className="pb-4">
          <div className="bg-slate-50/50 px-6 py-3 border-y border-slate-100 flex items-center gap-2">
            <CalendarDays size={14} className="text-indigo-400" />
            <h4 className="text-[11px] uppercase tracking-wider font-bold text-slate-400">
              {formatDateLabel(date)}
            </h4>
          </div>
          <ul className="divide-y divide-slate-50">
            {groupedTasks[date].sort((a, b) => b.createdAt - a.createdAt).map((task) => (
              <li 
                key={task.id} 
                className={`group flex items-center gap-4 p-5 hover:bg-indigo-50/30 transition-colors ${task.completed ? 'opacity-60' : ''}`}
              >
                <div className="text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity">
                  <GripVertical size={18} />
                </div>
                
                <button 
                  onClick={() => onToggle(task.id)}
                  className={`flex-shrink-0 transition-all duration-300 ${task.completed ? 'text-indigo-500 scale-110' : 'text-slate-300 hover:text-indigo-400'}`}
                >
                  {task.completed ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                </button>

                <div className="flex-1 min-w-0">
                  <p className={`text-lg transition-all truncate ${task.completed ? 'line-through text-slate-400' : 'text-slate-700'}`}>
                    {task.text}
                  </p>
                </div>

                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                  {!task.completed && (
                    <a 
                      href={getGoogleCalendarUrl(task)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-400 hover:text-indigo-600 p-2 hover:bg-indigo-100 rounded-xl transition-colors"
                      title="Sync to Google Calendar"
                    >
                      <CalendarPlus size={18} />
                    </a>
                  )}
                  <button 
                    onClick={() => onDelete(task.id)}
                    className="text-slate-300 hover:text-red-500 p-2 hover:bg-red-50 rounded-xl transition-colors"
                    title="Delete Task"
                  >
                    <Trash2 size={18} />
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

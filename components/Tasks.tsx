import React from 'react';
import { Task } from '../types';
import { CheckCircle2, Circle, AlertCircle, Calendar as CalendarIcon } from 'lucide-react';
import { format, parseISO } from 'date-fns';

interface TasksProps {
  tasks: Task[];
  onToggleTask: (taskId: string) => void;
}

export const Tasks: React.FC<TasksProps> = ({ tasks, onToggleTask }) => {
  const priorityColors = {
    high: 'bg-red-100 text-red-700 border-red-200',
    medium: 'bg-orange-100 text-orange-700 border-orange-200',
    low: 'bg-green-100 text-green-700 border-green-200',
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 h-full flex flex-col">
      <div className="p-6 border-b border-slate-100 flex justify-between items-center">
        <h2 className="text-xl font-bold text-slate-800">Action Items</h2>
        <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-semibold">
            {tasks.filter(t => t.status === 'pending').length} Pending
        </span>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {tasks.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400">
                <CheckCircle2 className="w-16 h-16 mb-4 opacity-20" />
                <p>No tasks yet. Snap extracted items will appear here.</p>
            </div>
        ) : (
            tasks.map(task => (
            <div 
                key={task.id}
                className={`group flex items-start p-4 rounded-xl border transition-all duration-200 ${
                    task.status === 'completed' 
                        ? 'bg-slate-50 border-slate-100 opacity-60' 
                        : 'bg-white border-slate-200 hover:border-indigo-300 hover:shadow-md'
                }`}
            >
                <button 
                    onClick={() => onToggleTask(task.id)}
                    className={`mt-1 flex-shrink-0 transition-colors ${
                        task.status === 'completed' ? 'text-green-500' : 'text-slate-300 hover:text-indigo-500'
                    }`}
                >
                    {task.status === 'completed' ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                </button>
                
                <div className="ml-4 flex-1">
                    <div className="flex items-start justify-between">
                        <h3 className={`font-medium text-lg leading-tight ${
                            task.status === 'completed' ? 'text-slate-500 line-through' : 'text-slate-800'
                        }`}>
                            {task.title}
                        </h3>
                        <span className={`ml-2 px-2 py-0.5 text-xs font-bold uppercase tracking-wide rounded border ${priorityColors[task.priority]}`}>
                            {task.priority}
                        </span>
                    </div>
                    
                    {task.dueDate && (
                        <div className="flex items-center mt-2 text-sm text-slate-500">
                            <CalendarIcon size={14} className="mr-1.5" />
                            <span>Due {format(parseISO(task.dueDate), 'MMM d, yyyy')}</span>
                            {new Date(task.dueDate) < new Date() && task.status === 'pending' && (
                                <span className="ml-2 flex items-center text-red-500 text-xs font-bold">
                                    <AlertCircle size={12} className="mr-1" /> Overdue
                                </span>
                            )}
                        </div>
                    )}
                </div>
            </div>
            ))
        )}
      </div>
    </div>
  );
};
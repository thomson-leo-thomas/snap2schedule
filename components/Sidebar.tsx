import React from 'react';
import { 
  LayoutDashboard, 
  Calendar as CalendarIcon, 
  CheckSquare, 
  PlusCircle,
  Clock
} from 'lucide-react';
import { ViewState } from '../types';

interface SidebarProps {
  currentView: ViewState;
  onChangeView: (view: ViewState) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onChangeView }) => {
  const navItems: { id: ViewState; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { id: 'extractor', label: 'Add Event/Task', icon: <PlusCircle size={20} /> },
    { id: 'calendar', label: 'Calendar', icon: <CalendarIcon size={20} /> },
    { id: 'tasks', label: 'Tasks', icon: <CheckSquare size={20} /> },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex-shrink-0 flex flex-col h-full border-r border-slate-800">
      <div className="p-6 border-b border-slate-800 flex items-center space-x-3">
        <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center">
          <Clock className="text-white w-5 h-5" />
        </div>
        <h1 className="text-xl font-bold text-white tracking-tight">Snap2Schedule</h1>
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onChangeView(item.id)}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
              currentView === item.id 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/50' 
                : 'hover:bg-slate-800 hover:text-white'
            }`}
          >
            {item.icon}
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className="bg-slate-800/50 rounded-xl p-4">
          <p className="text-xs text-slate-400 mb-2 font-medium uppercase tracking-wider">Storage Used</p>
          <div className="w-full bg-slate-700 rounded-full h-2 mb-2">
            <div className="bg-indigo-500 h-2 rounded-full w-3/4"></div>
          </div>
          <p className="text-xs text-slate-500">75% of Local Quota</p>
        </div>
      </div>
    </aside>
  );
};
import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Extractor } from './components/Extractor';
import { Calendar } from './components/Calendar';
import { Tasks } from './components/Tasks';
import { CalendarEvent, Task, ViewState } from './types';
import { addDays, addHours, setHours, setMinutes } from 'date-fns';
import { Search, Bell, User } from 'lucide-react';

// Mock Initial Data
const initialEvents: CalendarEvent[] = [
  {
    id: '1',
    title: 'Project Kickoff',
    start: addHours(setMinutes(setHours(new Date(), 10), 0), 24).toISOString(), // Tomorrow 10 AM
    end: addHours(setMinutes(setHours(new Date(), 11), 30), 24).toISOString(),
    location: 'Conference Room A',
    description: 'Initial planning for Q4 roadmap.',
    allDay: false,
    type: 'meeting'
  }
];

const initialTasks: Task[] = [
  {
    id: '1',
    title: 'Review design mockups',
    status: 'pending',
    priority: 'high',
    dueDate: addDays(new Date(), 2).toISOString()
  }
];

export default function App() {
  const [currentView, setCurrentView] = useState<ViewState>('dashboard');
  const [events, setEvents] = useState<CalendarEvent[]>(initialEvents);
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [calendarViewDate, setCalendarViewDate] = useState(new Date());

  const handleEventsFound = (newEvents: CalendarEvent[]) => {
    setEvents(prev => [...prev, ...newEvents]);
  };

  const handleTasksFound = (newTasks: Task[]) => {
    setTasks(prev => [...prev, ...newTasks]);
  };

  const toggleTask = (taskId: string) => {
    setTasks(prev => prev.map(t => 
        t.id === taskId ? { ...t, status: t.status === 'completed' ? 'pending' : 'completed' } : t
    ));
  };

  const handleExtractionSuccess = (view: ViewState, date?: Date) => {
    setCurrentView(view);
    if (date) {
        setCalendarViewDate(date);
    }
  };

  const renderContent = () => {
    switch (currentView) {
      case 'extractor':
        return <Extractor 
                  onEventsFound={handleEventsFound} 
                  onTasksFound={handleTasksFound} 
                  onSuccess={handleExtractionSuccess} 
                />;
      case 'calendar':
        return (
            <div className="h-full p-6">
                <Calendar 
                    events={events} 
                    viewDate={calendarViewDate} 
                    onDateChange={setCalendarViewDate} 
                />
            </div>
        );
      case 'tasks':
        return <div className="h-full p-6"><Tasks tasks={tasks} onToggleTask={toggleTask} /></div>;
      case 'dashboard':
      default:
        return (
          <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6 h-full overflow-y-auto">
            <div className="lg:col-span-2 space-y-6">
                <div className="bg-indigo-600 rounded-2xl p-8 text-white shadow-lg shadow-indigo-200">
                    <h1 className="text-3xl font-bold mb-2">Welcome back!</h1>
                    <p className="text-indigo-100 text-lg mb-6">You have {events.length} upcoming events and {tasks.filter(t => t.status === 'pending').length} pending tasks.</p>
                    <button 
                        onClick={() => setCurrentView('extractor')}
                        className="bg-white text-indigo-600 px-6 py-3 rounded-xl font-bold hover:bg-indigo-50 transition-colors shadow-sm"
                    >
                        Add New Schedule
                    </button>
                </div>
                <div className="h-[500px]">
                    <Calendar 
                        events={events} 
                        viewDate={calendarViewDate} 
                        onDateChange={setCalendarViewDate} 
                    />
                </div>
            </div>
            <div className="h-full min-h-[400px]">
                <Tasks tasks={tasks} onToggleTask={toggleTask} />
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar currentView={currentView} onChangeView={setCurrentView} />
      
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 flex-shrink-0">
          <div className="flex items-center bg-slate-100 rounded-lg px-3 py-2 w-96">
            <Search className="text-slate-400 w-5 h-5 mr-2" />
            <input 
                type="text" 
                placeholder="Search events, tasks..." 
                className="bg-transparent border-none focus:outline-none text-sm w-full text-slate-700 placeholder-slate-400" 
            />
          </div>
          
          <div className="flex items-center space-x-4">
            <button className="relative p-2 text-slate-400 hover:text-indigo-600 transition-colors">
                <Bell className="w-6 h-6" />
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm shadow-md">
                <User size={16} />
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden relative">
            {renderContent()}
        </div>
      </main>
    </div>
  );
}
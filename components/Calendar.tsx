import React from 'react';
import { CalendarEvent } from '../types';
import { format, startOfWeek, addDays, isSameDay, parseISO, getHours, addWeeks, subWeeks } from 'date-fns';
import { MapPin, Download, ChevronLeft, ChevronRight } from 'lucide-react';

interface CalendarProps {
  events: CalendarEvent[];
  viewDate: Date;
  onDateChange: (date: Date) => void;
}

export const Calendar: React.FC<CalendarProps> = ({ events, viewDate, onDateChange }) => {
  const startDate = startOfWeek(viewDate);
  const weekDays = [...Array(7)].map((_, i) => addDays(startDate, i));
  const today = new Date();

  const hours = [...Array(13)].map((_, i) => i + 7); // 7 AM to 7 PM

  const getEventsForDay = (date: Date) => {
    return events.filter(event => isSameDay(parseISO(event.start), date));
  };

  const handlePrevWeek = () => onDateChange(subWeeks(viewDate, 1));
  const handleNextWeek = () => onDateChange(addWeeks(viewDate, 1));

  const downloadIcs = (event: CalendarEvent) => {
    const formatDate = (dateStr: string) => dateStr.replace(/[-:]/g, '').split('.')[0] + 'Z';
    
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
SUMMARY:${event.title}
DTSTART:${formatDate(event.start)}
DTEND:${formatDate(event.end)}
DESCRIPTION:${event.description || ''}
LOCATION:${event.location || ''}
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${event.title.replace(/\s+/g, '_')}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="h-full flex flex-col bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
        <div className="flex items-center space-x-4">
            <h2 className="text-lg font-bold text-slate-800 w-48">
                {format(viewDate, 'MMMM yyyy')}
            </h2>
            <div className="flex items-center bg-white rounded-lg border border-slate-200 shadow-sm">
                <button onClick={handlePrevWeek} className="p-1.5 hover:bg-slate-50 text-slate-600 rounded-l-lg border-r border-slate-100">
                    <ChevronLeft size={16} />
                </button>
                <button onClick={handleNextWeek} className="p-1.5 hover:bg-slate-50 text-slate-600 rounded-r-lg">
                    <ChevronRight size={16} />
                </button>
            </div>
        </div>
        <div className="text-sm text-slate-500 font-medium">
            Week of {format(startDate, 'MMM d')}
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <div className="min-w-[800px]">
          {/* Header Days */}
          <div className="grid grid-cols-8 border-b border-slate-200 sticky top-0 bg-white z-20">
            <div className="p-4 border-r border-slate-100 text-xs font-semibold text-slate-400 uppercase tracking-wider text-center pt-6">Time</div>
            {weekDays.map((day, i) => (
              <div key={i} className={`p-4 border-r border-slate-100 text-center ${isSameDay(day, today) ? 'bg-indigo-50/50' : ''}`}>
                <div className={`text-xs font-semibold uppercase tracking-wider mb-1 ${isSameDay(day, today) ? 'text-indigo-600' : 'text-slate-400'}`}>
                  {format(day, 'EEE')}
                </div>
                <div className={`text-lg font-bold ${isSameDay(day, today) ? 'text-indigo-700' : 'text-slate-700'}`}>
                  {format(day, 'd')}
                </div>
              </div>
            ))}
          </div>

          {/* Time Grid */}
          <div className="relative">
             {hours.map((hour) => (
                 <div key={hour} className="grid grid-cols-8 h-24 border-b border-slate-100">
                    <div className="border-r border-slate-100 p-2 text-xs text-slate-400 text-right sticky left-0 bg-white/95 backdrop-blur z-10">
                        {hour === 12 ? '12 PM' : hour > 12 ? `${hour - 12} PM` : `${hour} AM`}
                    </div>
                    {weekDays.map((day, i) => {
                        const dayEvents = getEventsForDay(day).filter(e => {
                            const eventHour = getHours(parseISO(e.start));
                            return eventHour === hour;
                        });

                        return (
                            <div key={i} className={`border-r border-slate-100 relative group p-1 ${isSameDay(day, today) ? 'bg-indigo-50/10' : ''}`}>
                                {dayEvents.map(event => (
                                    <div 
                                        key={event.id}
                                        className="absolute inset-x-1 top-1 bottom-1 bg-indigo-100 border border-indigo-200 rounded-md p-2 text-xs hover:z-20 hover:shadow-lg transition-all cursor-pointer overflow-hidden group/event flex flex-col"
                                    >
                                        <div className="font-semibold text-indigo-800 truncate">{event.title}</div>
                                        <div className="text-indigo-600 truncate text-[10px]">{format(parseISO(event.start), 'h:mm a')}</div>
                                        {event.location && (
                                            <div className="flex items-center mt-1 text-indigo-500 truncate">
                                                <MapPin size={10} className="mr-1 flex-shrink-0" />
                                                <span className="truncate">{event.location}</span>
                                            </div>
                                        )}
                                        
                                        {/* Download ICS Button on Hover */}
                                        <button 
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                downloadIcs(event);
                                            }}
                                            className="absolute top-1 right-1 p-1 bg-white rounded-full text-indigo-600 shadow-sm opacity-0 group-hover/event:opacity-100 transition-opacity hover:bg-indigo-50"
                                            title="Download .ics"
                                        >
                                            <Download size={12} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        );
                    })}
                 </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
};
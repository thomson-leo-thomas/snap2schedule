import React, { useState, useRef } from 'react';
import { extractDetails } from '../services/geminiService';
import { CalendarEvent, Task, ViewState } from '../types';
import { Button } from './Button';
import { FileText, X, Check, Image as ImageIcon } from 'lucide-react';
import { parseISO } from 'date-fns';

interface ExtractorProps {
  onEventsFound: (events: CalendarEvent[]) => void;
  onTasksFound: (tasks: Task[]) => void;
  onSuccess: (view: ViewState, date?: Date) => void;
}

export const Extractor: React.FC<ExtractorProps> = ({ onEventsFound, onTasksFound, onSuccess }) => {
  const [textInput, setTextInput] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async () => {
    if (!textInput.trim() && !selectedFile) return;

    setIsProcessing(true);
    try {
      const result = await extractDetails(textInput, selectedFile || undefined);
      
      const newEvents: CalendarEvent[] = (result.events || []).map(e => ({
        id: crypto.randomUUID(),
        title: e.title,
        start: e.start,
        end: e.end,
        location: e.location,
        description: e.description || result.summary,
        allDay: !!e.allDay,
        type: 'meeting'
      }));

      const newTasks: Task[] = (result.tasks || []).map(t => ({
        id: crypto.randomUUID(),
        title: t.title,
        status: 'pending',
        dueDate: t.dueDate,
        priority: t.priority
      }));

      onEventsFound(newEvents);
      onTasksFound(newTasks);
      
      // Reset form
      setTextInput('');
      clearFile();

      // Intelligent Routing
      if (newEvents.length > 0) {
        // If we have events, go to calendar and focus on the first event's date
        const firstEventDate = parseISO(newEvents[0].start);
        onSuccess('calendar', firstEventDate);
      } else if (newTasks.length > 0) {
        // If only tasks, go to tasks view
        onSuccess('tasks');
      } else {
        // Fallback
        onSuccess('dashboard');
      }

    } catch (err) {
      console.error(err);
      alert("Failed to extract details. Please try again or check your input.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h2 className="text-2xl font-bold text-slate-800 flex items-center">
            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center mr-3 text-indigo-600">
              <FileText />
            </div>
            Extract Details
          </h2>
          <p className="text-slate-500 mt-1 ml-14">
            Paste meeting notes, emails, or upload a screenshot to automatically find events and tasks.
          </p>
        </div>

        <div className="p-6 space-y-6">
          {/* Text Area */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Text Content</label>
            <textarea
              className="w-full h-40 p-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none text-slate-700"
              placeholder="Paste email content, meeting notes, or raw text here..."
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
            />
          </div>

          {/* Image Upload Area */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Attachment (Optional)</label>
            {!selectedFile ? (
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-300 rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:border-indigo-500 hover:bg-indigo-50 transition-all group"
              >
                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-3 group-hover:bg-white text-slate-400 group-hover:text-indigo-500 transition-colors">
                  <ImageIcon className="w-6 h-6" />
                </div>
                <p className="text-sm font-medium text-slate-700 group-hover:text-indigo-600">Click to upload a screenshot</p>
                <p className="text-xs text-slate-500 mt-1">PNG, JPG up to 5MB</p>
              </div>
            ) : (
              <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-50 group">
                <img src={previewUrl || ''} alt="Preview" className="h-48 w-full object-cover opacity-80" />
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                        onClick={clearFile}
                        className="bg-white/20 hover:bg-white/40 backdrop-blur-sm text-white p-2 rounded-full"
                    >
                        <X size={24} />
                    </button>
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-white/90 backdrop-blur p-3 flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-700 truncate">{selectedFile.name}</span>
                    <span className="text-xs text-slate-500">{(selectedFile.size / 1024).toFixed(0)} KB</span>
                </div>
              </div>
            )}
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>
          
          <div className="flex justify-end pt-4">
            <Button 
                onClick={handleSubmit} 
                disabled={!textInput && !selectedFile} 
                isLoading={isProcessing}
                className="w-full md:w-auto"
                icon={<Check size={18} />}
            >
                Analyze & Create
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
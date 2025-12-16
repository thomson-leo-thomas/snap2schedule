export interface CalendarEvent {
  id: string;
  title: string;
  start: string; // ISO String
  end: string; // ISO String
  location?: string;
  description?: string;
  allDay: boolean;
  type: 'meeting' | 'reminder' | 'task';
}

export interface Task {
  id: string;
  title: string;
  status: 'pending' | 'completed';
  dueDate?: string;
  priority: 'low' | 'medium' | 'high';
}

export interface AiExtractionResponse {
  events: Array<{
    title: string;
    start: string;
    end: string;
    location?: string;
    description?: string;
    allDay?: boolean;
  }>;
  tasks: Array<{
    title: string;
    priority: 'low' | 'medium' | 'high';
    dueDate?: string;
  }>;
  summary?: string;
}

export type ViewState = 'dashboard' | 'extractor' | 'calendar' | 'tasks';
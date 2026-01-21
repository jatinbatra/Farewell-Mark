
import { Message, Category } from '../types';

const STORAGE_KEY = 'farewell_mark_messages';

export const mockDb = {
  getMessages: (): Message[] => {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    return JSON.parse(data);
  },

  addMessage: (message: Omit<Message, 'id' | 'timestamp' | 'rotation'>): Message => {
    const newMessage: Message = {
      ...message,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
      rotation: (Math.random() * 4) - 2, // -2 to +2 degrees
    };
    
    const messages = mockDb.getMessages();
    const updatedMessages = [newMessage, ...messages];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedMessages));
    return newMessage;
  },

  seedIfEmpty: () => {
    const messages = mockDb.getMessages();
    if (messages.length === 0) {
      // Removed initial placeholder messages to provide a clean start for the team.
      localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
    }
  }
};

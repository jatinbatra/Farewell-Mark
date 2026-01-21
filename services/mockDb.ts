
import { Message, Category } from '../types';

const STORAGE_KEY = 'farewell_mark_messages';
const USER_KEY = 'farewell_mark_user_id';

export const mockDb = {
  getUserId: (): string => {
    let id = localStorage.getItem(USER_KEY);
    if (!id) {
      id = 'user_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem(USER_KEY, id);
    }
    return id;
  },

  getMessages: (): Message[] => {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    return JSON.parse(data);
  },

  addMessage: (message: Omit<Message, 'id' | 'timestamp' | 'rotation' | 'authorId'>): Message => {
    const newMessage: Message = {
      ...message,
      id: Math.random().toString(36).substr(2, 9),
      authorId: mockDb.getUserId(),
      timestamp: Date.now(),
      rotation: (Math.random() * 4) - 2,
    };
    
    const messages = mockDb.getMessages();
    const updatedMessages = [newMessage, ...messages];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedMessages));
    return newMessage;
  },

  updateMessage: (id: string, updatedData: Partial<Message>): Message | null => {
    const messages = mockDb.getMessages();
    const index = messages.findIndex(m => m.id === id);
    if (index === -1) return null;

    // Security check: only allow if it's the same author
    if (messages[index].authorId !== mockDb.getUserId()) return null;

    const updatedMessage = { ...messages[index], ...updatedData };
    messages[index] = updatedMessage;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    return updatedMessage;
  },

  deleteMessage: (id: string): boolean => {
    const messages = mockDb.getMessages();
    const message = messages.find(m => m.id === id);
    if (!message || message.authorId !== mockDb.getUserId()) return false;

    const updatedMessages = messages.filter(m => m.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedMessages));
    return true;
  },

  seedIfEmpty: () => {
    const messages = mockDb.getMessages();
    if (messages.length === 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
    }
  }
};

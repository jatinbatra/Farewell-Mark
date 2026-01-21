
import { supabase } from '../supabase';
import { Message, Category } from '../types';

const USER_KEY = 'farewell_mark_user_id';

export const messageService = {
  getUserId: (): string => {
    let id = localStorage.getItem(USER_KEY);
    if (!id) {
      id = 'user_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem(USER_KEY, id);
    }
    return id;
  },

  getMessages: async (): Promise<Message[]> => {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .order('timestamp', { ascending: false });
    
    if (error) {
      console.error("Error fetching messages:", error);
      return [];
    }
    
    return (data || []).map(m => ({
      ...m,
      leadershipPrinciple: m.leadership_principle, // map snake_case to camelCase
      authorId: m.author_id,
      mediaUrl: m.media_url,
      mediaType: m.media_type
    }));
  },

  addMessage: async (message: Omit<Message, 'id' | 'timestamp' | 'rotation' | 'authorId'>): Promise<Message | null> => {
    const authorId = messageService.getUserId();
    const timestamp = Date.now();
    const rotation = (Math.random() * 4) - 2;

    const { data, error } = await supabase
      .from('messages')
      .insert([{
        author_id: authorId,
        name: message.name,
        category: message.category,
        content: message.content,
        media_url: message.mediaUrl,
        media_type: message.mediaType,
        timestamp: timestamp,
        rotation: rotation,
        color: message.color,
        leadership_principle: message.leadershipPrinciple
      }])
      .select()
      .single();

    if (error) {
      console.error("Error adding message:", error);
      return null;
    }

    return {
      ...data,
      leadershipPrinciple: data.leadership_principle,
      authorId: data.author_id,
      mediaUrl: data.media_url,
      mediaType: data.media_type
    };
  },

  updateMessage: async (id: string, updatedData: Partial<Message>): Promise<Message | null> => {
    const userId = messageService.getUserId();
    
    // Map camelCase to snake_case for Supabase
    const payload: any = { ...updatedData };
    if (updatedData.leadershipPrinciple) payload.leadership_principle = updatedData.leadershipPrinciple;
    if (updatedData.mediaUrl) payload.media_url = updatedData.mediaUrl;
    if (updatedData.mediaType) payload.media_type = updatedData.mediaType;

    const { data, error } = await supabase
      .from('messages')
      .update(payload)
      .eq('id', id)
      .eq('author_id', userId) // Security: only author can edit
      .select()
      .single();

    if (error) {
      console.error("Error updating message:", error);
      return null;
    }

    return {
      ...data,
      leadershipPrinciple: data.leadership_principle,
      authorId: data.author_id,
      mediaUrl: data.media_url,
      mediaType: data.media_type
    };
  },

  deleteMessage: async (id: string): Promise<boolean> => {
    const userId = messageService.getUserId();
    const { error } = await supabase
      .from('messages')
      .delete()
      .eq('id', id)
      .eq('author_id', userId);

    if (error) {
      console.error("Error deleting message:", error);
      return false;
    }
    return true;
  },

  uploadMedia: async (file: File): Promise<string | null> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `tributes/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('media')
      .upload(filePath, file);

    if (uploadError) {
      console.error("Error uploading file:", uploadError);
      return null;
    }

    const { data } = supabase.storage.from('media').getPublicUrl(filePath);
    return data.publicUrl;
  }
};


import { supabase, isSupabaseConfigured } from '../supabase';
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
    if (!isSupabaseConfigured) return [];
    
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
      leadershipPrinciple: m.leadership_principle,
      authorId: m.author_id,
      mediaUrl: m.media_url,
      mediaType: m.media_type
    }));
  },

  addMessage: async (message: Omit<Message, 'id' | 'timestamp' | 'rotation' | 'authorId'>): Promise<Message | null> => {
    if (!isSupabaseConfigured) return null;
    
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
    if (!isSupabaseConfigured) return null;
    
    const userId = messageService.getUserId();
    const payload: any = { ...updatedData };
    if (updatedData.leadershipPrinciple) payload.leadership_principle = updatedData.leadershipPrinciple;
    if (updatedData.mediaUrl) payload.media_url = updatedData.mediaUrl;
    if (updatedData.mediaType) payload.media_type = updatedData.mediaType;

    const { data, error } = await supabase
      .from('messages')
      .update(payload)
      .eq('id', id)
      .eq('author_id', userId)
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
    if (!isSupabaseConfigured) return false;
    
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
    if (!isSupabaseConfigured) {
       console.error("Cannot upload: Supabase not configured.");
       return null;
    }
    
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${fileExt}`;
    const filePath = `tributes/${fileName}`;

    console.log(`Starting upload to 'media' bucket: ${filePath}`);

    const { error: uploadError } = await supabase.storage
      .from('media')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      console.error("Supabase Storage Error:", uploadError.message);
      alert(`Upload failed: ${uploadError.message}. Make sure your bucket is named exactly 'media'.`);
      return null;
    }

    const { data } = supabase.storage.from('media').getPublicUrl(filePath);
    
    if (!data?.publicUrl) {
      console.error("Failed to generate public URL.");
      return null;
    }

    // Verify it's a real URL
    if (!data.publicUrl.startsWith('http')) {
      console.error("Public URL generated is not absolute:", data.publicUrl);
      return null;
    }

    console.log("Upload success! URL:", data.publicUrl);
    return data.publicUrl;
  }
};

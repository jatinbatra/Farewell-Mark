
import React, { useState, useRef, useEffect } from 'react';
import { Category, Message } from '../types';
import { CATEGORY_METADATA, LEADERSHIP_PRINCIPLES } from '../constants';
import { messageService } from '../services/messageService';
import { mockDb } from '../services/mockDb';
import { Loader2, X } from 'lucide-react';

interface MessageFormProps {
  initialData?: Message;
  onAdd: (message: Message) => void;
  onUpdate: (message: Message) => void;
  onCancel: () => void;
  mode: 'supabase' | 'local';
}

export const MessageForm: React.FC<MessageFormProps> = ({ initialData, onAdd, onUpdate, onCancel, mode }) => {
  const [name, setName] = useState(initialData?.name || '');
  const [category, setCategory] = useState<Category>(initialData?.category || Category.WISHES);
  const [content, setContent] = useState(initialData?.content || '');
  const [principle, setPrinciple] = useState(initialData?.leadershipPrinciple || LEADERSHIP_PRINCIPLES[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialData?.mediaUrl || null);
  
  const nameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    nameInputRef.current?.focus();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !content || isSubmitting) return;

    setIsSubmitting(true);
    try {
      let finalMediaUrl = previewUrl || undefined;
      let finalMediaType: 'image' | 'video' = 'image';

      if (mediaFile && mode === 'supabase') {
        const uploadedUrl = await messageService.uploadMedia(mediaFile);
        if (uploadedUrl) {
          finalMediaUrl = uploadedUrl;
          finalMediaType = mediaFile.type.startsWith('video') ? 'video' : 'image';
        }
      }

      const messagePayload = {
        name, category, content, 
        leadershipPrinciple: principle,
        color: CATEGORY_METADATA[category].color,
        mediaUrl: finalMediaUrl, 
        mediaType: finalMediaType,
      };

      if (initialData) {
        const updated = mode === 'supabase' 
          ? await messageService.updateMessage(initialData.id, messagePayload)
          : mockDb.updateMessage(initialData.id, messagePayload);
        if (updated) onUpdate(updated);
      } else {
        const added = mode === 'supabase'
          ? await messageService.addMessage(messagePayload)
          : mockDb.addMessage(messagePayload);
        if (added) onAdd(added);
      }
    } catch (err: any) {
      console.error("Submission error:", err);
      alert(err.message || "Failed to save.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setMediaFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreviewUrl(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Your Name</label>
          <input
            ref={nameInputRef}
            type="text" required value={name}
            onChange={e => setName(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FF9900] outline-none text-gray-900 bg-white"
            placeholder="e.g. Jeff B."
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
          <select
            value={category}
            onChange={e => setCategory(e.target.value as Category)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FF9900] outline-none bg-white text-gray-900"
          >
            {Object.values(Category).map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Message</label>
        <textarea
          required maxLength={500} rows={4} value={content}
          onChange={e => setContent(e.target.value)}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FF9900] outline-none resize-none text-gray-900 bg-white"
          placeholder="Share a story or wish Mark well..."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Leadership Principle</label>
          <select
            value={principle}
            onChange={e => setPrinciple(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FF9900] outline-none bg-white text-gray-900"
          >
            {LEADERSHIP_PRINCIPLES.map(lp => <option key={lp} value={lp}>{lp}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Media</label>
          <div className="relative h-[48px]">
             <input type="file" accept="image/*,video/mp4" onChange={handleMediaChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
             <div className="h-full border-2 border-dashed border-gray-200 rounded-xl flex items-center justify-center text-xs text-gray-500 bg-white">
                {mediaFile ? mediaFile.name : 'Click to Upload Image'}
             </div>
          </div>
        </div>
      </div>

      {previewUrl && (
        <div className="relative w-24 h-24 rounded-lg overflow-hidden border-2 border-[#FF9900] group">
          <img src={previewUrl} className="w-full h-full object-cover" alt="Preview" />
          <button 
            type="button" 
            onClick={() => {setPreviewUrl(null); setMediaFile(null);}} 
            className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      <div className="flex gap-3 pt-4">
        <button type="button" onClick={onCancel} className="flex-1 px-6 py-3 border rounded-xl font-bold text-gray-600 hover:bg-gray-50 transition-colors">Cancel</button>
        <button type="submit" disabled={isSubmitting} className="flex-1 px-6 py-3 bg-[#FF9900] text-white rounded-xl font-bold shadow-lg disabled:opacity-50 flex items-center justify-center gap-2 hover:bg-[#E68A00] transition-all">
          {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
          {initialData ? 'Update' : 'Post to Card'}
        </button>
      </div>
    </form>
  );
};

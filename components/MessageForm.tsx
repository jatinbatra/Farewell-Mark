
import React, { useState, useRef, useEffect } from 'react';
import { Category, Message } from '../types';
import { CATEGORY_METADATA, LEADERSHIP_PRINCIPLES } from '../constants';
import { mockDb } from '../services/mockDb';
import { GoogleGenAI } from "@google/genai";
import { Sparkles, Image as ImageIcon, Loader2 } from 'lucide-react';

interface MessageFormProps {
  initialData?: Message;
  onAdd: (message: Message) => void;
  onUpdate: (message: Message) => void;
  onCancel: () => void;
}

export const MessageForm: React.FC<MessageFormProps> = ({ initialData, onAdd, onUpdate, onCancel }) => {
  const [name, setName] = useState(initialData?.name || '');
  const [category, setCategory] = useState<Category>(initialData?.category || Category.WISHES);
  const [content, setContent] = useState(initialData?.content || '');
  const [principle, setPrinciple] = useState(initialData?.leadershipPrinciple || LEADERSHIP_PRINCIPLES[0]);
  const [isGeneratingText, setIsGeneratingText] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialData?.mediaUrl || null);
  
  const nameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    nameInputRef.current?.focus();
  }, []);

  const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        alert("File too large (max 10MB)");
        return;
      }
      setMediaFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const generateAIImage = async () => {
    setIsGeneratingImage(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const basePrompt = content || "A warm farewell to a great manager";
      const prompt = `A high-quality 3D digital 1K resolution illustration for a farewell card for an Amazon manager. Theme: ${category}. Details: ${basePrompt}. Incorporate subtle Amazon elements like delivery boxes or smiles, and a playful banana motif. Vibrant colors, orange and navy blue accents.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts: [{ text: prompt }] },
        config: {
          imageConfig: {
            aspectRatio: "1:1"
          }
        }
      });

      const candidate = response.candidates?.[0];
      if (candidate?.content?.parts) {
        for (const part of candidate.content.parts) {
          if (part.inlineData) {
            const base64Data = part.inlineData.data;
            const imageUrl = `data:${part.inlineData.mimeType};base64,${base64Data}`;
            setPreviewUrl(imageUrl);
            setMediaFile(null);
            break;
          }
        }
      }
    } catch (err) {
      console.error("Image generation failed:", err);
      alert("Failed to generate magic art.");
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !content) return;

    if (initialData) {
      const updated = mockDb.updateMessage(initialData.id, {
        name,
        category,
        content,
        leadershipPrinciple: principle,
        color: CATEGORY_METADATA[category].color,
        mediaUrl: previewUrl || undefined,
        mediaType: mediaFile?.type.startsWith('video') ? 'video' : (initialData.mediaType || 'image'),
      });
      if (updated) onUpdate(updated);
    } else {
      const newMessage = mockDb.addMessage({
        name,
        category,
        content,
        leadershipPrinciple: principle,
        color: CATEGORY_METADATA[category].color,
        mediaUrl: previewUrl || undefined,
        mediaType: mediaFile?.type.startsWith('video') ? 'video' : 'image',
      });
      onAdd(newMessage);
    }
  };

  const generateAIPun = async () => {
    setIsGeneratingText(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Generate a funny short farewell message (max 150 chars) for a manager named Mark leaving Amazon. Use puns related to "going bananas", Amazon shipping boxes, or "Day 1".`,
      });
      if (response.text) {
        setContent(prev => (prev ? prev + "\n" + response.text : response.text));
      }
    } catch (err) {
      console.error(err);
      setContent(prev => prev + "\nWe're definitely going bananas without you, Mark! 🍌");
    } finally {
      setIsGeneratingText(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Your Name</label>
          <input
            ref={nameInputRef}
            type="text"
            required
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FF9900] outline-none transition-all text-gray-900 bg-white"
            placeholder="e.g. Jeff B."
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
          <select
            value={category}
            onChange={e => setCategory(e.target.value as Category)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FF9900] outline-none bg-white transition-all text-gray-900"
          >
            {Object.values(Category).map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-semibold text-gray-700">Message</label>
          <button 
            type="button"
            onClick={generateAIPun}
            disabled={isGeneratingText}
            className="text-xs font-bold text-[#FF9900] hover:text-[#E68A00] flex items-center gap-1 transition-colors"
          >
            {isGeneratingText ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
            {isGeneratingText ? 'Thinking...' : '✨ Suggest a Pun'}
          </button>
        </div>
        <div className="relative">
          <textarea
            required
            maxLength={500}
            rows={4}
            value={content}
            onChange={e => setContent(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FF9900] outline-none resize-none transition-all text-gray-900 bg-white"
            placeholder="Write your farewell note here..."
          />
          <div className="absolute bottom-3 right-3 text-xs text-gray-400">
            {content.length}/500
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Leadership Principle Tag</label>
          <select
            value={principle}
            onChange={e => setPrinciple(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FF9900] outline-none bg-white text-gray-900"
          >
            {LEADERSHIP_PRINCIPLES.map(lp => (
              <option key={lp} value={lp}>{lp}</option>
            ))}
          </select>
        </div>
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-semibold text-gray-700">Add Media</label>
            <button 
              type="button"
              onClick={generateAIImage}
              disabled={isGeneratingImage}
              className="text-xs font-bold text-[#232F3E] hover:text-black flex items-center gap-1 bg-yellow-100 px-2 py-1 rounded-full border border-yellow-200 transition-all hover:shadow-sm disabled:opacity-50"
            >
              {isGeneratingImage ? <Loader2 className="w-3 h-3 animate-spin" /> : <ImageIcon className="w-3 h-3" />}
              {isGeneratingImage ? 'Generating...' : '✨ Magic AI Art'}
            </button>
          </div>
          <div className="relative h-[48px]">
             <input
                type="file"
                accept="image/*,video/mp4"
                onChange={handleMediaChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div className="h-full border-2 border-dashed border-gray-200 rounded-xl flex items-center justify-center text-xs text-gray-500 hover:border-[#FF9900] hover:text-[#FF9900] transition-all bg-white">
                {mediaFile ? mediaFile.name : previewUrl?.startsWith('data:image') ? 'AI Image Generated' : 'Upload Image/GIF/Video'}
              </div>
          </div>
        </div>
      </div>

      {previewUrl && (
        <div className="relative group/preview w-32 h-32 rounded-lg overflow-hidden border border-gray-200 shadow-md bg-gray-50">
           {previewUrl.startsWith('data:video') || (mediaFile && mediaFile.type.startsWith('video')) ? (
             <video src={previewUrl} className="w-full h-full object-cover" />
           ) : (
             <img src={previewUrl} className="w-full h-full object-cover" alt="Preview" />
           )}
           <button 
             type="button"
             onClick={() => { setMediaFile(null); setPreviewUrl(null); }}
             className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 opacity-0 group-hover/preview:opacity-100 transition-opacity"
           >
             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
           </button>
        </div>
      )}

      <div className="flex gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-6 py-3 border border-gray-200 rounded-xl font-bold text-gray-600 hover:bg-gray-50 transition-all"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="flex-1 px-6 py-3 bg-[#FF9900] hover:bg-[#E68A00] text-white rounded-xl font-bold shadow-lg shadow-orange-200 transition-all transform active:scale-95"
        >
          {initialData ? 'Update Message' : 'Add to the Card'}
        </button>
      </div>
    </form>
  );
};

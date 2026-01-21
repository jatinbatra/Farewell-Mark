
import React, { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Message } from '../types';
import { CATEGORY_METADATA } from '../constants';
import { messageService } from '../services/messageService';
import { Pencil, Trash2, User, ImageOff, ExternalLink, ShieldAlert, RotateCw, Maximize2 } from 'lucide-react';

interface MessageCardProps {
  message: Message;
  onEdit?: (message: Message) => void;
  onDelete?: (id: string) => void;
}

export const MessageCard: React.FC<MessageCardProps> = ({ message, onEdit, onDelete }) => {
  const { icon } = CATEGORY_METADATA[message.category];
  const isAuthor = message.authorId === messageService.getUserId();
  const [imageError, setImageError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  
  const getMediaUrl = () => {
    if (!message.mediaUrl) return null;
    // IMPORTANT: Never append query strings to data URLs (Base64)
    if (message.mediaUrl.startsWith('data:')) return message.mediaUrl;
    // Only add cache busting for remote URLs
    return `${message.mediaUrl}${message.mediaUrl.includes('?') ? '&' : '?'}v=${message.timestamp}-${retryCount}`;
  };

  const handleRetry = (e: React.MouseEvent) => {
    e.stopPropagation();
    setImageError(false);
    setRetryCount(prev => prev + 1);
  };

  const mediaUrl = getMediaUrl();

  return (
    <>
      <div 
        className="group relative bg-white p-6 rounded-sm shadow-sm hover:shadow-2xl transition-all duration-300 transform cursor-default"
        style={{ 
          transform: `rotate(${message.rotation}deg)`,
          backgroundColor: message.color,
          borderBottom: '4px solid rgba(0,0,0,0.05)',
          borderRight: '1px solid rgba(0,0,0,0.03)'
        }}
      >
        {/* Category Badge */}
        <div className="absolute -top-3 -right-3 bg-white p-2 rounded-lg shadow-md border border-gray-100 flex items-center justify-center group-hover:scale-110 transition-transform z-10">
          <span className="text-[#232F3E]">{icon}</span>
        </div>

        {/* Author Badge */}
        {isAuthor && (
          <div className="absolute -top-2 left-4 bg-[#FF9900] text-[#232F3E] text-[9px] font-black uppercase px-2 py-0.5 rounded shadow-sm flex items-center gap-1 z-10 border border-black/10">
            <User className="w-2.5 h-2.5" />
            Your Note
          </div>
        )}

        {/* Controls */}
        {isAuthor && (
          <div className="absolute -bottom-2 -left-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-20">
            <button onClick={() => onEdit?.(message)} className="p-1.5 bg-white shadow-md rounded-full text-blue-600 hover:bg-blue-50 border border-gray-100 transition-colors">
              <Pencil className="w-3.5 h-3.5" />
            </button>
            <button onClick={() => onDelete?.(message.id)} className="p-1.5 bg-white shadow-md rounded-full text-red-600 hover:bg-red-50 border border-gray-100 transition-colors">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        <div className="mb-4">
          <h4 className="font-bold text-[#232F3E] text-lg leading-tight">{message.name}</h4>
          {message.leadershipPrinciple && (
            <span className="inline-block mt-1 px-2 py-0.5 bg-black/5 text-[10px] uppercase font-bold tracking-wider rounded border border-black/10">
              {message.leadershipPrinciple}
            </span>
          )}
        </div>

        <div className="text-[#2D3748] whitespace-pre-wrap leading-relaxed mb-4 text-sm font-medium">
          {message.content}
        </div>

        {message.mediaUrl && (
          <div className="mb-4 rounded-lg overflow-hidden bg-black/5 relative min-h-[120px] flex flex-col items-center justify-center border border-black/5">
            {message.mediaType === 'video' ? (
              <video 
                src={mediaUrl || ''} 
                className="w-full aspect-video object-cover" 
                controls 
                preload="metadata"
              />
            ) : (
              <div className="relative w-full group/img">
                {imageError ? (
                  <div className="flex flex-col items-center gap-2 py-8 px-4 text-center">
                    <ShieldAlert className="w-8 h-8 text-gray-300" />
                    <p className="text-[10px] font-bold text-gray-400 uppercase">Image Denied</p>
                    <div className="flex gap-2 mt-2">
                      <button 
                        onClick={handleRetry}
                        className="text-[9px] font-bold bg-white border border-gray-200 px-3 py-1.5 rounded flex items-center gap-1 shadow-sm hover:bg-gray-50"
                      >
                        <RotateCw className="w-3 h-3" /> Retry
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <img 
                      key={`${message.id}-${retryCount}`}
                      src={mediaUrl || ''} 
                      alt="Farewell Memory" 
                      className="w-full h-auto object-cover max-h-72 cursor-zoom-in"
                      onClick={() => setIsZoomed(true)}
                      onError={() => {
                        console.error("Image load error for message:", message.id);
                        setImageError(true);
                      }}
                    />
                    <div className="absolute bottom-2 right-2 opacity-0 group-hover/img:opacity-100 transition-opacity bg-black/50 p-1 rounded backdrop-blur-sm pointer-events-none">
                      <Maximize2 className="w-3 h-3 text-white" />
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        )}

        <div className="flex justify-between items-center text-[10px] text-gray-500 font-bold uppercase mt-2 opacity-60">
          <span>{message.category}</span>
          <span>{formatDistanceToNow(message.timestamp, { addSuffix: true })}</span>
        </div>

        <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-16 h-8 bg-white/40 backdrop-blur-sm -rotate-2 border border-white/20 pointer-events-none"></div>
      </div>

      {/* Fullscreen Lightbox */}
      {isZoomed && mediaUrl && (
        <div 
          className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 cursor-zoom-out"
          onClick={() => setIsZoomed(false)}
        >
          <img src={mediaUrl} className="max-w-full max-h-full rounded shadow-2xl object-contain" alt="Zoomed View" />
          <button className="absolute top-6 right-6 text-white bg-white/10 p-2 rounded-full hover:bg-white/20 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
      )}
    </>
  );
};


import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Message } from '../types';
import { CATEGORY_METADATA } from '../constants';
import { Play } from 'lucide-react';

interface MessageCardProps {
  message: Message;
}

export const MessageCard: React.FC<MessageCardProps> = ({ message }) => {
  const { icon } = CATEGORY_METADATA[message.category];
  
  return (
    <div 
      className="group relative bg-white p-6 rounded-sm shadow-sm hover:shadow-2xl transition-all duration-300 transform"
      style={{ 
        transform: `rotate(${message.rotation}deg)`,
        backgroundColor: message.color,
        borderBottom: '4px solid rgba(0,0,0,0.05)',
        borderRight: '1px solid rgba(0,0,0,0.03)'
      }}
    >
      {/* Category Badge */}
      <div className="absolute -top-3 -right-3 bg-white p-2 rounded-lg shadow-md border border-gray-100 flex items-center justify-center group-hover:scale-110 transition-transform">
        <span className="text-[#232F3E]">{icon}</span>
      </div>

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
        <div className="mb-4 rounded-lg overflow-hidden bg-black/5 relative group/media">
          {message.mediaType === 'video' ? (
            <div className="relative aspect-video flex items-center justify-center bg-gray-900">
              <video src={message.mediaUrl} className="w-full h-full object-cover opacity-80" />
              <div className="absolute inset-0 flex items-center justify-center">
                 <div className="w-12 h-12 bg-white/30 backdrop-blur rounded-full flex items-center justify-center group-hover/media:scale-110 transition-all">
                    <Play className="w-6 h-6 text-white fill-white" />
                 </div>
              </div>
            </div>
          ) : (
            <img 
              src={message.mediaUrl} 
              alt="Memory" 
              className="w-full h-auto object-cover max-h-60"
              loading="lazy"
            />
          )}
        </div>
      )}

      <div className="flex justify-between items-center text-[10px] text-gray-500 font-bold uppercase mt-2 opacity-60">
        <span>{message.category}</span>
        <span>{formatDistanceToNow(message.timestamp, { addSuffix: true })}</span>
      </div>

      {/* Tape Effect Decorative Element */}
      <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-16 h-8 bg-white/40 backdrop-blur-sm -rotate-2 border border-white/20"></div>
    </div>
  );
};

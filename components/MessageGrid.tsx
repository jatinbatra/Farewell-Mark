
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Message, Category } from '../types';
import { MessageCard } from './MessageCard';

interface MessageGridProps {
  messages: Message[];
  activeFilter?: Category | 'All';
  onEdit?: (message: Message) => void;
  onDelete?: (id: string) => void;
}

export const MessageGrid: React.FC<MessageGridProps> = ({ messages, activeFilter = 'All', onEdit, onDelete }) => {
  if (messages.length === 0) {
    const isFiltered = activeFilter !== 'All';
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center bg-white/50 rounded-3xl border-2 border-dashed border-gray-200">
        <div className="text-6xl mb-4 grayscale opacity-50">🍌</div>
        <h3 className="text-xl font-bold text-[#232F3E] mb-2">
          {isFiltered ? `No ${activeFilter} yet` : "No messages yet"}
        </h3>
        <p className="text-gray-500 max-w-xs mx-auto">
          {isFiltered 
            ? `Be the first to share a ${activeFilter.toLowerCase()} for Mark's farewell card!` 
            : "The card is currently blank. Be the first to leave a tribute for Mark!"}
        </p>
      </div>
    );
  }

  return (
    <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
      <AnimatePresence mode="popLayout">
        {messages.map((msg, index) => (
          <motion.div
            key={msg.id}
            layout
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ 
              duration: 0.4,
              delay: index * 0.05,
              type: "spring",
              damping: 20,
              stiffness: 100
            }}
            className="break-inside-avoid"
          >
            <MessageCard 
              message={msg} 
              onEdit={onEdit}
              onDelete={onDelete}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

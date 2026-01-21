
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Box, Smile } from 'lucide-react';
import { Layout } from './components/Layout';
import { Hero } from './components/Hero';
import { MessageForm } from './components/MessageForm';
import { MessageGrid } from './components/MessageGrid';
import { mockDb } from './services/mockDb';
import { Message, Category } from './types';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [filter, setFilter] = useState<Category | 'All'>('All');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingMessage, setEditingMessage] = useState<Message | undefined>(undefined);

  useEffect(() => {
    mockDb.seedIfEmpty();
    setMessages(mockDb.getMessages());
  }, []);

  const handleAddMessage = (newMessage: Message) => {
    setMessages(prev => [newMessage, ...prev]);
    setIsFormOpen(false);
    
    const isBanana = newMessage.content.toLowerCase().includes('banana');
    
    if (isBanana) {
      const duration = 3 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };

      const interval: any = setInterval(function() {
        const timeLeft = animationEnd - Date.now();
        if (timeLeft <= 0) return clearInterval(interval);
        const particleCount = 50 * (timeLeft / duration);
        confetti({ ...defaults, particleCount, origin: { x: Math.random(), y: Math.random() - 0.2 }, colors: ['#FFE135', '#FFD700', '#FF9900'] });
      }, 250);
    } else {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FF9900', '#232F3E', '#FFB84D']
      });
    }
  };

  const handleUpdateMessage = (updatedMessage: Message) => {
    setMessages(prev => prev.map(m => m.id === updatedMessage.id ? updatedMessage : m));
    setIsFormOpen(false);
    setEditingMessage(undefined);
  };

  const handleDeleteMessage = (id: string) => {
    if (window.confirm('Are you sure you want to remove your message?')) {
      if (mockDb.deleteMessage(id)) {
        setMessages(prev => prev.filter(m => m.id !== id));
      }
    }
  };

  const handleEditMessage = (message: Message) => {
    setEditingMessage(message);
    setIsFormOpen(true);
  };

  const onNavAction = (action: 'messages' | 'memories' | 'stats') => {
    if (action === 'messages') {
      setFilter('All');
      document.getElementById('message-board')?.scrollIntoView({ behavior: 'smooth' });
    } else if (action === 'memories') {
      setFilter(Category.MEMORY);
      document.getElementById('message-board')?.scrollIntoView({ behavior: 'smooth' });
    } else if (action === 'stats') {
      document.getElementById('stats-grid')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleStatClick = (type: 'messages' | 'members' | 'days') => {
    if (type === 'messages' || type === 'members') {
      setFilter('All');
      document.getElementById('message-board')?.scrollIntoView({ behavior: 'smooth' });
    } else if (type === 'days') {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.3, x: 0.8 },
        colors: ['#FF9900', '#FFFFFF']
      });
    }
  };

  const filteredMessages = filter === 'All' 
    ? messages 
    : messages.filter(m => m.category === filter);

  const getCategoryCount = (cat: Category) => messages.filter(m => m.category === cat).length;
  const populatedCategories = Object.values(Category).filter(cat => getCategoryCount(cat) > 0);

  return (
    <Layout onNavAction={onNavAction}>
      <Hero 
        stats={{
          totalMessages: messages.length,
          teamMembers: new Set(messages.map(m => m.name)).size,
          daysAtAmazon: 1612 
        }} 
        onStatClick={handleStatClick}
      />
      
      <div id="message-board" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-10 pb-20">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div className="flex flex-wrap gap-2 justify-center order-2 md:order-1">
            <button
              onClick={() => setFilter('All')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                filter === 'All' 
                ? 'bg-[#232F3E] text-white shadow-lg' 
                : 'bg-white text-[#232F3E] hover:bg-gray-100 border border-gray-200'
              }`}
            >
              All ({messages.length})
            </button>
            {populatedCategories.map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  filter === cat 
                  ? 'bg-[#FF9900] text-white shadow-lg' 
                  : 'bg-white text-[#232F3E] hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {cat} ({getCategoryCount(cat)})
              </button>
            ))}
          </div>

          <div className="order-1 md:order-2 ml-auto">
            <button
              onClick={() => {
                setEditingMessage(undefined);
                setIsFormOpen(true);
              }}
              className="bg-[#FF9900] hover:bg-[#E68A00] text-white px-8 py-3 rounded-full font-bold shadow-xl transition-all transform hover:scale-105 active:scale-95 flex items-center gap-2"
            >
              <span className="text-xl">+</span> Add to the Card
            </button>
          </div>
        </div>

        <MessageGrid 
          messages={filteredMessages} 
          onEdit={handleEditMessage}
          onDelete={handleDeleteMessage}
        />

        <AnimatePresence>
          {isFormOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={(e) => e.target === e.currentTarget && setIsFormOpen(false)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden"
              >
                <div className="p-8">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-[#232F3E]">
                      {editingMessage ? 'Update Your Message' : 'Sign the Farewell Card'}
                    </h2>
                    <button 
                      onClick={() => setIsFormOpen(false)}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  <MessageForm 
                    initialData={editingMessage}
                    onAdd={handleAddMessage} 
                    onUpdate={handleUpdateMessage}
                    onCancel={() => setIsFormOpen(false)} 
                  />
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <footer className="bg-[#232F3E] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-xl font-bold mb-2">Farewell Mark Sansbury</p>
          <p className="text-orange-400 font-medium mb-6 italic tracking-wide">Celebrating 4 years, 4 months, 29 days of Impact</p>
          <p className="mb-4 text-gray-400">© 2026 Farewell Mark Sansbury - Built with Amazon Spirit</p>
          <div className="flex justify-center gap-6 opacity-30">
             {Array.from({length: 3}).map((_, i) => (
                <div key={i} className="flex gap-4">
                  <Box className="w-5 h-5" />
                  <Smile className="w-5 h-5" />
                </div>
             ))}
          </div>
          <p className="mt-6 text-sm italic text-gray-500">"Work Hard, Have Fun, Make History."</p>
        </div>
      </footer>
    </Layout>
  );
};

export default App;

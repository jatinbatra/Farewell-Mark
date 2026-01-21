
import React, { useState, useEffect } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';
import { Box, Users, Clock, MessageCircle } from 'lucide-react';
import { Stats } from '../types';

interface HeroProps {
  stats: Stats;
  onStatClick?: (type: 'messages' | 'members' | 'days') => void;
}

const AnimatedCounter = ({ value }: { value: number }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = value;
    if (start === end) return;

    let totalDuration = 1500;
    let increment = end / (totalDuration / 16);
    
    let timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setDisplayValue(end);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [value]);

  return <span>{displayValue.toLocaleString()}</span>;
};

export const Hero: React.FC<HeroProps> = ({ stats, onStatClick }) => {
  return (
    <div id="hero-section" className="relative bg-[#232F3E] text-white pt-20 pb-32 overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-10">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ y: -20, x: Math.random() * 100 + '%' }}
            animate={{ 
              y: '100vh',
              rotate: 360 
            }}
            transition={{ 
              duration: Math.random() * 10 + 10, 
              repeat: Infinity, 
              ease: "linear" 
            }}
            className="absolute top-0 text-[#FF9900]"
          >
            {i % 3 === 0 ? '🍌' : i % 3 === 1 ? '📦' : '✨'}
          </motion.div>
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="flex flex-col items-center text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", damping: 12, stiffness: 100 }}
            className="mb-6 relative"
          >
            <div className="w-32 h-32 bg-[#FF9900] rounded-3xl flex items-center justify-center transform rotate-6 shadow-2xl">
              <Box className="w-16 h-16 text-[#232F3E]" />
            </div>
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute -top-4 -right-4 bg-white text-[#232F3E] p-2 rounded-full shadow-lg text-xl"
            >
              🍌
            </motion.div>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-extrabold mb-2 tracking-tight"
          >
            Farewell, <span className="text-[#FF9900]">Mark Sansbury</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl md:text-2xl text-orange-400 font-bold mb-1"
          >
            4 years, 4 months, 29 days
          </motion.p>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-gray-300 banana-accent italic"
          >
            "Going Bananas Without You" 🍌
          </motion.p>

          <div id="stats-grid" className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 w-full max-w-4xl">
            <StatCard 
              icon={<MessageCircle className="w-6 h-6 text-[#FF9900]" />}
              label="Total Messages"
              value={stats.totalMessages}
              delay={0.2}
              onClick={() => onStatClick?.('messages')}
            />
            <StatCard 
              icon={<Users className="w-6 h-6 text-[#FF9900]" />}
              label="Team Contributors"
              value={stats.teamMembers}
              delay={0.3}
              onClick={() => onStatClick?.('members')}
            />
            <StatCard 
              icon={<Clock className="w-6 h-6 text-[#FF9900]" />}
              label="Day 1s at Amazon"
              value={stats.daysAtAmazon}
              delay={0.4}
              onClick={() => onStatClick?.('days')}
            />
          </div>
        </div>
      </div>
      
      {/* Wave bottom decoration */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-[#FAFAF8]" style={{ clipPath: 'polygon(0 100%, 100% 100%, 100% 0, 0 100%)' }}></div>
    </div>
  );
};

const StatCard: React.FC<{ icon: React.ReactNode; label: string; value: number; delay: number; onClick?: () => void }> = ({ icon, label, value, delay, onClick }) => (
  <motion.button
    initial={{ opacity: 0, scale: 0.9 }}
    whileInView={{ opacity: 1, scale: 1 }}
    whileHover={{ y: -5, borderColor: 'rgba(255, 153, 0, 0.4)', backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
    viewport={{ once: true }}
    transition={{ delay, duration: 0.2 }}
    onClick={onClick}
    className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 flex flex-col items-center group transition-all"
  >
    <div className="mb-3 transform group-hover:scale-110 transition-transform">{icon}</div>
    <div className="text-3xl font-bold mb-1">
      <AnimatedCounter value={value} />
    </div>
    <div className="text-xs text-gray-400 uppercase tracking-widest group-hover:text-orange-400 transition-colors font-semibold">{label}</div>
  </motion.button>
);

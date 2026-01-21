
import React from 'react';
import { Package, Menu } from 'lucide-react';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-[#232F3E] text-white sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-[#FF9900] p-1.5 rounded">
               <Package className="w-5 h-5 text-[#232F3E]" />
            </div>
            <span className="font-bold text-lg tracking-tight">farewell<span className="text-[#FF9900]">mark</span></span>
            <span className="hidden sm:inline-block ml-2 text-xs text-gray-400 px-2 py-1 bg-white/5 rounded">4y 4m 29d</span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
            <a href="#" className="hover:text-[#FF9900] transition-colors">Messages</a>
            <a href="#" className="hover:text-[#FF9900] transition-colors">Memories</a>
            <a href="#" className="hover:text-[#FF9900] transition-colors">Team Stats</a>
            <button className="bg-[#FF9900] text-[#232F3E] px-4 py-1.5 rounded font-bold hover:bg-[#E68A00] transition-colors">
              Share link
            </button>
          </nav>
          <button className="md:hidden">
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </header>
      <main className="flex-grow">
        {children}
      </main>
    </div>
  );
};

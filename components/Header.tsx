
import React from 'react';
import { Theme } from '../types';

interface HeaderProps {
  theme: Theme;
  toggleTheme: () => void;
}

const Header: React.FC<HeaderProps> = ({ theme, toggleTheme }) => {
  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 gradient-blue rounded-xl flex items-center justify-center text-white shadow-lg">
            <i className="fa-solid fa-camera-retro text-xl"></i>
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white leading-none">AFDAL GANTENG</span>
            <span className="text-[10px] uppercase font-bold text-primary-500 tracking-[0.2em]">Editor Foto AI</span>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600 dark:text-slate-400">
          <a href="#" className="hover:text-primary-500 transition-colors">Home</a>
          <a href="#" className="hover:text-primary-500 transition-colors">Showcase</a>
          <a href="#" className="hover:text-primary-500 transition-colors">Tutorial</a>
          <a href="#" className="hover:text-primary-500 transition-colors">Pricing</a>
        </nav>

        <div className="flex items-center gap-4">
          <button
            onClick={toggleTheme}
            className="w-10 h-10 rounded-full flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
            aria-label="Toggle Theme"
          >
            {theme === Theme.LIGHT ? (
              <i className="fa-solid fa-moon text-lg"></i>
            ) : (
              <i className="fa-solid fa-sun text-lg"></i>
            )}
          </button>
          
          <button className="hidden sm:block py-2.5 px-6 rounded-full font-bold text-white gradient-blue shadow-lg hover:scale-105 active:scale-95 transition-all text-sm">
            Gabung Sekarang
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;

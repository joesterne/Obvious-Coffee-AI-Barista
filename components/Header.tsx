import React, { memo } from 'react';
import { View } from '../types';
import { Coffee, ChevronLeft, History as HistoryIcon, Heart } from 'lucide-react';

interface HeaderProps {
  currentView: View;
  setCurrentView: (view: View) => void;
}

const Header: React.FC<HeaderProps> = ({ currentView, setCurrentView }) => {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-coffee-100 px-6 py-4">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <button 
          onClick={() => setCurrentView(View.HOME)} 
          className="text-2xl font-brand font-bold text-coffee-950 flex items-center gap-2 hover:opacity-80 transition-opacity uppercase tracking-wider"
        >
          <Coffee className="text-coffee-600" />
          <span>OBVIOUS COFFEE</span>
        </button>
        <div className="flex items-center gap-2 sm:gap-4">
             {currentView !== View.HOME && (
              <button 
                onClick={() => setCurrentView(View.HOME)}
                className="text-coffee-600 hover:text-coffee-900 font-medium text-sm flex items-center gap-1"
              >
                <ChevronLeft size={16} /> Hub
              </button>
            )}
            <button
               onClick={() => setCurrentView(View.HISTORY)}
               className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${currentView === View.HISTORY ? 'bg-coffee-100 text-coffee-800' : 'text-coffee-600 hover:text-coffee-900 hover:bg-coffee-50'}`}
               title="Brew History"
            >
               <HistoryIcon size={16} className={currentView === View.HISTORY ? "text-coffee-800" : ""} /> 
               <span className="hidden sm:inline">History</span>
            </button>
            <button
               onClick={() => setCurrentView(View.FAVORITES)}
               className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${currentView === View.FAVORITES ? 'bg-coffee-100 text-coffee-800' : 'text-coffee-600 hover:text-coffee-900 hover:bg-coffee-50'}`}
               title="Favorites"
            >
               <Heart size={16} className={currentView === View.FAVORITES ? "fill-coffee-600 text-coffee-600" : ""} /> 
               <span className="hidden sm:inline">Favorites</span>
            </button>
        </div>
      </div>
    </header>
  );
};

export default memo(Header);
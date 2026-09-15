import React, { useState } from 'react';
import { View, CoffeeProfile, Recipe, FavoriteItem, LatteArtPattern } from './types';
import { LATTE_ART_PATTERNS } from './constants';
import * as GeminiService from './services/geminiService';
import useLocalStorage from './hooks/useLocalStorage';
import { ensureApiKey } from './utils/auth';

// Components
import Header from './components/Header';
import HomeView from './components/views/HomeView';
import BrewGuideView from './components/views/BrewGuideView';
import TutorView from './components/views/TutorView';
import VideoStudioView from './components/views/VideoStudioView';
import RoastingView from './components/views/RoastingView';
import HistoryView from './components/views/HistoryView';
import FavoritesView from './components/views/FavoritesView';
import FlavorExplorerView from './components/views/FlavorExplorerView';
import LatteArtView from './components/views/LatteArtView';
import BeanSelector from './components/BeanSelector';
import RoastingDiagram from './components/RoastingDiagram'; // Keep RoastingDiagram if it's used in RoastingView inline, or extract RoastingView

// Lucide Icons
import { Sparkles, BookOpen, Loader2, Heart, Trash2, ArrowRight, Droplets, Palette, Calendar, ChevronLeft, Film, Play } from 'lucide-react';

// --- Main App Component ---

import { Printer } from 'lucide-react'; // Import Printer for inline components if needed

const App = () => {
  const [currentView, setCurrentView] = useState<View>(View.HOME);
  
  // Persistence Hooks
  const [savedItems, setSavedItems] = useLocalStorage<FavoriteItem[]>('barista-ai-favorites', []);
  const [historyItems, setHistoryItems] = useLocalStorage<Recipe[]>('barista-ai-history', []);

  // Shared State (Hoisted)
  const [profile, setProfile] = useState<CoffeeProfile>({
    origin: 'Ethiopia',
    roastLevel: 'Light',
    process: 'Washed',
    tastingNotes: []
  });

  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [originalRecipe, setOriginalRecipe] = useState<Recipe | null>(null);
  const [selectedLatteArtId, setSelectedLatteArtId] = useState<string | null>(null);

  // Global Handlers
  const addToHistory = (newRecipe: Recipe) => {
    const historyItem = { ...newRecipe, id: crypto.randomUUID(), dateSaved: Date.now() };
    const updatedHistory = [historyItem, ...historyItems].slice(0, 20);
    setHistoryItems(updatedHistory);
  };

  const handleClearHistory = () => {
    if (confirm('Are you sure you want to clear your brew history?')) {
      setHistoryItems([]);
    }
  };

  const handleSaveItem = (item: FavoriteItem) => {
    if (savedItems.some(r => r.id === item.id)) {
        handleDeleteItem(item.id!);
        return;
    }
    const id = item.id || Date.now().toString();
    const savedVersion = { ...item, id, dateSaved: Date.now() };
    setSavedItems([savedVersion, ...savedItems]);

    // Update current view reference if needed for immediate UI update
    if (item.type === 'recipe' && recipe && recipe.id === undefined) {
      setRecipe(savedVersion as Recipe);
      setOriginalRecipe(savedVersion as Recipe);
    }
  };

  const handleDeleteItem = (id: string, e?: React.MouseEvent) => {
      if (e) e.stopPropagation();
      setSavedItems(savedItems.filter(r => r.id !== id));
      
      // Update local state if currently viewing the deleted item
      if (recipe && recipe.id === id) {
          const { id: _, dateSaved: __, ...rest } = recipe;
          setRecipe({ ...rest, type: 'recipe' } as Recipe);
          if (originalRecipe) {
             const { id: _, dateSaved: __, ...origRest } = originalRecipe;
             setOriginalRecipe({ ...origRest, type: 'recipe' } as Recipe);
          }
      }
  };

  const handleLoadFavorite = (savedItem: FavoriteItem) => {
      if (savedItem.type === 'recipe') {
        setRecipe(savedItem);
        setOriginalRecipe(savedItem);
        setCurrentView(View.BREW_GUIDE);
      } else if (savedItem.type === 'latte_art') {
        setSelectedLatteArtId(savedItem.id);
        setCurrentView(View.LATTE_ART);
      }
  };

  const handleLoadHistoryItem = (historyItem: Recipe) => {
      setRecipe(historyItem);
      setOriginalRecipe(historyItem);
      setCurrentView(View.BREW_GUIDE);
  };

  return (
    <div className="min-h-screen pb-20 bg-coffee-50">
      <div className="no-print">
         <Header currentView={currentView} setCurrentView={setCurrentView} />
      </div>
      <main>
        {currentView === View.HOME && <HomeView setCurrentView={setCurrentView} />}
        
        {currentView === View.BREW_GUIDE && (
          <BrewGuideView 
            profile={profile}
            setProfile={setProfile}
            recipe={recipe}
            setRecipe={setRecipe}
            originalRecipe={originalRecipe}
            setOriginalRecipe={setOriginalRecipe}
            handleSaveItem={handleSaveItem}
            savedItems={savedItems}
            addToHistory={addToHistory}
            setCurrentView={setCurrentView}
          />
        )}
        
        {currentView === View.FLAVOR_EXPLORER && <FlavorExplorerView profile={profile} setProfile={setProfile} />}
        {currentView === View.TUTOR && <TutorView />}
        {currentView === View.VIDEO_STUDIO && <VideoStudioView />}
        {currentView === View.ROASTING && <RoastingView />}
        
        {currentView === View.LATTE_ART && (
            <LatteArtView 
                handleSaveItem={handleSaveItem} 
                savedItems={savedItems}
                selectedLatteArtId={selectedLatteArtId}
                setSelectedLatteArtId={setSelectedLatteArtId}
            />
        )}
        
        {currentView === View.FAVORITES && (
            <FavoritesView 
                savedItems={savedItems} 
                handleDeleteItem={handleDeleteItem} 
                handleLoadFavorite={handleLoadFavorite} 
            />
        )}
        
        {currentView === View.HISTORY && (
            <HistoryView 
                historyItems={historyItems} 
                handleClearHistory={handleClearHistory} 
                handleLoadHistoryItem={handleLoadHistoryItem} 
                setCurrentView={setCurrentView}
            />
        )}
      </main>
    </div>
  );
};

export default App;
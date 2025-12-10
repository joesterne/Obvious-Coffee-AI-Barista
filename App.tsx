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
import BeanSelector from './components/BeanSelector';
import RoastingDiagram from './components/RoastingDiagram'; // Keep RoastingDiagram if it's used in RoastingView inline, or extract RoastingView

// Lucide Icons
import { Sparkles, BookOpen, Loader2, Heart, Trash2, ArrowRight, Droplets, Palette, Calendar, ChevronLeft, Film, Play, Factory, Check, Flame, Globe } from 'lucide-react';

// --- Inline Views (For brevity in XML response, ideally these are also separate files) ---

const HistoryView: React.FC<{ 
  historyItems: Recipe[]; 
  handleClearHistory: () => void;
  handleLoadHistoryItem: (item: Recipe) => void;
  setCurrentView: (view: View) => void;
}> = ({ historyItems, handleClearHistory, handleLoadHistoryItem, setCurrentView }) => (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
           <h2 className="text-3xl font-brand font-bold text-coffee-950 uppercase tracking-wide">Brew History</h2>
           <p className="text-coffee-600">Your recent generations.</p>
        </div>
        {historyItems.length > 0 && (
           <button onClick={handleClearHistory} className="flex items-center gap-2 text-red-500 hover:text-red-700 text-sm font-medium">
              <Trash2 size={16} /> Clear History
           </button>
        )}
      </div>
      {historyItems.length === 0 ? (
          <div className="text-center py-20 bg-coffee-50/50 rounded-2xl border border-dashed border-coffee-200">
              <Droplets size={48} className="mx-auto text-coffee-300 mb-4" />
              <h3 className="text-xl font-medium text-coffee-800">No brewing history</h3>
              <p className="text-coffee-500 mb-6">Generated recipes will automatically appear here.</p>
              <button onClick={() => setCurrentView(View.BREW_GUIDE)} className="bg-coffee-600 text-white px-6 py-2 rounded-full font-bold hover:bg-coffee-700 transition-colors">
                  Generate a Recipe
              </button>
          </div>
      ) : (
          <div className="space-y-4">
              {historyItems.map((item) => (
                  <div key={item.id} className="bg-white p-4 rounded-xl shadow-sm border border-coffee-100 flex items-center justify-between hover:border-coffee-300 transition-all group">
                      <div className="flex items-center gap-4 overflow-hidden">
                          <div className="bg-coffee-50 p-3 rounded-lg text-coffee-600 flex-shrink-0"><Droplets size={20} /></div>
                          <div className="min-w-0">
                              <h3 className="font-brand font-bold text-coffee-900 uppercase truncate">{item.method}</h3>
                              <p className="text-xs text-coffee-500 truncate">{item.description}</p>
                              <div className="flex gap-3 mt-1 text-[10px] text-coffee-400 font-mono uppercase">
                                  <span>{new Date(item.dateSaved || 0).toLocaleString()}</span>
                                  <span>{item.coffeeAmount}g / {item.waterAmount}g</span>
                              </div>
                          </div>
                      </div>
                      <button onClick={() => handleLoadHistoryItem(item)} className="p-2 text-coffee-500 hover:text-coffee-800 hover:bg-coffee-50 rounded-full transition-colors">
                         <ArrowRight size={20} />
                      </button>
                  </div>
              ))}
          </div>
      )}
    </div>
);

const FavoritesView: React.FC<{
  savedItems: FavoriteItem[];
  handleDeleteItem: (id: string, e?: React.MouseEvent) => void;
  handleLoadFavorite: (item: FavoriteItem) => void;
}> = ({ savedItems, handleDeleteItem, handleLoadFavorite }) => (
    <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="mb-8">
            <h2 className="text-3xl font-brand font-bold text-coffee-950 uppercase tracking-wide">Your Favorite Brews & Guides</h2>
            <p className="text-coffee-600">Revisit your best cups and tutorials.</p>
        </div>
        {savedItems.length === 0 ? (
            <div className="text-center py-20 bg-coffee-50/50 rounded-2xl border border-dashed border-coffee-200">
                <Heart size={48} className="mx-auto text-coffee-300 mb-4" />
                <h3 className="text-xl font-medium text-coffee-800">No saved favorites yet</h3>
                <p className="text-coffee-500 mb-6">Create a recipe or browse latte art guides to save them.</p>
            </div>
        ) : (
            <div className="grid md:grid-cols-2 gap-6">
                {savedItems.map((saved) => {
                    const isRecipe = saved.type === 'recipe';
                    return (
                      <div key={saved.id} className="bg-white p-6 rounded-2xl shadow-sm border border-coffee-100 hover:shadow-md transition-all group relative">
                          <div className="flex justify-between items-start mb-4">
                              <div className="flex items-center gap-2">
                                  {isRecipe ? <Droplets size={16} className="text-coffee-400"/> : <Palette size={16} className="text-coffee-400"/>}
                                  <div>
                                      <h3 className="text-xl font-brand font-bold text-coffee-900 uppercase">{isRecipe ? (saved as Recipe).method : (saved as LatteArtPattern).name}</h3>
                                      <div className="text-xs font-mono text-coffee-500 mt-1 flex items-center gap-1">
                                          <Calendar size={12} />
                                          {saved.dateSaved ? new Date(saved.dateSaved).toLocaleDateString() : 'Unknown Date'}
                                      </div>
                                  </div>
                              </div>
                              <button onClick={(e) => handleDeleteItem(saved.id!, e)} className="p-2 text-coffee-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors">
                                  <Trash2 size={18} />
                              </button>
                          </div>
                          <p className="text-coffee-600 text-sm line-clamp-2 mb-4 h-10">{saved.description}</p>
                          <button onClick={() => handleLoadFavorite(saved)} className="w-full bg-coffee-50 text-coffee-800 py-2 rounded-lg font-medium hover:bg-coffee-100 flex items-center justify-center gap-2 group-hover:bg-coffee-600 group-hover:text-white transition-colors">
                              {isRecipe ? "Brew This Recipe" : "View Tutorial"} <ArrowRight size={16} />
                          </button>
                      </div>
                    );
                })}
            </div>
        )}
    </div>
);

const FlavorExplorerView: React.FC<{ profile: CoffeeProfile; setProfile: React.Dispatch<React.SetStateAction<CoffeeProfile>> }> = ({ profile, setProfile }) => {
    const [flavorExplanation, setFlavorExplanation] = useState<string | null>(null);
    const [isExplaining, setIsExplaining] = useState(false);

    const handleExplainFlavor = async () => {
        setIsExplaining(true);
        try {
          const text = await GeminiService.explainFlavorProfile(profile);
          setFlavorExplanation(text);
        } catch (e) {
          console.error(e);
        } finally {
          setIsExplaining(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-6 py-8">
            <div className="mb-6">
                <h2 className="text-3xl font-brand font-bold text-coffee-950 uppercase tracking-wide">Flavor Explorer</h2>
                <p className="text-coffee-600">Understand the chemistry of taste.</p>
            </div>
            <BeanSelector profile={profile} setProfile={setProfile} />
            <div className="flex justify-center mb-8">
                <button onClick={handleExplainFlavor} disabled={isExplaining} className="bg-coffee-600 text-white px-8 py-3 rounded-full font-bold shadow-lg hover:bg-coffee-700 hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
                {isExplaining ? <Loader2 className="animate-spin" /> : <Sparkles size={20} />} Analyze Profile
                </button>
            </div>
            {flavorExplanation && (
                <div className="bg-white rounded-2xl shadow-sm border border-coffee-100 p-8 animate-fade-in">
                    <h3 className="text-xl font-brand font-bold text-coffee-900 mb-4 flex items-center gap-2"><BookOpen size={24} className="text-coffee-500"/> Sensory Analysis</h3>
                    <div className="prose prose-coffee max-w-none text-coffee-700 leading-relaxed">
                        {flavorExplanation.split('\n').map((para, i) => <p key={i} className="mb-4">{para}</p>)}
                    </div>
                </div>
            )}
        </div>
    );
};

// ... Ideally RoastingView and LatteArtView are also external components, but due to length constraints they are simplified here or inline
const RoastingView = () => (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <div className="mb-10 text-center">
        <h2 className="text-3xl font-brand font-bold text-coffee-950 mb-2 uppercase tracking-wide">The Roast Masterclass</h2>
        <p className="text-coffee-600">Understand the journey from green seed to roasted bean.</p>
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-coffee-100 p-8 mb-8">
        <h3 className="text-xl font-bold text-coffee-800 mb-6 flex items-center gap-2"><Flame size={20} className="text-coffee-500" /> The Roasting Curve</h3>
        <p className="text-coffee-600 mb-6 leading-relaxed">Roasting is not just cooking; it is the calculated application of heat.</p>
        <div className="w-full mb-6 bg-coffee-50 rounded-xl p-4"><RoastingDiagram type="stages" /></div>
        <div className="grid md:grid-cols-3 gap-6 text-sm">
           <div><h4 className="font-bold text-coffee-800 mb-1">1. Drying Phase</h4><p className="text-coffee-500">Green to yellow. Moisture evaporates.</p></div>
           <div><h4 className="font-bold text-coffee-800 mb-1">2. Maillard Reaction</h4><p className="text-coffee-500">Sugars react. Browns develop.</p></div>
           <div><h4 className="font-bold text-coffee-800 mb-1">3. Development</h4><p className="text-coffee-500">Post crack. Flavor balance.</p></div>
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-8 mb-8">
         <div className="bg-white rounded-2xl shadow-sm border border-coffee-100 p-6 flex flex-col">
            <div className="flex items-center gap-3 mb-4"><div className="p-2 bg-coffee-100 rounded-lg text-coffee-800"><Factory size={20} /></div><h3 className="font-bold text-lg text-coffee-800">Drum Roasting</h3></div>
            <div className="h-40 w-full mb-4 bg-coffee-50 rounded-xl p-4"><RoastingDiagram type="drum" /></div>
            <div className="flex-1">
               <p className="text-coffee-600 text-sm mb-4"><strong>Mechanism:</strong> Conduction & Convection.</p>
               <ul className="space-y-2 text-sm text-coffee-500"><li className="flex items-start gap-2"><Check size={14} className="mt-1 text-coffee-400" /> Rich body</li></ul>
            </div>
         </div>
         <div className="bg-white rounded-2xl shadow-sm border border-coffee-100 p-6 flex flex-col">
            <div className="flex items-center gap-3 mb-4"><div className="p-2 bg-blue-100 rounded-lg text-blue-800"><Flame size={20} /></div><h3 className="font-bold text-lg text-coffee-800">Fluid Bed</h3></div>
            <div className="h-40 w-full mb-4 bg-coffee-50 rounded-xl p-4"><RoastingDiagram type="fluid_bed" /></div>
            <div className="flex-1">
               <p className="text-coffee-600 text-sm mb-4"><strong>Mechanism:</strong> Pure Convection.</p>
               <ul className="space-y-2 text-sm text-coffee-500"><li className="flex items-start gap-2"><Check size={14} className="mt-1 text-coffee-400" /> Bright acidity</li></ul>
            </div>
         </div>
      </div>
      <div className="bg-gradient-to-br from-coffee-800 to-coffee-900 rounded-2xl p-8 text-white">
         <div className="flex items-center gap-3 mb-6"><Globe size={24} className="text-coffee-200" /><h3 className="text-2xl font-brand font-bold uppercase">Nature vs. Nurture</h3></div>
         <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
               <h4 className="text-lg font-bold text-coffee-100 mb-2 border-b border-coffee-700 pb-2">Country of Origin (Nature)</h4>
               <p className="text-coffee-200 text-sm mb-4 leading-relaxed">DNA of the coffee. Potential flavors.</p>
            </div>
            <div>
               <h4 className="text-lg font-bold text-coffee-100 mb-2 border-b border-coffee-700 pb-2">Roast Profile (Nurture)</h4>
               <p className="text-coffee-200 text-sm mb-4 leading-relaxed">Expression of flavors.</p>
            </div>
         </div>
      </div>
    </div>
);

const LatteArtView: React.FC<{ 
    handleSaveItem: (item: FavoriteItem) => void; 
    savedItems: FavoriteItem[];
    selectedLatteArtId: string | null;
    setSelectedLatteArtId: (id: string | null) => void;
}> = ({ handleSaveItem, savedItems, selectedLatteArtId, setSelectedLatteArtId }) => {
    const [latteArtVideoUrl, setLatteArtVideoUrl] = useState<string | null>(null);
    const [isGeneratingLatteArt, setIsGeneratingLatteArt] = useState(false);
    const [latteArtFilter, setLatteArtFilter] = useState<'All' | 'Beginner' | 'Intermediate' | 'Advanced'>('All');

    const handleGenerateLatteArtVideo = async (pattern: LatteArtPattern) => {
        if (!(await ensureApiKey())) return;
        setIsGeneratingLatteArt(true);
        try {
            const url = await GeminiService.generateBrewVideo(null, pattern.videoPrompt);
            setLatteArtVideoUrl(url);
        } catch (e) {
            console.error(e);
            alert("Failed to generate latte art tutorial.");
        } finally {
            setIsGeneratingLatteArt(false);
        }
    };

    const activePattern = selectedLatteArtId ? LATTE_ART_PATTERNS.find(p => p.id === selectedLatteArtId) : null;
    const isSaved = activePattern && savedItems.some(i => i.id === activePattern.id);
    const filteredPatterns = LATTE_ART_PATTERNS.filter(p => latteArtFilter === 'All' || p.difficulty === latteArtFilter);

    if (activePattern) {
        return (
           <div className="max-w-4xl mx-auto px-6 py-8 animate-fade-in">
              <button onClick={() => { setSelectedLatteArtId(null); setLatteArtVideoUrl(null); }} className="flex items-center gap-2 text-coffee-500 hover:text-coffee-800 mb-4 transition-colors">
                 <ChevronLeft size={16} /> Back to patterns
              </button>
              <div className="bg-white rounded-2xl shadow-sm border border-coffee-100 overflow-hidden">
                 <div className="bg-coffee-800 text-white p-6 md:p-8 flex justify-between items-start">
                     <div>
                        <div className="flex items-center gap-3 mb-2">
                           <h3 className="text-3xl font-brand font-bold uppercase">{activePattern.name}</h3>
                           <span className="px-2 py-1 bg-white/10 rounded-lg text-xs font-medium backdrop-blur-sm border border-white/20">{activePattern.difficulty}</span>
                        </div>
                        <p className="text-coffee-200 text-lg leading-relaxed">{activePattern.description}</p>
                     </div>
                     <button onClick={() => handleSaveItem(activePattern)} className={`p-3 rounded-full transition-colors ${isSaved ? 'bg-white text-red-500' : 'bg-white/10 text-white hover:bg-white/20'}`}>
                        <Heart size={20} className={isSaved ? "fill-current" : ""} />
                     </button>
                 </div>
                 <div className="grid md:grid-cols-2">
                    <div className="p-6 md:p-8 border-b md:border-b-0 md:border-r border-coffee-100 bg-coffee-50/30">
                       <h4 className="font-bold text-coffee-800 uppercase tracking-widest text-xs mb-6 flex items-center gap-2"><BookOpen size={16} /> Step-by-Step Guide</h4>
                       <div className="space-y-6">
                          {activePattern.steps.map((step, idx) => (
                             <div key={idx} className="flex gap-4">
                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-coffee-100 text-coffee-600 flex items-center justify-center font-bold font-serif shadow-sm border border-coffee-200">{idx + 1}</div>
                                <p className="text-coffee-700 leading-relaxed pt-1">{step}</p>
                             </div>
                          ))}
                       </div>
                    </div>
                    <div className="p-6 md:p-8 flex flex-col">
                       <h4 className="font-bold text-coffee-800 uppercase tracking-widest text-xs mb-6 flex items-center gap-2"><Film size={16} /> Visual Demonstration</h4>
                       <div className="flex-1 bg-black rounded-xl overflow-hidden relative min-h-[250px] shadow-inner group">
                          {latteArtVideoUrl ? (
                             <video src={latteArtVideoUrl} controls autoPlay loop className="w-full h-full object-contain bg-black" />
                          ) : (
                             <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                                {isGeneratingLatteArt ? (
                                   <><Loader2 className="animate-spin text-coffee-400 mb-4" size={32} /><p className="text-white font-medium">Rendering tutorial...</p></>
                                ) : (
                                   <><Palette className="text-coffee-400 mb-4 opacity-80" size={40} /><p className="text-white font-medium mb-4">See this pattern in motion</p>
                                      <button onClick={() => handleGenerateLatteArtVideo(activePattern)} className="bg-white text-coffee-900 px-6 py-2 rounded-full font-bold text-sm hover:bg-coffee-100 transition-colors flex items-center gap-2">
                                        <Play size={14} fill="currentColor" /> Generate Tutorial
                                      </button>
                                   </>
                                )}
                             </div>
                          )}
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-6 py-8">
            <div className="mb-8">
                <h2 className="text-3xl font-brand font-bold text-coffee-950 uppercase tracking-wide">Latte Art Studio</h2>
                <p className="text-coffee-600">Master the pour.</p>
            </div>
            <div className="flex flex-wrap gap-2 mb-8 animate-fade-in">
                {(['All', 'Beginner', 'Intermediate', 'Advanced'] as const).map((filter) => (
                    <button key={filter} onClick={() => setLatteArtFilter(filter)} className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${latteArtFilter === filter ? 'bg-coffee-800 text-white shadow-md' : 'bg-white text-coffee-500 border border-coffee-200 hover:border-coffee-400 hover:text-coffee-700'}`}>{filter}</button>
                ))}
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
                {filteredPatterns.map(pattern => (
                  <button key={pattern.id} onClick={() => setSelectedLatteArtId(pattern.id)} className="bg-white p-6 rounded-2xl shadow-sm border border-coffee-100 hover:shadow-xl hover:border-coffee-300 transition-all text-left group">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-xl font-brand font-bold text-coffee-900 group-hover:text-coffee-600 transition-colors uppercase">{pattern.name}</h3>
                        <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider ${pattern.difficulty === 'Beginner' ? 'bg-green-100 text-green-700' : pattern.difficulty === 'Intermediate' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>{pattern.difficulty}</span>
                      </div>
                      <p className="text-coffee-600 text-sm mb-6 line-clamp-2">{pattern.description}</p>
                      <div className="flex items-center text-coffee-500 text-xs font-bold uppercase tracking-widest gap-2">Learn More <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" /></div>
                  </button>
                ))}
            </div>
        </div>
    );
};

// --- Main App Component ---

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
      <Header currentView={currentView} setCurrentView={setCurrentView} />
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
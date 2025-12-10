import React, { useState, useEffect, useRef } from 'react';
import { View, CoffeeProfile, Recipe, ChatMessage, FavoriteItem, LatteArtPattern } from './types';
import { BREW_METHODS, ORIGINS, TASTING_NOTES, LATTE_ART_PATTERNS } from './constants';
import * as GeminiService from './services/geminiService';
import BrewTimer from './components/BrewTimer';
import BrewMethodDiagram from './components/BrewMethodDiagram';
import RoastingDiagram from './components/RoastingDiagram';
import { Coffee, Wind, Droplets, Thermometer, Clock, MessageSquare, ChevronLeft, Send, Sparkles, BookOpen, Check, Sliders, Video, Film, Upload, Loader2, Play, Heart, Trash2, Calendar, ArrowRight, Scale, Flame, Globe, Factory, Info, X, FlaskConical, Palette, History as HistoryIcon, RotateCcw } from 'lucide-react';

// Icons for features
const FeatureCard = ({ icon: Icon, title, description, onClick }: { icon: any, title: string, description: string, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className="flex flex-col items-start p-6 bg-white border border-coffee-100 rounded-2xl shadow-sm hover:shadow-xl hover:border-coffee-300 transition-all duration-300 group text-left w-full h-full"
  >
    <div className="p-3 bg-coffee-50 rounded-xl text-coffee-600 mb-4 group-hover:bg-coffee-600 group-hover:text-white transition-colors">
      <Icon size={24} />
    </div>
    <h3 className="text-xl font-brand font-bold text-coffee-900 mb-2 uppercase tracking-wide">{title}</h3>
    <p className="text-coffee-600 text-sm leading-relaxed">{description}</p>
  </button>
);

const App = () => {
  const [currentView, setCurrentView] = useState<View>(View.HOME);
  const [profile, setProfile] = useState<CoffeeProfile>({
    origin: 'Ethiopia',
    roastLevel: 'Light',
    process: 'Washed',
    tastingNotes: []
  });
  
  // Recipe State
  const [selectedMethodId, setSelectedMethodId] = useState<string | null>(null);
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [originalRecipe, setOriginalRecipe] = useState<Recipe | null>(null);
  const [isLoadingRecipe, setIsLoadingRecipe] = useState(false);
  const [savedItems, setSavedItems] = useState<FavoriteItem[]>(() => {
    try {
      const saved = localStorage.getItem('barista-ai-favorites');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });
  const [historyItems, setHistoryItems] = useState<Recipe[]>(() => {
    try {
      const history = localStorage.getItem('barista-ai-history');
      return history ? JSON.parse(history) : [];
    } catch (e) {
      return [];
    }
  });

  // Recipe Video State (Brew Guide)
  const [recipeVideoUrl, setRecipeVideoUrl] = useState<string | null>(null);
  const [isGeneratingRecipeVideo, setIsGeneratingRecipeVideo] = useState(false);
  const [showRatioInfo, setShowRatioInfo] = useState(false);

  // Flavor Guide State
  const [flavorExplanation, setFlavorExplanation] = useState<string | null>(null);
  const [isExplaining, setIsExplaining] = useState(false);

  // Chat State
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isChatting, setIsChatting] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Video Studio State
  const [videoPrompt, setVideoPrompt] = useState('Cinematic close-up of coffee brewing, steam rising, warm lighting, 4k');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [selectedImagePreview, setSelectedImagePreview] = useState<string | null>(null);
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);
  const [videoLoadingMessage, setVideoLoadingMessage] = useState('Initializing Veo...');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Latte Art State
  const [selectedLatteArtId, setSelectedLatteArtId] = useState<string | null>(null);
  const [latteArtVideoUrl, setLatteArtVideoUrl] = useState<string | null>(null);
  const [isGeneratingLatteArt, setIsGeneratingLatteArt] = useState(false);


  // --- Handlers ---

  const handleProfileChange = (key: keyof CoffeeProfile, value: any) => {
    setProfile(prev => ({ ...prev, [key]: value }));
  };

  const toggleTastingNote = (note: string) => {
    setProfile(prev => {
      const notes = prev.tastingNotes.includes(note)
        ? prev.tastingNotes.filter(n => n !== note)
        : [...prev.tastingNotes, note];
      return { ...prev, tastingNotes: notes };
    });
  };

  const addToHistory = (newRecipe: Recipe) => {
    const historyItem = { ...newRecipe, id: crypto.randomUUID(), dateSaved: Date.now() };
    const updatedHistory = [historyItem, ...historyItems].slice(0, 20); // Keep last 20
    setHistoryItems(updatedHistory);
    localStorage.setItem('barista-ai-history', JSON.stringify(updatedHistory));
  };

  const handleClearHistory = () => {
    if (confirm('Are you sure you want to clear your brew history?')) {
      setHistoryItems([]);
      localStorage.removeItem('barista-ai-history');
    }
  };

  const handleGenerateRecipe = async (methodId: string) => {
    setSelectedMethodId(methodId);
    const method = BREW_METHODS.find(m => m.id === methodId);
    if (!method) return;

    setIsLoadingRecipe(true);
    setRecipe(null);
    setOriginalRecipe(null);
    setRecipeVideoUrl(null); // Reset specific recipe video
    setShowRatioInfo(false); // Reset ratio tooltip
    try {
      const result = await GeminiService.generateRecipe(method.name, profile, profile.tastingNotes);
      setRecipe(result);
      setOriginalRecipe(result);
      addToHistory(result);
    } catch (e) {
      console.error(e);
      alert("Failed to generate recipe. Please try again.");
    } finally {
      setIsLoadingRecipe(false);
    }
  };

  const handleSaveItem = (item: FavoriteItem) => {
    // Check if already saved
    if (savedItems.some(r => r.id === item.id)) {
        handleDeleteItem(item.id!);
        return;
    }

    const id = item.id || Date.now().toString();
    const savedVersion = { 
        ...item, 
        id, 
        dateSaved: Date.now() 
    };

    const updatedList = [savedVersion, ...savedItems];
    setSavedItems(updatedList);
    localStorage.setItem('barista-ai-favorites', JSON.stringify(updatedList));

    // Update current view reference if it matches (for immediate UI feedback)
    if (item.type === 'recipe' && recipe && recipe.id === undefined) {
      setRecipe(savedVersion as Recipe);
      setOriginalRecipe(savedVersion as Recipe);
    }
  };

  const handleDeleteItem = (id: string, e?: React.MouseEvent) => {
      if (e) e.stopPropagation();
      const updatedList = savedItems.filter(r => r.id !== id);
      setSavedItems(updatedList);
      localStorage.setItem('barista-ai-favorites', JSON.stringify(updatedList));
      
      // If currently viewing this recipe, remove the ID from the view so it shows as unsaved
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
        setShowRatioInfo(false);
        const method = BREW_METHODS.find(m => m.name.toLowerCase() === savedItem.method.toLowerCase() || savedItem.method.toLowerCase().includes(m.name.toLowerCase()));
        setSelectedMethodId(method ? method.id : 'v60'); 
        setCurrentView(View.BREW_GUIDE);
      } else if (savedItem.type === 'latte_art') {
        setSelectedLatteArtId(savedItem.id);
        setCurrentView(View.LATTE_ART);
      }
  };

  const handleLoadHistoryItem = (historyItem: Recipe) => {
      setRecipe(historyItem);
      setOriginalRecipe(historyItem);
      setShowRatioInfo(false);
      const method = BREW_METHODS.find(m => m.name.toLowerCase() === historyItem.method.toLowerCase() || historyItem.method.toLowerCase().includes(m.name.toLowerCase()));
      setSelectedMethodId(method ? method.id : 'v60');
      setCurrentView(View.BREW_GUIDE);
  };

  const handleTimeAdjustment = (newTotalSeconds: number) => {
    if (!originalRecipe) return;

    const originalTotal = originalRecipe.steps.reduce((acc, step) => acc + step.duration, 0);
    if (originalTotal === 0) return;

    const ratio = newTotalSeconds / originalTotal;
    
    let currentStartTime = 0;

    const newSteps = originalRecipe.steps.map((step) => {
      const originalEndTime = step.timeStart + step.duration;
      const newEndTime = Math.round(originalEndTime * ratio);
      const newDuration = Math.max(1, newEndTime - currentStartTime);
      
      const updatedStep = {
        ...step,
        timeStart: currentStartTime,
        duration: newDuration,
      };
      
      currentStartTime += newDuration;
      return updatedStep;
    });

    setRecipe({
      ...originalRecipe,
      steps: newSteps
    });
  };

  const checkApiKey = async () => {
    try {
      const hasKey = await (window as any).aistudio.hasSelectedApiKey();
      if (!hasKey) {
        return await (window as any).aistudio.openSelectKey();
      }
      return true;
    } catch (e) {
      console.error("API Key check failed", e);
      return false;
    }
  };

  const handleGenerateRecipeVideo = async () => {
    if (!recipe || !selectedMethodId) return;
    if (!(await checkApiKey())) return;

    setIsGeneratingRecipeVideo(true);
    try {
        const method = BREW_METHODS.find(m => m.id === selectedMethodId);
        const response = await fetch(method?.image || 'https://picsum.photos/400/300');
        const imageBlob = await response.blob();
        
        // Instructional prompt
        const stepsPreview = recipe.steps.slice(0, 3).map(s => s.action).join(', ');
        const prompt = `Instructional close-up video showing how to brew ${recipe.method}. Demonstrating key steps: ${stepsPreview}. Professional barista technique, 4k, detailed, photorealistic.`;
        
        const url = await GeminiService.generateBrewVideo(imageBlob, prompt);
        setRecipeVideoUrl(url);
    } catch (e) {
      console.error(e);
      alert("Failed to generate video preview.");
    } finally {
        setIsGeneratingRecipeVideo(false);
    }
  };

  const handleGenerateLatteArtVideo = async (pattern: LatteArtPattern) => {
    if (!(await checkApiKey())) return;

    setIsGeneratingLatteArt(true);
    try {
      // Use text-to-video if no image is desired, or pass a generic cup image.
      // For tutorial purposes, starting from scratch (text only) often yields clearer instructional results for Veo
      // unless we have a specific starting frame. Here we use Text-to-Video.
      const url = await GeminiService.generateBrewVideo(null, pattern.videoPrompt);
      setLatteArtVideoUrl(url);
    } catch (e) {
      console.error(e);
      alert("Failed to generate latte art tutorial.");
    } finally {
      setIsGeneratingLatteArt(false);
    }
  };

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

  const handleChatSend = async () => {
    if (!chatInput.trim()) return;
    const userMsg: ChatMessage = { role: 'user', content: chatInput, timestamp: Date.now() };
    setChatHistory(prev => [...prev, userMsg]);
    setChatInput('');
    setIsChatting(true);

    try {
      const apiHistory = chatHistory.map(m => ({ role: m.role, content: m.content }));
      apiHistory.push({ role: 'user', content: userMsg.content });
      const responseText = await GeminiService.getTutorResponse(apiHistory, userMsg.content);
      setChatHistory(prev => [...prev, { role: 'model', content: responseText, timestamp: Date.now() }]);
    } catch (e) {
      console.error(e);
    } finally {
      setIsChatting(false);
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (ev) => {
        setSelectedImagePreview(ev.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerateVideo = async () => {
    if (!selectedImage) {
      alert("Please upload an image first.");
      return;
    }
    if (!(await checkApiKey())) return;

    setIsGeneratingVideo(true);
    setGeneratedVideoUrl(null);
    setVideoLoadingMessage("Analyzing image composition...");
    
    const messages = [
      "Selecting the finest origin pixels...",
      "Heating up the neural boiler...",
      "Grinding the frame buffer...",
      "Pouring digital latte art...",
      "Polishing the portafilter...",
      "Almost ready to serve..."
    ];
    let msgIdx = 0;
    const interval = setInterval(() => {
      setVideoLoadingMessage(messages[msgIdx % messages.length]);
      msgIdx++;
    }, 4000);

    try {
      const url = await GeminiService.generateBrewVideo(selectedImage, videoPrompt);
      setGeneratedVideoUrl(url);
    } catch (e) {
      console.error(e);
      alert("Video generation failed. Please check your API key and try again.");
    } finally {
      clearInterval(interval);
      setIsGeneratingVideo(false);
    }
  };

  const navigateToVideoStudioWithRecipe = () => {
    if (recipe) {
      setVideoPrompt(`Cinematic close-up of brewing coffee using ${recipe.method}, hot water pouring over grounds, steam rising, high detail, photorealistic`);
    }
    setCurrentView(View.VIDEO_STUDIO);
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  const formatTime = (totalSeconds: number) => {
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };


  // --- Render Views ---

  const renderHeader = () => (
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

  const renderHome = () => (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="text-center mb-16 max-w-2xl mx-auto">
        <h1 className="text-5xl md:text-6xl font-brand font-bold text-coffee-950 mb-6 leading-tight uppercase">
          Master the Art of <span className="text-coffee-500 italic font-serif normal-case">Extraction</span>
        </h1>
        <p className="text-xl text-coffee-600 leading-relaxed">
          Your AI-powered sensory companion. Select your beans, explore brew methods, and uncover the science behind your perfect cup.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <FeatureCard 
          icon={Droplets}
          title="Brew Guides"
          description="Get precise, step-by-step recipes tailored to your specific beans and brew method."
          onClick={() => setCurrentView(View.BREW_GUIDE)}
        />
        <FeatureCard 
          icon={Sparkles}
          title="Flavor Explorer"
          description="Understand tasting notes and how origin + roast levels interact to create flavor."
          onClick={() => setCurrentView(View.FLAVOR_EXPLORER)}
        />
         <FeatureCard 
          icon={Palette}
          title="Latte Art"
          description="Master the pour. Text and video tutorials for hearts, tulips, and rosettas."
          onClick={() => setCurrentView(View.LATTE_ART)}
        />
        <FeatureCard 
          icon={Flame}
          title="Roast & Origin"
          description="Masterclass on roasting mechanics (Drum vs Fluid Bed) and the nature vs nurture of coffee."
          onClick={() => setCurrentView(View.ROASTING)}
        />
        <FeatureCard 
          icon={BookOpen}
          title="Barista Tutor"
          description="Chat with an expert AI to troubleshoot bitter coffee, learn theory, or get equipment advice."
          onClick={() => setCurrentView(View.TUTOR)}
        />
        <FeatureCard 
          icon={Film}
          title="AI Video Studio"
          description="Bring your coffee photos to life. Generate cinematic brewing videos from a single image using Veo."
          onClick={() => setCurrentView(View.VIDEO_STUDIO)}
        />
        <FeatureCard 
          icon={HistoryIcon}
          title="Brew History"
          description="Automatically save your generated recipes. Revisit your past brews."
          onClick={() => setCurrentView(View.HISTORY)}
        />
        <FeatureCard 
          icon={Heart}
          title="Your Favorites"
          description="Access your saved recipes. Revisit your perfect brews anytime."
          onClick={() => setCurrentView(View.FAVORITES)}
        />
      </div>
    </div>
  );

  const renderHistory = () => (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
           <h2 className="text-3xl font-brand font-bold text-coffee-950 uppercase tracking-wide">Brew History</h2>
           <p className="text-coffee-600">Your recent generations.</p>
        </div>
        {historyItems.length > 0 && (
           <button 
              onClick={handleClearHistory}
              className="flex items-center gap-2 text-red-500 hover:text-red-700 text-sm font-medium"
           >
              <Trash2 size={16} /> Clear History
           </button>
        )}
      </div>

      {historyItems.length === 0 ? (
          <div className="text-center py-20 bg-coffee-50/50 rounded-2xl border border-dashed border-coffee-200">
              <HistoryIcon size={48} className="mx-auto text-coffee-300 mb-4" />
              <h3 className="text-xl font-medium text-coffee-800">No brewing history</h3>
              <p className="text-coffee-500 mb-6">Generated recipes will automatically appear here.</p>
              <button 
                  onClick={() => setCurrentView(View.BREW_GUIDE)}
                  className="bg-coffee-600 text-white px-6 py-2 rounded-full font-bold hover:bg-coffee-700 transition-colors"
              >
                  Generate a Recipe
              </button>
          </div>
      ) : (
          <div className="space-y-4">
              {historyItems.map((item) => (
                  <div key={item.id} className="bg-white p-4 rounded-xl shadow-sm border border-coffee-100 flex items-center justify-between hover:border-coffee-300 transition-all group">
                      <div className="flex items-center gap-4 overflow-hidden">
                          <div className="bg-coffee-50 p-3 rounded-lg text-coffee-600 flex-shrink-0">
                              <Droplets size={20} />
                          </div>
                          <div className="min-w-0">
                              <h3 className="font-brand font-bold text-coffee-900 uppercase truncate">{item.method}</h3>
                              <p className="text-xs text-coffee-500 truncate">{item.description}</p>
                              <div className="flex gap-3 mt-1 text-[10px] text-coffee-400 font-mono uppercase">
                                  <span>{new Date(item.dateSaved || 0).toLocaleString()}</span>
                                  <span>{item.coffeeAmount}g / {item.waterAmount}g</span>
                              </div>
                          </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                         <button 
                            onClick={() => handleLoadHistoryItem(item)}
                            className="p-2 text-coffee-500 hover:text-coffee-800 hover:bg-coffee-50 rounded-full transition-colors"
                            title="Load Recipe"
                         >
                            <ArrowRight size={20} />
                         </button>
                      </div>
                  </div>
              ))}
          </div>
      )}
    </div>
  );

  const renderFavorites = () => (
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
                              <button 
                                  onClick={(e) => handleDeleteItem(saved.id!, e)}
                                  className="p-2 text-coffee-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                                  title="Remove from favorites"
                              >
                                  <Trash2 size={18} />
                              </button>
                          </div>
                          
                          <p className="text-coffee-600 text-sm line-clamp-2 mb-4 h-10">{saved.description}</p>
                          
                          {isRecipe && (
                            <div className="flex gap-4 mb-6">
                                <div className="text-center">
                                    <div className="text-coffee-800 font-bold">{(saved as Recipe).coffeeAmount}g</div>
                                    <div className="text-[10px] uppercase text-coffee-400">Coffee</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-coffee-800 font-bold">{(saved as Recipe).waterAmount}g</div>
                                    <div className="text-[10px] uppercase text-coffee-400">Water</div>
                                </div>
                            </div>
                          )}

                          <button 
                              onClick={() => handleLoadFavorite(saved)}
                              className="w-full bg-coffee-50 text-coffee-800 py-2 rounded-lg font-medium hover:bg-coffee-100 flex items-center justify-center gap-2 group-hover:bg-coffee-600 group-hover:text-white transition-colors"
                          >
                              {isRecipe ? "Brew This Recipe" : "View Tutorial"} <ArrowRight size={16} />
                          </button>
                      </div>
                    );
                })}
            </div>
        )}
      </div>
  );

  const renderLatteArt = () => {
    const activePattern = selectedLatteArtId ? LATTE_ART_PATTERNS.find(p => p.id === selectedLatteArtId) : null;
    const isSaved = activePattern && savedItems.some(i => i.id === activePattern.id);

    return (
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="mb-8">
           <h2 className="text-3xl font-brand font-bold text-coffee-950 uppercase tracking-wide">Latte Art Studio</h2>
           <p className="text-coffee-600">Master the pour with visual guides.</p>
        </div>

        {activePattern ? (
           <div className="animate-fade-in">
              <button 
                 onClick={() => { setSelectedLatteArtId(null); setLatteArtVideoUrl(null); }}
                 className="flex items-center gap-2 text-coffee-500 hover:text-coffee-800 mb-4 transition-colors"
              >
                 <ChevronLeft size={16} /> Back to patterns
              </button>

              <div className="bg-white rounded-2xl shadow-sm border border-coffee-100 overflow-hidden">
                 {/* Header */}
                 <div className="bg-coffee-800 text-white p-6 md:p-8 flex justify-between items-start">
                     <div>
                        <div className="flex items-center gap-3 mb-2">
                           <h3 className="text-3xl font-brand font-bold uppercase">{activePattern.name}</h3>
                           <span className="px-2 py-1 bg-white/10 rounded-lg text-xs font-medium backdrop-blur-sm border border-white/20">
                              {activePattern.difficulty}
                           </span>
                        </div>
                        <p className="text-coffee-200 text-lg leading-relaxed">{activePattern.description}</p>
                     </div>
                     <button 
                        onClick={() => handleSaveItem(activePattern)}
                        className={`p-3 rounded-full transition-colors ${isSaved ? 'bg-white text-red-500' : 'bg-white/10 text-white hover:bg-white/20'}`}
                     >
                        <Heart size={20} className={isSaved ? "fill-current" : ""} />
                     </button>
                 </div>

                 <div className="grid md:grid-cols-2">
                    {/* Steps Column */}
                    <div className="p-6 md:p-8 border-b md:border-b-0 md:border-r border-coffee-100 bg-coffee-50/30">
                       <h4 className="font-bold text-coffee-800 uppercase tracking-widest text-xs mb-6 flex items-center gap-2">
                          <BookOpen size={16} /> Step-by-Step Guide
                       </h4>
                       <div className="space-y-6">
                          {activePattern.steps.map((step, idx) => (
                             <div key={idx} className="flex gap-4">
                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-coffee-100 text-coffee-600 flex items-center justify-center font-bold font-serif shadow-sm border border-coffee-200">
                                   {idx + 1}
                                </div>
                                <p className="text-coffee-700 leading-relaxed pt-1">{step}</p>
                             </div>
                          ))}
                       </div>
                    </div>

                    {/* Visual Column */}
                    <div className="p-6 md:p-8 flex flex-col">
                       <h4 className="font-bold text-coffee-800 uppercase tracking-widest text-xs mb-6 flex items-center gap-2">
                          <Film size={16} /> Visual Demonstration
                       </h4>
                       
                       <div className="flex-1 bg-black rounded-xl overflow-hidden relative min-h-[250px] shadow-inner group">
                          {latteArtVideoUrl ? (
                             <video 
                               src={latteArtVideoUrl}
                               controls
                               autoPlay
                               loop
                               className="w-full h-full object-contain bg-black"
                             />
                          ) : (
                             <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                                {isGeneratingLatteArt ? (
                                   <>
                                      <Loader2 className="animate-spin text-coffee-400 mb-4" size={32} />
                                      <p className="text-white font-medium">Rendering tutorial...</p>
                                      <p className="text-white/50 text-xs mt-1">Generating AI video with Veo</p>
                                   </>
                                ) : (
                                   <>
                                      <Palette className="text-coffee-400 mb-4 opacity-80" size={40} />
                                      <p className="text-white font-medium mb-4">See this pattern in motion</p>
                                      <button 
                                        onClick={() => handleGenerateLatteArtVideo(activePattern)}
                                        className="bg-white text-coffee-900 px-6 py-2 rounded-full font-bold text-sm hover:bg-coffee-100 transition-colors flex items-center gap-2"
                                      >
                                        <Play size={14} fill="currentColor" /> Generate Tutorial
                                      </button>
                                      <p className="text-white/30 text-[10px] mt-4">*Powered by Veo Generative Video</p>
                                   </>
                                )}
                             </div>
                          )}
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {LATTE_ART_PATTERNS.map(pattern => (
               <button 
                  key={pattern.id}
                  onClick={() => setSelectedLatteArtId(pattern.id)}
                  className="bg-white p-6 rounded-2xl shadow-sm border border-coffee-100 hover:shadow-xl hover:border-coffee-300 transition-all text-left group"
               >
                  <div className="flex justify-between items-start mb-4">
                     <h3 className="text-xl font-brand font-bold text-coffee-900 group-hover:text-coffee-600 transition-colors uppercase">{pattern.name}</h3>
                     <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider ${
                        pattern.difficulty === 'Beginner' ? 'bg-green-100 text-green-700' :
                        pattern.difficulty === 'Intermediate' ? 'bg-amber-100 text-amber-700' :
                        'bg-red-100 text-red-700'
                     }`}>
                        {pattern.difficulty}
                     </span>
                  </div>
                  <p className="text-coffee-600 text-sm mb-6 line-clamp-2">{pattern.description}</p>
                  <div className="flex items-center text-coffee-500 text-xs font-bold uppercase tracking-widest gap-2">
                     Learn More <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </div>
               </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderRoasting = () => (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <div className="mb-10 text-center">
        <h2 className="text-3xl font-brand font-bold text-coffee-950 mb-2 uppercase tracking-wide">The Roast Masterclass</h2>
        <p className="text-coffee-600">Understand the journey from green seed to roasted bean.</p>
      </div>

      {/* Section 1: How to Roast (Stages) */}
      <div className="bg-white rounded-2xl shadow-sm border border-coffee-100 p-8 mb-8">
        <h3 className="text-xl font-bold text-coffee-800 mb-6 flex items-center gap-2">
          <Flame size={20} className="text-coffee-500" />
          The Roasting Curve
        </h3>
        <p className="text-coffee-600 mb-6 leading-relaxed">
          Roasting is not just cooking; it is the calculated application of heat to transform the chemical structure of the bean. 
          A typical roast follows an "S-curve" temperature profile.
        </p>
        <div className="w-full mb-6 bg-coffee-50 rounded-xl p-4">
           <RoastingDiagram type="stages" />
        </div>
        <div className="grid md:grid-cols-3 gap-6 text-sm">
           <div>
              <h4 className="font-bold text-coffee-800 mb-1">1. Drying Phase</h4>
              <p className="text-coffee-500">Beans turn from green to yellow as moisture evaporates. Smells like wet grass or hay.</p>
           </div>
           <div>
              <h4 className="font-bold text-coffee-800 mb-1">2. Maillard Reaction</h4>
              <p className="text-coffee-500">Sugars and amino acids react. Beans turn brown, developing complex aromas like toast and nuts.</p>
           </div>
           <div>
              <h4 className="font-bold text-coffee-800 mb-1">3. Development</h4>
              <p className="text-coffee-500">After "First Crack" (an audible pop), acidity balances with body. The roast is stopped here for light/medium, or continued for dark.</p>
           </div>
        </div>
      </div>

      {/* Section 2: Drum vs Fluid Bed */}
      <div className="grid md:grid-cols-2 gap-8 mb-8">
         <div className="bg-white rounded-2xl shadow-sm border border-coffee-100 p-6 flex flex-col">
            <div className="flex items-center gap-3 mb-4">
               <div className="p-2 bg-coffee-100 rounded-lg text-coffee-800"><Factory size={20} /></div>
               <h3 className="font-bold text-lg text-coffee-800">Drum Roasting</h3>
            </div>
            <div className="h-40 w-full mb-4 bg-coffee-50 rounded-xl p-4">
               <RoastingDiagram type="drum" />
            </div>
            <div className="flex-1">
               <p className="text-coffee-600 text-sm mb-4">
                  <strong>Mechanism:</strong> Beans tumble in a rotating metal drum heated from below. Heat is transferred via conduction (contact) and convection.
               </p>
               <ul className="space-y-2 text-sm text-coffee-500">
                  <li className="flex items-start gap-2"><Check size={14} className="mt-1 text-coffee-400" /> Slower roast (10-15 mins)</li>
                  <li className="flex items-start gap-2"><Check size={14} className="mt-1 text-coffee-400" /> Develops rich body & mouthfeel</li>
                  <li className="flex items-start gap-2"><Check size={14} className="mt-1 text-coffee-400" /> Classic "Barista" flavor profile</li>
               </ul>
            </div>
         </div>

         <div className="bg-white rounded-2xl shadow-sm border border-coffee-100 p-6 flex flex-col">
            <div className="flex items-center gap-3 mb-4">
               <div className="p-2 bg-blue-100 rounded-lg text-blue-800"><Wind size={20} /></div>
               <h3 className="font-bold text-lg text-coffee-800">Fluid Bed (Air) Roasting</h3>
            </div>
            <div className="h-40 w-full mb-4 bg-coffee-50 rounded-xl p-4">
               <RoastingDiagram type="fluid_bed" />
            </div>
            <div className="flex-1">
               <p className="text-coffee-600 text-sm mb-4">
                  <strong>Mechanism:</strong> Hot air is blasted upwards, levitating the beans. Heat is transferred almost entirely via convection.
               </p>
               <ul className="space-y-2 text-sm text-coffee-500">
                  <li className="flex items-start gap-2"><Check size={14} className="mt-1 text-coffee-400" /> Faster roast (5-8 mins)</li>
                  <li className="flex items-start gap-2"><Check size={14} className="mt-1 text-coffee-400" /> Highlights acidity & brightness</li>
                  <li className="flex items-start gap-2"><Check size={14} className="mt-1 text-coffee-400" /> Very clean, distinct flavors</li>
               </ul>
            </div>
         </div>
      </div>

      {/* Section 3: Origin vs Flavor */}
      <div className="bg-gradient-to-br from-coffee-800 to-coffee-900 rounded-2xl p-8 text-white">
         <div className="flex items-center gap-3 mb-6">
            <Globe size={24} className="text-coffee-200" />
            <h3 className="text-2xl font-brand font-bold uppercase">Nature vs. Nurture</h3>
         </div>
         
         <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
               <h4 className="text-lg font-bold text-coffee-100 mb-2 border-b border-coffee-700 pb-2">Country of Origin (Nature)</h4>
               <p className="text-coffee-200 text-sm mb-4 leading-relaxed">
                  This is the DNA of the coffee. The soil, altitude, and variety determine the <strong>potential</strong> flavors available.
               </p>
               <ul className="space-y-3 text-sm">
                  <li className="flex gap-2">
                     <span className="font-bold text-amber-200 w-24">Ethiopia</span>
                     <span className="text-white/80">Floral, tea-like, berry (Heirloom varieties)</span>
                  </li>
                  <li className="flex gap-2">
                     <span className="font-bold text-amber-200 w-24">Colombia</span>
                     <span className="text-white/80">Caramel, nutty, balanced acidity</span>
                  </li>
                  <li className="flex gap-2">
                     <span className="font-bold text-amber-200 w-24">Indonesia</span>
                     <span className="text-white/80">Earthy, spicy, heavy body (Volcanic soil)</span>
                  </li>
               </ul>
            </div>

            <div className="relative">
               <div className="absolute left-[-20px] top-1/2 -translate-y-1/2 hidden md:block">
                  <ArrowRight size={24} className="text-coffee-500" />
               </div>
               <h4 className="text-lg font-bold text-coffee-100 mb-2 border-b border-coffee-700 pb-2">Roast Profile (Nurture)</h4>
               <p className="text-coffee-200 text-sm mb-4 leading-relaxed">
                  Roasting decides which of those potential flavors are <strong>expressed</strong> or masked.
               </p>
               <ul className="space-y-3 text-sm">
                  <li className="flex gap-2">
                     <span className="font-bold text-orange-200 w-20">Light</span>
                     <span className="text-white/80">Preserves "Origin Character" (Enzymatic flavors)</span>
                  </li>
                  <li className="flex gap-2">
                     <span className="font-bold text-orange-200 w-20">Medium</span>
                     <span className="text-white/80">Balances origin acidity with roasting sweetness</span>
                  </li>
                  <li className="flex gap-2">
                     <span className="font-bold text-orange-200 w-20">Dark</span>
                     <span className="text-white/80">Overtakes origin with "Roast Flavor" (Carbon, Smoke)</span>
                  </li>
               </ul>
            </div>
         </div>
         
         <div className="mt-6 bg-white/10 p-4 rounded-xl text-center text-sm text-coffee-100 italic">
            "You cannot roast a flavor into a bean that isn't there, but you can certainly roast it out."
         </div>
      </div>
    </div>
  );

  const renderBeanSelector = () => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-coffee-100 mb-8">
      <h3 className="text-lg font-bold text-coffee-800 mb-4 flex items-center gap-2">
        <Coffee size={20} /> Your Beans
      </h3>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div>
          <label className="block text-xs font-semibold text-coffee-500 uppercase tracking-wide mb-2">Origin</label>
          <select 
            className="w-full p-2 bg-coffee-50 border border-coffee-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-coffee-400 text-coffee-800"
            value={profile.origin}
            onChange={(e) => handleProfileChange('origin', e.target.value)}
          >
            {ORIGINS.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-coffee-500 uppercase tracking-wide mb-2">Process</label>
          <select 
            className="w-full p-2 bg-coffee-50 border border-coffee-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-coffee-400 text-coffee-800"
            value={profile.process}
            onChange={(e) => handleProfileChange('process', e.target.value)}
          >
             {['Washed', 'Natural', 'Honey', 'Experimental'].map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>

        <div className="lg:col-span-2">
          <label className="block text-xs font-semibold text-coffee-500 uppercase tracking-wide mb-2">Roast Level</label>
          <div className="flex bg-coffee-50 rounded-lg p-1 border border-coffee-200">
            {['Light', 'Medium', 'Dark'].map((level) => (
              <button
                key={level}
                onClick={() => handleProfileChange('roastLevel', level)}
                className={`flex-1 text-sm py-1.5 rounded-md font-medium transition-colors ${profile.roastLevel === level ? 'bg-white text-coffee-900 shadow-sm' : 'text-coffee-500 hover:text-coffee-700'}`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        <div className="md:col-span-2 lg:col-span-4">
            <label className="block text-xs font-semibold text-coffee-500 uppercase tracking-wide mb-2">
              Tasting Notes <span className="text-coffee-400 normal-case tracking-normal font-normal ml-1">(Select multiple)</span>
            </label>
            <div className="flex flex-wrap gap-2">
                {TASTING_NOTES.map(note => {
                    const isSelected = profile.tastingNotes.includes(note);
                    return (
                        <button
                            key={note}
                            onClick={() => toggleTastingNote(note)}
                            className={`text-xs px-3 py-1.5 rounded-full border transition-all flex items-center gap-1.5 ${
                                isSelected 
                                ? 'bg-coffee-600 border-coffee-600 text-white shadow-sm' 
                                : 'bg-white border-coffee-200 text-coffee-600 hover:border-coffee-400'
                            }`}
                        >
                            {note}
                            {isSelected && <Check size={12} strokeWidth={3} />}
                        </button>
                    );
                })}
            </div>
        </div>
      </div>
    </div>
  );

  const renderTemperatureInfo = () => (
    <div className="bg-gradient-to-br from-coffee-50 to-white rounded-2xl p-6 border border-coffee-100 mb-8 shadow-sm">
       <div className="flex items-start gap-4 mb-4">
          <div className="p-3 bg-white rounded-full shadow-sm text-coffee-600">
             <Thermometer size={24} />
          </div>
          <div>
            <h3 className="text-lg font-brand font-bold text-coffee-950 uppercase">Temperature & Roast Science</h3>
            <p className="text-coffee-600 text-sm">Water temperature dictates the rate of chemical extraction. Match heat to bean density.</p>
          </div>
       </div>

      <div className="grid md:grid-cols-3 gap-4">
        {/* Light */}
        <div className="relative group p-4 bg-white rounded-xl border border-coffee-100 hover:border-coffee-300 transition-all">
          <div className="absolute top-0 left-0 w-full h-1 bg-amber-200 rounded-t-xl"></div>
          <div className="flex justify-between items-baseline mb-2">
             <span className="font-bold text-coffee-800">Light Roast</span>
             <span className="font-mono font-bold text-coffee-600">93°-99°C</span>
          </div>
          <p className="text-xs text-coffee-500 leading-relaxed">
             Light roasts preserve the bean's original cellular structure, making them denser and harder to extract. High temperatures are essential to penetrate the cell walls and dissolve the desirable acidic and floral compounds.
          </p>
        </div>

        {/* Medium */}
        <div className="relative group p-4 bg-white rounded-xl border border-coffee-100 hover:border-coffee-300 transition-all">
          <div className="absolute top-0 left-0 w-full h-1 bg-coffee-400 rounded-t-xl"></div>
          <div className="flex justify-between items-baseline mb-2">
             <span className="font-bold text-coffee-800">Medium Roast</span>
             <span className="font-mono font-bold text-coffee-600">90°-96°C</span>
          </div>
          <p className="text-xs text-coffee-500 leading-relaxed">
             The extraction "sweet spot". The roasting process has degraded some cellulose, making the bean more porous. Moderate heat balances acidity with the caramelization sugars developed during roasting.
          </p>
        </div>

        {/* Dark */}
        <div className="relative group p-4 bg-white rounded-xl border border-coffee-100 hover:border-coffee-300 transition-all">
           <div className="absolute top-0 left-0 w-full h-1 bg-coffee-800 rounded-t-xl"></div>
           <div className="flex justify-between items-baseline mb-2">
             <span className="font-bold text-coffee-800">Dark Roast</span>
             <span className="font-mono font-bold text-coffee-600">80°-88°C</span>
          </div>
          <p className="text-xs text-coffee-500 leading-relaxed">
             Dark beans are highly porous and soluble due to extensive structural breakdown. Lower temperatures are critical to slow down extraction and prevent pulling out harsh, dry, and ashy flavors (pyrolysis byproducts).
          </p>
        </div>
      </div>
    </div>
  );

  const renderOriginInfo = () => (
    <div className="bg-white rounded-2xl p-6 border border-coffee-100 mb-8 shadow-sm">
       <div className="flex items-start gap-4 mb-6">
          <div className="p-3 bg-coffee-50 rounded-full text-coffee-600">
             <Globe size={24} />
          </div>
          <div>
            <h3 className="text-lg font-brand font-bold text-coffee-950 uppercase">Origin & Terroir Guide</h3>
            <p className="text-coffee-600 text-sm">How geography and climate shape the flavor in your cup.</p>
          </div>
       </div>

       <div className="grid md:grid-cols-3 gap-8 divide-y md:divide-y-0 md:divide-x divide-coffee-100">
          <div className="pt-4 md:pt-0">
             <h4 className="font-bold text-coffee-800 mb-1 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-purple-400"></span> East Africa
             </h4>
             <p className="text-[10px] uppercase font-bold text-coffee-400 mb-3">Ethiopia • Kenya • Rwanda</p>
             <p className="text-sm text-coffee-600 mb-3">
                <strong className="text-coffee-800">The Science:</strong> Extreme altitudes (1500m+) and cooler temperatures slow cherry maturation, allowing complex sugars and citric/malic acids to develop.
             </p>
             <div className="flex flex-wrap gap-1">
                <span className="text-[10px] px-2 py-1 bg-purple-50 text-purple-700 rounded-full font-medium">Floral</span>
                <span className="text-[10px] px-2 py-1 bg-purple-50 text-purple-700 rounded-full font-medium">Berry</span>
                <span className="text-[10px] px-2 py-1 bg-purple-50 text-purple-700 rounded-full font-medium">Bright Acidity</span>
             </div>
          </div>

          <div className="pt-4 md:pt-0 md:pl-6">
             <h4 className="font-bold text-coffee-800 mb-1 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-400"></span> Latin America
             </h4>
             <p className="text-[10px] uppercase font-bold text-coffee-400 mb-3">Colombia • Guatemala • Brazil</p>
             <p className="text-sm text-coffee-600 mb-3">
                <strong className="text-coffee-800">The Science:</strong> Diverse microclimates. Volcanic loam soil provides essential nutrients. Brazil's lower flatlands (lower acidity) contrast with Colombia's peaks (sweetness).
             </p>
             <div className="flex flex-wrap gap-1">
                <span className="text-[10px] px-2 py-1 bg-amber-50 text-amber-700 rounded-full font-medium">Chocolate</span>
                <span className="text-[10px] px-2 py-1 bg-amber-50 text-amber-700 rounded-full font-medium">Caramel</span>
                <span className="text-[10px] px-2 py-1 bg-amber-50 text-amber-700 rounded-full font-medium">Nutty</span>
             </div>
          </div>

          <div className="pt-4 md:pt-0 md:pl-6">
             <h4 className="font-bold text-coffee-800 mb-1 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-600"></span> Asia Pacific
             </h4>
             <p className="text-[10px] uppercase font-bold text-coffee-400 mb-3">Sumatra • Java • Vietnam</p>
             <p className="text-sm text-coffee-600 mb-3">
                <strong className="text-coffee-800">The Science:</strong> Humid climate necessitates "Giling Basah" (wet-hulling) processing. This exposure to moisture reduces acidity and builds heavy body and savory notes.
             </p>
             <div className="flex flex-wrap gap-1">
                <span className="text-[10px] px-2 py-1 bg-emerald-50 text-emerald-700 rounded-full font-medium">Earthy</span>
                <span className="text-[10px] px-2 py-1 bg-emerald-50 text-emerald-700 rounded-full font-medium">Spicy</span>
                <span className="text-[10px] px-2 py-1 bg-emerald-50 text-emerald-700 rounded-full font-medium">Heavy Body</span>
             </div>
          </div>
       </div>
    </div>
  );

  const renderBrewGuide = () => {
    // Calculate total time for the current recipe state
    const totalDuration = recipe ? recipe.steps.reduce((acc, step) => acc + step.duration, 0) : 0;
    const isRecipeSaved = recipe && recipe.id && savedItems.some(r => r.id === recipe.id);
    
    return (
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="mb-6">
          <h2 className="text-3xl font-brand font-bold text-coffee-950 uppercase tracking-wide">Brew Guide</h2>
          <p className="text-coffee-600">Tailored recipes for your beans.</p>
        </div>
        
        {renderBeanSelector()}
        
        {!recipe && !isLoadingRecipe && renderTemperatureInfo()}
        {!recipe && !isLoadingRecipe && renderOriginInfo()}

        {!recipe && !isLoadingRecipe && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {BREW_METHODS.map(method => (
              <button
                key={method.id}
                onClick={() => handleGenerateRecipe(method.id)}
                className="group relative overflow-hidden rounded-xl aspect-square md:aspect-[4/3] bg-coffee-100 hover:shadow-lg transition-all"
              >
                <img src={method.image} alt={method.name} className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" />
                
                <div className="absolute top-3 right-3 z-10">
                  <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider backdrop-blur-md ${
                    method.difficulty === 'Easy' ? 'bg-green-100/90 text-green-800' :
                    method.difficulty === 'Medium' ? 'bg-amber-100/90 text-amber-800' :
                    'bg-red-100/90 text-red-800'
                  }`}>
                    {method.difficulty}
                  </span>
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-4 flex flex-col justify-end text-left">
                  <h3 className="text-white font-bold text-lg font-brand uppercase">{method.name}</h3>
                  <p className="text-white/80 text-xs">{method.body} Body</p>
                </div>
              </button>
            ))}
          </div>
        )}

        {isLoadingRecipe && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
             <div className="w-16 h-16 border-4 border-coffee-200 border-t-coffee-600 rounded-full animate-spin mb-6"></div>
             <h3 className="text-xl font-medium text-coffee-800 font-brand uppercase">Dialing in your recipe...</h3>
             <p className="text-coffee-500 max-w-sm mt-2">Analyzing bean density, roast solubility, and extraction targets for {profile.origin} {profile.roastLevel} roast.</p>
          </div>
        )}

        {recipe && !isLoadingRecipe && (
          <div className="animate-fade-in-up">
             <div className="flex justify-between items-center mb-4">
                 <button onClick={() => { setRecipe(null); setOriginalRecipe(null); setRecipeVideoUrl(null); }} className="text-sm text-coffee-500 hover:text-coffee-800 underline">Choose a different method</button>
                 <div className="flex gap-2">
                    <button 
                        onClick={() => handleSaveItem({ ...recipe, type: 'recipe' })}
                        className={`flex items-center gap-2 text-sm px-3 py-1.5 rounded-full transition-colors font-medium border ${
                            isRecipeSaved 
                            ? 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100' 
                            : 'bg-white text-coffee-600 border-coffee-200 hover:bg-coffee-50'
                        }`}
                        title={isRecipeSaved ? "Remove from Favorites" : "Save to Favorites"}
                    >
                        <Heart size={14} className={isRecipeSaved ? "fill-current" : ""} /> 
                        {isRecipeSaved ? 'Saved' : 'Save'}
                    </button>
                    <button 
                        onClick={navigateToVideoStudioWithRecipe}
                        className="flex items-center gap-2 text-sm bg-coffee-100 hover:bg-coffee-200 text-coffee-800 px-3 py-1.5 rounded-full transition-colors font-medium"
                    >
                        <Film size={14} /> Open Video Studio
                    </button>
                 </div>
             </div>
             
             <div className="bg-white rounded-2xl shadow-sm border border-coffee-200 overflow-hidden mb-8">
                <div className="bg-coffee-800 text-white p-6 md:p-8">
                    <h2 className="text-3xl font-brand font-bold mb-2 uppercase">{recipe.method} for {profile.origin}</h2>
                    <p className="text-coffee-200 text-lg leading-relaxed max-w-3xl">{recipe.description}</p>
                </div>

                {/* Recipe Overview Header */}
                <div className="border-b border-coffee-100 bg-coffee-50/30 px-6 py-2">
                   <h3 className="text-xs font-bold text-coffee-400 uppercase tracking-widest flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-coffee-400"></span>
                      Recipe Overview
                   </h3>
                </div>

                {/* Recipe Overview - Clean Grid Layout */}
                <div className="grid grid-cols-2 md:grid-cols-4 border-b border-coffee-100 divide-x divide-coffee-100/50 bg-white">
                    <div className="p-6 text-center group hover:bg-coffee-50 transition-colors">
                        <div className="flex justify-center text-coffee-400 mb-2 group-hover:scale-110 transition-transform"><Coffee size={24} /></div>
                        <div className="text-2xl font-serif font-bold text-coffee-800">{recipe.coffeeAmount}g</div>
                        <div className="text-xs uppercase font-bold text-coffee-400 tracking-wider">Coffee</div>
                    </div>
                    <div className="p-6 text-center group hover:bg-coffee-50 transition-colors">
                        <div className="flex justify-center text-coffee-400 mb-2 group-hover:scale-110 transition-transform"><Droplets size={24} /></div>
                        <div className="text-2xl font-serif font-bold text-coffee-800">{recipe.waterAmount}g</div>
                        <div className="text-xs uppercase font-bold text-coffee-400 tracking-wider">Water</div>
                    </div>
                    <div className="p-6 text-center group hover:bg-coffee-50 transition-colors">
                        <div className="flex justify-center text-coffee-400 mb-2 group-hover:scale-110 transition-transform"><Thermometer size={24} /></div>
                        <div className="text-2xl font-serif font-bold text-coffee-800">{recipe.waterTemp}°C</div>
                        <div className="text-xs uppercase font-bold text-coffee-400 tracking-wider">Temperature</div>
                    </div>
                    <div className="p-6 text-center group hover:bg-coffee-50 transition-colors">
                        <div className="flex justify-center text-coffee-400 mb-2 group-hover:scale-110 transition-transform"><Wind size={24} /></div>
                        <div className="text-lg font-serif font-bold text-coffee-800 mt-1 line-clamp-1" title={recipe.grindSize}>{recipe.grindSize}</div>
                        <div className="text-xs uppercase font-bold text-coffee-400 tracking-wider mt-1">Grind Size</div>
                    </div>
                </div>

                 {/* Ratio Explanation */}
                <div className="p-6 md:p-8 bg-white border-b border-coffee-100 flex flex-col md:flex-row gap-6 items-start">
                    <div className="flex-shrink-0 p-3 bg-coffee-100 rounded-full text-coffee-600">
                        <Scale size={24} />
                    </div>
                    <div>
                         <div className="flex items-center gap-2 mb-2 relative">
                            <h3 className="font-brand font-bold text-lg text-coffee-950 uppercase">Understanding the {recipe.ratio} Ratio</h3>
                            <button 
                                onClick={() => setShowRatioInfo(!showRatioInfo)}
                                className="text-coffee-400 hover:text-coffee-600 transition-colors bg-coffee-50 p-1 rounded-full hover:bg-coffee-100"
                                aria-label="Learn more about ratio chemistry"
                            >
                                <Info size={16} />
                            </button>

                            {showRatioInfo && (
                                <div className="absolute bottom-full left-0 mb-2 z-20 w-80 sm:w-96 bg-white p-5 rounded-xl shadow-xl border border-coffee-200 text-left animate-fade-in origin-bottom-left">
                                    <div className="flex justify-between items-start mb-3">
                                        <h4 className="font-bold text-coffee-800 text-sm flex items-center gap-2">
                                            <FlaskConical size={14} className="text-coffee-500"/>
                                            Solvent Chemistry
                                        </h4>
                                        <button onClick={() => setShowRatioInfo(false)} className="text-coffee-400 hover:text-coffee-600"><X size={14}/></button>
                                    </div>
                                    <p className="text-xs text-coffee-600 mb-3 leading-relaxed">
                                        Water acts as a solvent. The ratio determines the <strong>concentration gradient</strong>—the force pulling flavors out of the bean.
                                    </p>
                                    <div className="space-y-2">
                                        <div className="bg-coffee-50 p-2 rounded-lg">
                                            <p className="text-[10px] font-bold text-coffee-700 mb-1">High Ratio (More Water)</p>
                                            <p className="text-[10px] text-coffee-600">Maintains a steep gradient longer, extracting heavy compounds (bitterness/astringency) if not timed correctly.</p>
                                        </div>
                                        <div className="bg-coffee-50 p-2 rounded-lg">
                                            <p className="text-[10px] font-bold text-coffee-700 mb-1">Low Ratio (Less Water)</p>
                                            <p className="text-[10px] text-coffee-600">Water saturates quickly with easy-to-dissolve acids/sugars, often slowing extraction before heavy tannins dissolve.</p>
                                        </div>
                                    </div>

                                    {/* Expanded Grind Interaction Section */}
                                    <div className="mt-4 pt-3 border-t border-coffee-100">
                                        <h4 className="font-bold text-coffee-800 text-sm flex items-center gap-2 mb-2">
                                            <Wind size={14} className="text-coffee-500"/>
                                            Grind Interaction
                                        </h4>
                                         <p className="text-xs text-coffee-600 mb-3 leading-relaxed">
                                            Ratio changes how much solvent passes through the bed. Grind size controls how fast water flows and how much surface area is exposed.
                                        </p>
                                         <div className="grid grid-cols-2 gap-2">
                                             <div className="bg-coffee-50 p-2 rounded-lg">
                                                <p className="text-[10px] font-bold text-coffee-700 mb-1">Wider Ratio (1:17+)</p>
                                                 <p className="text-[10px] text-coffee-600">More solvent. Grind <strong>Coarser</strong> to prevent over-extraction.</p>
                                             </div>
                                             <div className="bg-coffee-50 p-2 rounded-lg">
                                                 <p className="text-[10px] font-bold text-coffee-700 mb-1">Tighter Ratio (1:15-)</p>
                                                 <p className="text-[10px] text-coffee-600">Less solvent. Grind <strong>Finer</strong> to maximize extraction.</p>
                                             </div>
                                         </div>
                                    </div>
                                    <div className="absolute bottom-[-6px] left-6 w-3 h-3 bg-white border-b border-r border-coffee-200 rotate-45"></div>
                                </div>
                            )}
                         </div>
                         <p className="text-coffee-600 text-sm leading-relaxed mb-3">
                            This recipe relies on a <strong>{recipe.ratio}</strong> coffee-to-water ratio to achieve optimal balance. The ratio determines the concentration of dissolved solids in your cup.
                         </p>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                            <div className="bg-coffee-50 p-3 rounded-lg border border-coffee-100">
                                <span className="font-bold text-coffee-800 block mb-1">Stronger (1:15)</span>
                                Less water per gram of coffee results in a heavier body and more intense flavors, but risks under-extraction (sourness) if not managed.
                            </div>
                            <div className="bg-coffee-50 p-3 rounded-lg border border-coffee-100">
                                <span className="font-bold text-coffee-800 block mb-1">Weaker (1:17+)</span>
                                More water increases extraction yield, highlighting delicate acidity and floral notes, but dilutes the body (mouthfeel).
                            </div>
                         </div>
                    </div>
                </div>
                
                <div className="p-6 md:p-8 bg-coffee-50/50 border-b border-coffee-100">
                    <h3 className="text-sm font-bold text-coffee-400 uppercase tracking-widest mb-4">Flavor Expectation</h3>
                    <p className="text-coffee-800 italic text-lg border-l-4 border-coffee-400 pl-4 py-1">{recipe.flavorExpectation}</p>
                </div>

                {/* Brew Time Adjustment Control */}
                <div className="p-6 md:p-8">
                  <div className="flex items-center gap-2 mb-4">
                     <Sliders size={18} className="text-coffee-600" />
                     <h3 className="text-sm font-bold text-coffee-600 uppercase tracking-widest">Adjust Total Brew Time</h3>
                  </div>
                  <div className="flex items-center gap-6">
                    <input 
                      type="range" 
                      min="60" 
                      max="600" 
                      step="5"
                      value={totalDuration}
                      onChange={(e) => handleTimeAdjustment(parseInt(e.target.value))}
                      className="flex-1 h-2 bg-coffee-200 rounded-lg appearance-none cursor-pointer accent-coffee-600"
                    />
                    <div className="bg-coffee-100 px-4 py-2 rounded-lg font-mono font-bold text-coffee-800 min-w-[80px] text-center">
                      {formatTime(totalDuration)}
                    </div>
                  </div>
                  <p className="text-xs text-coffee-500 mt-2">
                    Drag to scale all brew steps proportionally. Useful for adjusting strength or flow rate.
                  </p>
                </div>
             </div>

             {/* Visual Aids Grid */}
             <div className="grid md:grid-cols-2 gap-6 mb-8">
                {/* Equipment Diagram */}
                <div className="p-6 bg-coffee-50 rounded-2xl border border-coffee-100 flex flex-col items-center justify-center text-center">
                    <h3 className="text-coffee-600 font-bold uppercase tracking-widest text-xs mb-6">Equipment Setup</h3>
                    <div className="w-48 h-48 mb-4">
                        <BrewMethodDiagram methodId={selectedMethodId} />
                    </div>
                    <p className="text-coffee-500 text-xs max-w-sm">Ensure your equipment is clean and pre-heated.</p>
                </div>

                {/* AI Video Preview - INSTRUCTIONAL */}
                <div className="p-6 bg-gradient-to-br from-gray-900 to-black rounded-2xl border border-coffee-900 flex flex-col items-center justify-center text-center relative overflow-hidden group min-h-[300px]">
                    <h3 className="text-white/80 font-bold uppercase tracking-widest text-xs mb-6 z-10">AI Recipe Demonstration</h3>
                    
                    {recipeVideoUrl ? (
                         <video 
                           src={recipeVideoUrl} 
                           controls 
                           autoPlay 
                           loop 
                           className="w-full h-full object-contain absolute inset-0 z-0 bg-black"
                         />
                    ) : (
                        <div className="z-10 flex flex-col items-center">
                            {isGeneratingRecipeVideo ? (
                                <>
                                    <Loader2 className="animate-spin text-coffee-400 mb-4" size={32} />
                                    <p className="text-white/80 text-sm">Generating instructional preview...</p>
                                    <p className="text-white/40 text-xs mt-1">Simulating brewing steps with Veo</p>
                                </>
                            ) : (
                                <>
                                    <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mb-6 backdrop-blur-sm border border-white/10">
                                       <Play className="text-white ml-1" size={24} fill="currentColor" />
                                    </div>
                                    <p className="text-white/90 font-bold text-lg mb-2">Watch How to Brew</p>
                                    <p className="text-white/60 text-xs mb-6 max-w-xs">Generate an AI visualization of this specific technique.</p>
                                    <button 
                                        onClick={handleGenerateRecipeVideo}
                                        className="bg-coffee-600 hover:bg-coffee-500 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg shadow-coffee-900/50 transition-all transform hover:scale-105"
                                    >
                                        Generate Video
                                    </button>
                                </>
                            )}
                        </div>
                    )}
                </div>
             </div>

             <BrewTimer recipe={recipe} onReset={() => {}} />
          </div>
        )}
      </div>
    );
  };

  const renderVideoStudio = () => (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <div className="mb-8">
         <h2 className="text-3xl font-brand font-bold text-coffee-950 uppercase tracking-wide">AI Video Studio</h2>
         <p className="text-coffee-600">Visualize your brew with Veo.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-6">
           {/* Step 1: Image Upload */}
           <div className="bg-white p-6 rounded-2xl shadow-sm border border-coffee-100">
              <h3 className="font-bold text-coffee-800 mb-4 flex items-center gap-2">
                <span className="bg-coffee-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">1</span>
                Upload Reference
              </h3>
              
              <div 
                onClick={() => fileInputRef.current?.click()}
                className={`
                   border-2 border-dashed rounded-xl h-48 flex flex-col items-center justify-center cursor-pointer transition-all
                   ${selectedImagePreview ? 'border-coffee-300 bg-coffee-50' : 'border-coffee-200 hover:border-coffee-400 hover:bg-coffee-50'}
                `}
              >
                 {selectedImagePreview ? (
                   <img src={selectedImagePreview} alt="Preview" className="h-full w-full object-contain p-2" />
                 ) : (
                   <div className="text-center p-4">
                      <Upload className="mx-auto text-coffee-300 mb-2" />
                      <p className="text-coffee-500 text-sm font-medium">Click to upload photo</p>
                      <p className="text-coffee-400 text-xs mt-1">PNG or JPG</p>
                   </div>
                 )}
                 <input 
                   ref={fileInputRef}
                   type="file" 
                   accept="image/*" 
                   onChange={handleImageSelect}
                   className="hidden"
                 />
              </div>
           </div>

           {/* Step 2: Prompt */}
           <div className="bg-white p-6 rounded-2xl shadow-sm border border-coffee-100">
              <h3 className="font-bold text-coffee-800 mb-4 flex items-center gap-2">
                <span className="bg-coffee-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">2</span>
                Describe Scene
              </h3>
              <textarea
                value={videoPrompt}
                onChange={(e) => setVideoPrompt(e.target.value)}
                className="w-full p-4 bg-coffee-50 border border-coffee-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-coffee-400 min-h-[120px] text-coffee-800"
                placeholder="Describe camera movement, lighting, and action..."
              />
              <button 
                onClick={handleGenerateVideo}
                disabled={isGeneratingVideo || !selectedImage}
                className={`w-full mt-4 py-3 rounded-full font-bold flex items-center justify-center gap-2 transition-all shadow-lg ${
                  isGeneratingVideo || !selectedImage
                  ? 'bg-coffee-200 text-coffee-400 cursor-not-allowed'
                  : 'bg-coffee-600 hover:bg-coffee-700 text-white hover:scale-105'
                }`}
              >
                {isGeneratingVideo ? (
                  <>
                     <Loader2 className="animate-spin" /> Generating...
                  </>
                ) : (
                  <>
                     <Film size={20} /> Generate Video
                  </>
                )}
              </button>
           </div>
        </div>

        {/* Video Output */}
        <div className="bg-black rounded-2xl overflow-hidden shadow-2xl min-h-[400px] flex items-center justify-center relative">
           {isGeneratingVideo && (
              <div className="text-center z-10 p-6">
                 <Loader2 className="animate-spin text-coffee-400 mx-auto mb-4 w-12 h-12" />
                 <p className="text-white font-medium text-lg animate-pulse">{videoLoadingMessage}</p>
                 <p className="text-white/40 text-sm mt-2">This may take a minute...</p>
              </div>
           )}
           
           {!isGeneratingVideo && generatedVideoUrl && (
              <video 
                src={generatedVideoUrl} 
                controls 
                autoPlay 
                loop 
                className="w-full h-full object-contain"
              />
           )}

           {!isGeneratingVideo && !generatedVideoUrl && (
              <div className="text-center text-white/30 p-8">
                 <Film size={64} className="mx-auto mb-4 opacity-50" />
                 <p className="text-lg font-medium">Ready to render</p>
                 <p className="text-sm mt-2 max-w-xs mx-auto">Upload an image and click generate to create a Veo video.</p>
              </div>
           )}
        </div>
      </div>
    </div>
  );

  const renderTutor = () => (
    <div className="max-w-2xl mx-auto px-6 py-8 h-[calc(100vh-80px)] flex flex-col">
      <div className="mb-6 flex-shrink-0">
        <h2 className="text-3xl font-brand font-bold text-coffee-950 uppercase tracking-wide">Barista Tutor</h2>
        <p className="text-coffee-600">Expert advice on demand.</p>
      </div>

      <div className="flex-1 bg-white rounded-2xl shadow-sm border border-coffee-100 overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
           {chatHistory.length === 0 && (
              <div className="text-center py-10 text-coffee-400">
                 <MessageSquare size={48} className="mx-auto mb-4 opacity-50" />
                 <p>Ask me about grind size, extraction issues, or gear recommendations!</p>
              </div>
           )}
           {chatHistory.map((msg, i) => (
             <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
               <div className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed ${
                 msg.role === 'user' 
                 ? 'bg-coffee-600 text-white rounded-tr-none' 
                 : 'bg-coffee-50 text-coffee-800 rounded-tl-none'
               }`}>
                 {msg.content}
               </div>
             </div>
           ))}
           {isChatting && (
             <div className="flex justify-start">
               <div className="bg-coffee-50 p-4 rounded-2xl rounded-tl-none flex gap-1">
                 <span className="w-2 h-2 bg-coffee-400 rounded-full animate-bounce"></span>
                 <span className="w-2 h-2 bg-coffee-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                 <span className="w-2 h-2 bg-coffee-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
               </div>
             </div>
           )}
           <div ref={chatEndRef} />
        </div>
        
        <div className="p-4 border-t border-coffee-100 bg-coffee-50/50">
           <div className="flex gap-2">
             <input
               type="text"
               value={chatInput}
               onChange={(e) => setChatInput(e.target.value)}
               onKeyDown={(e) => e.key === 'Enter' && handleChatSend()}
               placeholder="Why is my coffee bitter?"
               className="flex-1 p-3 border border-coffee-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-coffee-400"
             />
             <button 
               onClick={handleChatSend}
               disabled={!chatInput.trim() || isChatting}
               className="bg-coffee-600 text-white p-3 rounded-xl hover:bg-coffee-700 disabled:opacity-50 transition-colors"
             >
               <Send size={20} />
             </button>
           </div>
        </div>
      </div>
    </div>
  );

  const renderFlavorExplorer = () => (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <div className="mb-6">
        <h2 className="text-3xl font-brand font-bold text-coffee-950 uppercase tracking-wide">Flavor Explorer</h2>
        <p className="text-coffee-600">Understand the chemistry of taste.</p>
      </div>

      {renderBeanSelector()}

      <div className="flex justify-center mb-8">
        <button
          onClick={handleExplainFlavor}
          disabled={isExplaining}
          className="bg-coffee-600 text-white px-8 py-3 rounded-full font-bold shadow-lg hover:bg-coffee-700 hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
           {isExplaining ? <Loader2 className="animate-spin" /> : <Sparkles size={20} />}
           Analyze Profile
        </button>
      </div>

      {flavorExplanation && (
        <div className="bg-white rounded-2xl shadow-sm border border-coffee-100 p-8 animate-fade-in">
           <h3 className="text-xl font-brand font-bold text-coffee-900 mb-4 flex items-center gap-2">
              <BookOpen size={24} className="text-coffee-500"/>
              Sensory Analysis
           </h3>
           <div className="prose prose-coffee max-w-none text-coffee-700 leading-relaxed">
              {flavorExplanation.split('\n').map((para, i) => (
                 <p key={i} className="mb-4">{para}</p>
              ))}
           </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen pb-20">
      {renderHeader()}
      <main>
        {currentView === View.HOME && renderHome()}
        {currentView === View.BREW_GUIDE && renderBrewGuide()}
        {currentView === View.FLAVOR_EXPLORER && renderFlavorExplorer()}
        {currentView === View.TUTOR && renderTutor()}
        {currentView === View.VIDEO_STUDIO && renderVideoStudio()}
        {currentView === View.FAVORITES && renderFavorites()}
        {currentView === View.HISTORY && renderHistory()}
        {currentView === View.ROASTING && renderRoasting()}
        {currentView === View.LATTE_ART && renderLatteArt()}
      </main>
    </div>
  );
};

export default App;
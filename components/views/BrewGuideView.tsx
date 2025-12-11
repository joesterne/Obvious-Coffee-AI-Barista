import React, { useState, memo } from 'react';
import { CoffeeProfile, Recipe, FavoriteItem, View } from '../../types';
import { BREW_METHODS } from '../../constants';
import * as GeminiService from '../../services/geminiService';
import BrewTimer from '../BrewTimer';
import BrewMethodDiagram from '../BrewMethodDiagram';
import BeanSelector from '../BeanSelector';
import { Coffee, Droplets, Thermometer, Wind, Scale, Info, X, FlaskConical, Heart, Film, Loader2, Play, Sliders, Printer, Sparkles, MessageSquare } from 'lucide-react';
import { ensureApiKey } from '../../utils/auth';

interface BrewGuideViewProps {
  profile: CoffeeProfile;
  setProfile: React.Dispatch<React.SetStateAction<CoffeeProfile>>;
  recipe: Recipe | null;
  setRecipe: (recipe: Recipe | null) => void;
  setOriginalRecipe: (recipe: Recipe | null) => void;
  originalRecipe: Recipe | null;
  handleSaveItem: (item: FavoriteItem) => void;
  savedItems: FavoriteItem[];
  addToHistory: (recipe: Recipe) => void;
  setCurrentView: (view: View) => void;
}

const BrewGuideView: React.FC<BrewGuideViewProps> = ({ 
  profile, setProfile, recipe, setRecipe, setOriginalRecipe, originalRecipe, 
  handleSaveItem, savedItems, addToHistory, setCurrentView 
}) => {
  const [selectedMethodId, setSelectedMethodId] = useState<string | null>(null);
  const [isLoadingRecipe, setIsLoadingRecipe] = useState(false);
  const [recipeVideoUrl, setRecipeVideoUrl] = useState<string | null>(null);
  const [isGeneratingRecipeVideo, setIsGeneratingRecipeVideo] = useState(false);
  const [showRatioInfo, setShowRatioInfo] = useState(false);

  // Load the stock recipe immediately
  const handleSelectMethod = (methodId: string) => {
    const method = BREW_METHODS.find(m => m.id === methodId);
    if (!method) return;

    setSelectedMethodId(methodId);
    setRecipeVideoUrl(null);
    setShowRatioInfo(false);
    
    // Load default recipe
    setRecipe(method.defaultRecipe);
    setOriginalRecipe(method.defaultRecipe);
  };

  const handleCustomizeWithAI = async () => {
    if (!selectedMethodId) return;
    const method = BREW_METHODS.find(m => m.id === selectedMethodId);
    if (!method) return;

    setIsLoadingRecipe(true);
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

  const handleGenerateRecipeVideo = async () => {
    if (!recipe || !selectedMethodId) return;
    if (!(await ensureApiKey())) return;

    setIsGeneratingRecipeVideo(true);
    try {
        const method = BREW_METHODS.find(m => m.id === selectedMethodId);
        // Fallback to a safe coffee image from Unsplash if method image is missing
        const safeFallback = 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=600&q=80';
        const response = await fetch(method?.image || safeFallback);
        const imageBlob = await response.blob();
        
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

  const navigateToVideoStudioWithRecipe = () => {
    setCurrentView(View.VIDEO_STUDIO);
  };

  const formatTime = (totalSeconds: number) => {
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Render Helpers
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

  const totalDuration = recipe ? recipe.steps.reduce((acc, step) => acc + step.duration, 0) : 0;
  const isRecipeSaved = recipe && recipe.id && savedItems.some(r => r.id === recipe.id);

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <div className="mb-6">
        <h2 className="text-3xl font-brand font-bold text-coffee-950 uppercase tracking-wide">Brew Guide</h2>
        <p className="text-coffee-600">Tailored recipes for your beans.</p>
      </div>
      
      <div className="no-print">
         <BeanSelector profile={profile} setProfile={setProfile} />
      </div>
      
      {!recipe && !isLoadingRecipe && renderTemperatureInfo()}
      
      {!recipe && !isLoadingRecipe && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {BREW_METHODS.map(method => (
            <button
              key={method.id}
              onClick={() => handleSelectMethod(method.id)}
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
           <div className="flex justify-between items-center mb-4 no-print">
               <button onClick={() => { setRecipe(null); setOriginalRecipe(null); setRecipeVideoUrl(null); }} className="text-sm text-coffee-500 hover:text-coffee-800 underline">Choose a different method</button>
               <div className="flex gap-2">
                  <button 
                      onClick={() => window.print()} 
                      className="flex items-center gap-2 text-sm bg-white border border-coffee-200 text-coffee-600 hover:bg-coffee-50 px-3 py-1.5 rounded-full transition-colors font-medium"
                      title="Print Recipe"
                  >
                      <Printer size={14} /> Print
                  </button>
                  <button 
                      onClick={() => handleSaveItem({ ...recipe, type: 'recipe' })}
                      className={`flex items-center gap-2 text-sm px-3 py-1.5 rounded-full transition-colors font-medium border ${
                          isRecipeSaved 
                          ? 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100' 
                          : 'bg-white text-coffee-600 border-coffee-200 hover:bg-coffee-50'
                      }`}
                  >
                      <Heart size={14} className={isRecipeSaved ? "fill-current" : ""} /> 
                      {isRecipeSaved ? 'Saved' : 'Save'}
                  </button>
                  <button 
                      onClick={() => setCurrentView(View.TUTOR)}
                      className="flex items-center gap-2 text-sm bg-coffee-100 hover:bg-coffee-200 text-coffee-800 px-3 py-1.5 rounded-full transition-colors font-medium"
                  >
                      <MessageSquare size={14} /> Help
                  </button>
               </div>
           </div>
           
           <div className="bg-white rounded-2xl shadow-sm border border-coffee-200 overflow-hidden mb-8">
              <div className="bg-coffee-800 text-white p-6 md:p-8 relative">
                  <div className="relative z-10">
                    <h2 className="text-3xl font-brand font-bold mb-2 uppercase">{recipe.method}</h2>
                    <p className="text-coffee-200 text-lg leading-relaxed max-w-3xl">{recipe.description}</p>
                    
                    {/* AI Customization Call to Action */}
                    {!recipe.id && ( // Assuming stock recipes don't have an ID initially or we check a flag. Stock recipes in constant didn't have ID, generated ones usually get one or we can check simple property
                        <div className="mt-6 p-4 bg-white/10 rounded-xl border border-white/20 backdrop-blur-sm flex flex-col sm:flex-row items-center gap-4">
                            <div className="flex-1">
                                <h4 className="font-bold text-white flex items-center gap-2"><Sparkles size={16} /> Customize for {profile.origin} {profile.roastLevel}</h4>
                                <p className="text-white/70 text-sm">The current recipe is a standard guide. Use AI to dial it in for your specific bean profile.</p>
                            </div>
                            <button 
                                onClick={handleCustomizeWithAI}
                                className="bg-white text-coffee-900 px-5 py-2 rounded-lg font-bold text-sm hover:bg-coffee-50 transition-colors shadow-lg whitespace-nowrap flex items-center gap-2"
                            >
                                <Sparkles size={16} /> AI Remix
                            </button>
                        </div>
                    )}
                  </div>
              </div>

              <div className="border-b border-coffee-100 bg-coffee-50/30 px-6 py-2">
                 <h3 className="text-xs font-bold text-coffee-400 uppercase tracking-widest flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-coffee-400"></span>
                    Recipe Overview
                 </h3>
              </div>

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

              <div className="p-6 md:p-8 bg-white border-b border-coffee-100 flex flex-col md:flex-row gap-6 items-start">
                  <div className="flex-shrink-0 p-3 bg-coffee-100 rounded-full text-coffee-600">
                      <Scale size={24} />
                  </div>
                  <div>
                       <div className="flex items-center gap-2 mb-2 relative">
                          <h3 className="font-brand font-bold text-lg text-coffee-950 uppercase">Understanding the {recipe.ratio} Ratio</h3>
                          <button 
                              onClick={() => setShowRatioInfo(!showRatioInfo)}
                              className="text-coffee-400 hover:text-coffee-600 transition-colors bg-coffee-50 p-1 rounded-full hover:bg-coffee-100 no-print"
                          >
                              <Info size={16} />
                          </button>
                          {showRatioInfo && (
                              <div className="absolute bottom-full left-0 mb-2 z-20 w-80 sm:w-96 bg-white p-5 rounded-xl shadow-xl border border-coffee-200 text-left animate-fade-in origin-bottom-left no-print">
                                  <div className="flex justify-between items-start mb-3">
                                      <h4 className="font-bold text-coffee-800 text-sm flex items-center gap-2">
                                          <FlaskConical size={14} className="text-coffee-500"/>
                                          Solvent Chemistry
                                      </h4>
                                      <button onClick={() => setShowRatioInfo(false)} className="text-coffee-400 hover:text-coffee-600"><X size={14}/></button>
                                  </div>
                                  <p className="text-xs text-coffee-600 mb-3 leading-relaxed">
                                      Water acts as a solvent. The ratio determines the concentration gradient.
                                  </p>
                                  <div className="space-y-2">
                                      <div className="bg-coffee-50 p-2 rounded-lg">
                                          <p className="text-[10px] font-bold text-coffee-700 mb-1">High Ratio (More Water)</p>
                                          <p className="text-[10px] text-coffee-600">Extracts more, risks over-extraction if not timed.</p>
                                      </div>
                                      <div className="bg-coffee-50 p-2 rounded-lg">
                                          <p className="text-[10px] font-bold text-coffee-700 mb-1">Low Ratio (Less Water)</p>
                                          <p className="text-[10px] text-coffee-600">Stronger body, quicker saturation.</p>
                                      </div>
                                  </div>
                              </div>
                          )}
                       </div>
                       <p className="text-coffee-600 text-sm leading-relaxed mb-3">
                          This recipe relies on a <strong>{recipe.ratio}</strong> coffee-to-water ratio to achieve optimal balance.
                       </p>
                  </div>
              </div>

              <div className="p-6 md:p-8 no-print">
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
              </div>
           </div>

           <div className="grid md:grid-cols-2 gap-6 mb-8 no-print">
              <div className="p-6 bg-coffee-50 rounded-2xl border border-coffee-100 flex flex-col items-center justify-center text-center">
                  <h3 className="text-coffee-600 font-bold uppercase tracking-widest text-xs mb-6">Equipment Setup</h3>
                  <div className="w-48 h-48 mb-4">
                      <BrewMethodDiagram methodId={selectedMethodId} />
                  </div>
                  <p className="text-coffee-500 text-xs max-w-sm">Ensure your equipment is clean and pre-heated.</p>
              </div>

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

export default memo(BrewGuideView);
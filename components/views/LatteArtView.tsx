import React, { useState } from 'react';
import { FavoriteItem, LatteArtPattern } from '../../types';
import { LATTE_ART_PATTERNS } from '../../constants';
import * as GeminiService from '../../services/geminiService';
import { ensureApiKey } from '../../utils/auth';
import { ChevronLeft, Printer, Heart, BookOpen, Film, Loader2, Palette, Play } from 'lucide-react';

interface LatteArtViewProps {
    handleSaveItem: (item: FavoriteItem) => void;
    savedItems: FavoriteItem[];
    selectedLatteArtId: string | null;
    setSelectedLatteArtId: (id: string | null) => void;
}

const LatteArtView: React.FC<LatteArtViewProps> = ({ handleSaveItem, savedItems, selectedLatteArtId, setSelectedLatteArtId }) => {
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
              <button onClick={() => { setSelectedLatteArtId(null); setLatteArtVideoUrl(null); }} className="flex items-center gap-2 text-coffee-500 hover:text-coffee-800 mb-4 transition-colors no-print">
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
                     <div className="flex items-center gap-2">
                         <button 
                            onClick={() => window.print()}
                            className="p-3 bg-white/10 rounded-full text-white hover:bg-white/20 transition-colors no-print"
                            title="Print Guide"
                         >
                            <Printer size={20} />
                         </button>
                         <button onClick={() => handleSaveItem(activePattern)} className={`p-3 rounded-full transition-colors no-print ${isSaved ? 'bg-white text-red-500' : 'bg-white/10 text-white hover:bg-white/20'}`}>
                            <Heart size={20} className={isSaved ? "fill-current" : ""} />
                         </button>
                     </div>
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
                    <div className="p-6 md:p-8 flex flex-col no-print">
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
            <div className="mb-8 flex justify-between items-end">
                <div>
                    <h2 className="text-3xl font-brand font-bold text-coffee-950 uppercase tracking-wide">Latte Art Studio</h2>
                    <p className="text-coffee-600">Master the pour.</p>
                </div>
                <button 
                    onClick={() => window.print()}
                    className="flex items-center gap-2 text-coffee-600 hover:text-coffee-900 px-3 py-2 rounded-lg hover:bg-coffee-100 transition-colors no-print"
                >
                    <Printer size={18} /> Print Patterns
                </button>
            </div>
            <div className="flex flex-wrap gap-2 mb-8 animate-fade-in no-print">
                {(['All', 'Beginner', 'Intermediate', 'Advanced'] as const).map((filter) => (
                    <button key={filter} onClick={() => setLatteArtFilter(filter)} className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${latteArtFilter === filter ? 'bg-coffee-800 text-white shadow-md' : 'bg-white text-coffee-500 border border-coffee-200 hover:border-coffee-400 hover:text-coffee-700'}`}>{filter}</button>
                ))}
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
                {filteredPatterns.map((pattern) => (
                    <div key={pattern.id} onClick={() => setSelectedLatteArtId(pattern.id)} className="group cursor-pointer bg-white rounded-2xl shadow-sm border border-coffee-100 overflow-hidden hover:shadow-md transition-all hover:-translate-y-1 relative">
                       <div className="h-48 bg-coffee-800 relative overflow-hidden flex items-center justify-center">
                          <img src={pattern.image} alt={pattern.name} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity mix-blend-overlay" />
                          <div className="absolute inset-0 bg-gradient-to-t from-coffee-900/80 to-transparent"></div>
                          <h3 className="absolute bottom-4 left-4 right-4 text-white font-brand font-bold text-xl uppercase z-10">{pattern.name}</h3>
                       </div>
                       <div className="p-5">
                          <div className="flex justify-between items-center mb-2">
                             <span className="text-xs font-bold text-coffee-500 uppercase tracking-widest">{pattern.difficulty}</span>
                             {savedItems.some(i => i.id === pattern.id) && <Heart size={14} className="text-red-500 fill-current" />}
                          </div>
                          <p className="text-coffee-600 text-sm line-clamp-2">{pattern.description}</p>
                       </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LatteArtView;

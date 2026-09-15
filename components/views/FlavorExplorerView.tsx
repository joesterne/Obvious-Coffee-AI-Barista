import React, { useState } from 'react';
import { CoffeeProfile } from '../../types';
import * as GeminiService from '../../services/geminiService';
import BeanSelector from '../BeanSelector';
import { Sparkles, Loader2, BookOpen } from 'lucide-react';

interface FlavorExplorerViewProps {
  profile: CoffeeProfile;
  setProfile: React.Dispatch<React.SetStateAction<CoffeeProfile>>;
}

const FlavorExplorerView: React.FC<FlavorExplorerViewProps> = ({ profile, setProfile }) => {
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
            <div className="no-print">
                <BeanSelector profile={profile} setProfile={setProfile} />
                <div className="flex justify-center mb-8">
                    <button onClick={handleExplainFlavor} disabled={isExplaining} className="bg-coffee-600 text-white px-8 py-3 rounded-full font-bold shadow-lg hover:bg-coffee-700 hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
                    {isExplaining ? <Loader2 className="animate-spin" /> : <Sparkles size={20} />} Analyze Profile
                    </button>
                </div>
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

export default FlavorExplorerView;

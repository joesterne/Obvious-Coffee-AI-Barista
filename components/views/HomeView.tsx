import React, { memo } from 'react';
import { View } from '../../types';
import FeatureCard from '../FeatureCard';
import { Droplets, Sparkles, Palette, Flame, BookOpen, Film, History as HistoryIcon, Heart } from 'lucide-react';

interface HomeViewProps {
  setCurrentView: (view: View) => void;
}

const HomeView: React.FC<HomeViewProps> = ({ setCurrentView }) => {
  return (
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
};

export default memo(HomeView);
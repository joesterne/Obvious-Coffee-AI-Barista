import React, { memo } from 'react';
import { Coffee, Check } from 'lucide-react';
import { CoffeeProfile } from '../types';
import { ORIGINS, TASTING_NOTES } from '../constants';

interface BeanSelectorProps {
  profile: CoffeeProfile;
  setProfile: React.Dispatch<React.SetStateAction<CoffeeProfile>>;
}

const BeanSelector: React.FC<BeanSelectorProps> = ({ profile, setProfile }) => {
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

  return (
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
};

export default memo(BeanSelector);
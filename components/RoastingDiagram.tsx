import React from 'react';

interface RoastingDiagramProps {
  type: 'drum' | 'fluid_bed' | 'stages';
}

const RoastingDiagram: React.FC<RoastingDiagramProps> = ({ type }) => {
  const commonClasses = "w-full h-full text-coffee-800 transition-all duration-500 animate-fade-in";

  switch (type) {
    case 'drum':
      return (
        <svg viewBox="0 0 200 120" className={commonClasses} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          {/* Main Drum */}
          <circle cx="100" cy="60" r="40" className="text-coffee-600" />
          
          {/* Rotating Drum Structure */}
          <g className="animate-spin" style={{ transformOrigin: '100px 60px', animationDuration: '8s' }}>
             <path d="M100,20 L100,100" strokeDasharray="4 4" opacity="0.3" />
             <path d="M60,60 L140,60" strokeDasharray="4 4" opacity="0.3" />
          </g>
          
          {/* Rotation Indicator */}
          <path d="M135,35 Q155,60 135,85" opacity="0.6" />
          <path d="M135,85 L140,78" opacity="0.6" /> {/* Arrow head part 1 */}
          <path d="M135,85 L128,80" opacity="0.6" /> {/* Arrow head part 2 */}
          
          {/* Flame below - Animated */}
          <path d="M80,110 Q90,90 100,110 T120,110" className="text-red-500 animate-pulse" strokeWidth="3" />
          <path d="M90,110 Q100,95 110,110" className="text-amber-500 animate-pulse" strokeWidth="3" style={{ animationDelay: '0.5s' }} />
          
          {/* Hopper/Chute */}
          <path d="M30,20 L65,40" />
          <path d="M30,20 L40,10" />
          
          {/* Cooling Tray */}
          <ellipse cx="160" cy="100" rx="30" ry="10" className="text-coffee-400" />
          
          {/* Beans inside - Tumbling + Bouncing Animation */}
          <g className="animate-spin" style={{ transformOrigin: '100px 60px', animationDuration: '4s' }}>
            <circle cx="90" cy="70" r="2.5" fill="currentColor" className="animate-bounce" style={{ animationDuration: '1s', animationDelay: '0s' }} />
            <circle cx="110" cy="70" r="2.5" fill="currentColor" className="animate-bounce" style={{ animationDuration: '1.2s', animationDelay: '0.1s' }} />
            <circle cx="100" cy="85" r="3" fill="currentColor" className="animate-bounce" style={{ animationDuration: '0.9s', animationDelay: '0.2s' }} />
            <circle cx="90" cy="50" r="2" fill="currentColor" className="animate-bounce" style={{ animationDuration: '1.1s', animationDelay: '0.3s' }} />
            <circle cx="115" cy="55" r="2.5" fill="currentColor" className="animate-bounce" style={{ animationDuration: '1.3s', animationDelay: '0.15s' }} />
            <circle cx="85" cy="60" r="2.8" fill="currentColor" className="animate-bounce" style={{ animationDuration: '0.8s', animationDelay: '0.05s' }} />
            <circle cx="105" cy="65" r="2.2" fill="currentColor" className="animate-bounce" style={{ animationDuration: '0.95s', animationDelay: '0.25s' }} />
            <circle cx="95" cy="55" r="2.5" fill="currentColor" className="animate-bounce" style={{ animationDuration: '1.15s', animationDelay: '0.4s' }} />
          </g>
        </svg>
      );
    case 'fluid_bed':
      return (
        <svg viewBox="0 0 200 120" className={commonClasses} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          {/* Roasting Chamber (Glass) */}
          <path d="M80,30 L80,100 Q100,110 120,100 L120,30" className="text-blue-300" />
          <ellipse cx="100" cy="30" rx="20" ry="5" />
          
          {/* Hot Air Arrows */}
          <path d="M90,115 L90,90" className="text-red-500" strokeWidth="3" />
          <path d="M100,115 L100,85" className="text-red-500" strokeWidth="3" />
          <path d="M110,115 L110,90" className="text-red-500" strokeWidth="3" />
          
          {/* Floating Beans */}
          <circle cx="95" cy="80" r="2" fill="currentColor" className="animate-bounce" style={{ animationDuration: '1s' }} />
          <circle cx="105" cy="70" r="2" fill="currentColor" className="animate-bounce" style={{ animationDuration: '1.2s' }} />
          <circle cx="100" cy="50" r="2" fill="currentColor" className="animate-bounce" style={{ animationDuration: '0.8s' }} />
          <circle cx="90" cy="60" r="2" fill="currentColor" className="animate-bounce" style={{ animationDuration: '1.1s' }} />
          <circle cx="110" cy="60" r="2" fill="currentColor" className="animate-bounce" style={{ animationDuration: '0.9s' }} />

          {/* Chaff Collector */}
          <path d="M120,40 Q150,40 150,70 L150,100" opacity="0.5" />
        </svg>
      );
    case 'stages':
      return (
        <svg viewBox="0 0 400 100" className={commonClasses} fill="none" stroke="currentColor" strokeWidth="2">
          {/* Timeline Line */}
          <line x1="20" y1="50" x2="380" y2="50" className="text-coffee-300" />
          
          {/* Green */}
          <circle cx="40" cy="50" r="15" className="fill-green-100 stroke-green-600" />
          <text x="40" y="80" textAnchor="middle" className="text-[10px] fill-coffee-600 font-sans" stroke="none">Green</text>
          
          {/* Drying/Yellow */}
          <circle cx="120" cy="50" r="15" className="fill-yellow-100 stroke-yellow-600" />
          <text x="120" y="80" textAnchor="middle" className="text-[10px] fill-coffee-600 font-sans" stroke="none">Yellowing</text>
          
          {/* First Crack */}
          <circle cx="200" cy="50" r="18" className="fill-orange-100 stroke-orange-600" />
          <path d="M195,45 L205,55 M205,45 L195,55" stroke="orange" />
          <text x="200" y="80" textAnchor="middle" className="text-[10px] fill-coffee-600 font-sans font-bold" stroke="none">1st Crack</text>
          
          {/* Development */}
          <circle cx="280" cy="50" r="15" className="fill-coffee-400 stroke-coffee-800" />
          <text x="280" y="80" textAnchor="middle" className="text-[10px] fill-coffee-600 font-sans" stroke="none">Development</text>
          
          {/* Second Crack */}
          <circle cx="360" cy="50" r="15" className="fill-coffee-900 stroke-black" />
          <text x="360" y="80" textAnchor="middle" className="text-[10px] fill-coffee-600 font-sans" stroke="none">2nd Crack</text>
        </svg>
      );
    default:
      return null;
  }
};

export default RoastingDiagram;
import React from 'react';

interface BrewMethodDiagramProps {
  methodId: string | null;
}

const BrewMethodDiagram: React.FC<BrewMethodDiagramProps> = ({ methodId }) => {
  if (!methodId) return null;

  const renderDiagram = () => {
    const commonClasses = "w-full h-full text-coffee-800 transition-all duration-500 animate-fade-in";
    
    switch (methodId) {
      case 'v60':
        return (
          <svg viewBox="0 0 100 100" className={commonClasses} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {/* V60 Cone */}
            <path d="M20,20 L80,20 L50,70 L20,20 Z" />
            <path d="M25,20 C35,22 65,22 75,20" opacity="0.3" />
            <path d="M30,30 L70,30" opacity="0.2" />
            <path d="M35,40 L65,40" opacity="0.2" />
            <path d="M40,50 L60,50" opacity="0.2" />
            {/* Filter folds */}
            <path d="M80,20 Q85,20 85,25 L50,80 L15,25 Q15,20 20,20" strokeDasharray="2 2" opacity="0.5" />
            {/* Dripping */}
            <line x1="50" y1="70" x2="50" y2="85" strokeDasharray="2 2" />
            <circle cx="50" cy="88" r="1.5" fill="currentColor" stroke="none" />
            {/* Carafe/Cup */}
            <path d="M35,85 L65,85 L60,95 L40,95 Z" />
          </svg>
        );
      case 'french_press':
        return (
          <svg viewBox="0 0 100 100" className={commonClasses} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {/* Beaker */}
            <path d="M30,20 L30,90 L70,90 L70,20" />
            <path d="M28,90 L72,90" strokeWidth="3" />
            {/* Handle */}
            <path d="M70,30 Q85,30 85,50 Q85,70 70,70" />
            {/* Plunger Up State */}
            <line x1="50" y1="5" x2="50" y2="40" />
            <circle cx="50" cy="5" r="3" />
            <line x1="32" y1="40" x2="68" y2="40" />
            <rect x="32" y="38" width="36" height="4" opacity="0.5" />
            {/* Coffee Grounds at bottom */}
            <path d="M32,80 L68,80" strokeDasharray="1 3" strokeWidth="4" opacity="0.5" />
            <path d="M35,85 L65,85" strokeDasharray="1 3" strokeWidth="4" opacity="0.5" />
          </svg>
        );
      case 'chemex':
        return (
            <svg viewBox="0 0 100 100" className={commonClasses} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                {/* Hourglass Shape */}
                <path d="M30,10 L70,10 L55,45 L75,95 L25,95 L45,45 L30,10 Z" />
                {/* Wood Collar */}
                <path d="M46,42 Q50,48 54,42 L56,44 Q50,52 44,44 Z" fill="currentColor" opacity="0.2" />
                <path d="M44,44 L56,44" strokeWidth="6" className="text-coffee-600" opacity="0.5" />
                {/* Filter top */}
                <path d="M25,5 L75,5" strokeDasharray="2 2" opacity="0.3" />
                {/* Level mark */}
                <circle cx="65" cy="50" r="2" fill="currentColor" opacity="0.5" stroke="none"/>
            </svg>
        );
      case 'aeropress':
         return (
            <svg viewBox="0 0 100 100" className={commonClasses} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                {/* Chamber */}
                <path d="M35,35 L35,90 L65,90 L65,35" />
                <path d="M30,90 L70,90" strokeWidth="3"/>
                <path d="M30,35 L70,35" strokeWidth="3"/>
                {/* Plunger */}
                <path d="M37,10 L63,10 L63,40 L37,40 Z" />
                <line x1="37" y1="40" x2="63" y2="40" strokeWidth="4" opacity="0.5" />
                {/* Numbers */}
                <circle cx="50" cy="50" r="1" fill="currentColor" stroke="none" />
                <circle cx="50" cy="65" r="1" fill="currentColor" stroke="none" />
                <circle cx="50" cy="80" r="1" fill="currentColor" stroke="none" />
            </svg>
         );
      case 'moka_pot':
          return (
             <svg viewBox="0 0 100 100" className={commonClasses} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                 {/* Bottom Chamber */}
                 <path d="M30,95 L70,95 L65,55 L35,55 Z" />
                 {/* Top Chamber */}
                 <path d="M35,55 L25,15 L75,15 L65,55" />
                 {/* Lid Knob */}
                 <circle cx="50" cy="10" r="3" />
                 <path d="M40,15 L60,15" />
                 {/* Handle */}
                 <path d="M68,30 Q85,30 85,50 L80,75" />
                 {/* Spout */}
                 <path d="M75,15 L82,18" />
             </svg>
          );
      case 'espresso':
          return (
             <svg viewBox="0 0 100 100" className={commonClasses} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                 {/* Portafilter Head */}
                 <circle cx="50" cy="40" r="20" />
                 {/* Handle */}
                 <line x1="68" y1="40" x2="100" y2="40" strokeWidth="8" strokeLinecap="round" />
                 {/* Spouts */}
                 <path d="M45,58 L45,70" strokeWidth="3" />
                 <path d="M55,58 L55,70" strokeWidth="3" />
                 {/* Stream */}
                 <line x1="45" y1="72" x2="45" y2="85" strokeDasharray="1 1" />
                 <line x1="55" y1="72" x2="55" y2="85" strokeDasharray="1 1" />
                 {/* Cup */}
                 <path d="M35,85 L65,85 L60,95 L40,95 Z" />
             </svg>
          );
      default:
        return (
          <div className="flex flex-col items-center justify-center h-full text-coffee-300">
            <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z" />
                <path d="M12 14v2" />
                <path d="M12 8v.01" />
            </svg>
            <span className="text-xs font-medium mt-2">Diagram not available</span>
          </div>
        );
    }
  };

  return (
    <div className="w-full h-full flex items-center justify-center">
        {renderDiagram()}
    </div>
  );
};

export default BrewMethodDiagram;
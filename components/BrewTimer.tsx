import React, { useState, useEffect, useRef } from 'react';
import { Recipe, BrewStep } from '../types';
import { Play, Pause, RefreshCw, CheckCircle, ArrowRight } from 'lucide-react';

interface BrewTimerProps {
  recipe: Recipe;
  onReset: () => void;
}

const BrewTimer: React.FC<BrewTimerProps> = ({ recipe, onReset }) => {
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  // Refs for auto-scrolling
  const stepsContainerRef = useRef<HTMLDivElement>(null);
  const activeStepRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let interval: number | undefined;

    if (isActive) {
      interval = window.setInterval(() => {
        setSeconds((seconds) => seconds + 1);
      }, 1000);
    } else if (!isActive && seconds !== 0) {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [isActive, seconds]);

  useEffect(() => {
    // Find active step based on time
    let activeIndex = -1;
    for (let i = 0; i < recipe.steps.length; i++) {
        if (seconds >= recipe.steps[i].timeStart) {
            activeIndex = i;
        }
    }
    
    // Check if we are past the last step's duration
    const lastStep = recipe.steps[recipe.steps.length - 1];
    const endTime = lastStep.timeStart + lastStep.duration;
    
    if (seconds > endTime + 5) { // 5 seconds buffer after finish
        setIsFinished(true);
        setIsActive(false);
    }

    if (activeIndex !== -1) {
        setCurrentStepIndex(activeIndex);
    }
  }, [seconds, recipe.steps]);

  // Auto-scroll to active step
  useEffect(() => {
    if (activeStepRef.current && stepsContainerRef.current) {
        activeStepRef.current.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
        });
    }
  }, [currentStepIndex]);

  const toggle = () => setIsActive(!isActive);
  const reset = () => {
    setSeconds(0);
    setIsActive(false);
    setIsFinished(false);
    setCurrentStepIndex(0);
  };

  const formatTime = (totalSeconds: number) => {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;

    if (h > 0) {
      return `${h}:${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
    }
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const currentStep = recipe.steps[currentStepIndex];
  
  const progressPercentage = (step: BrewStep) => {
     if (!step) return 0;
     const progress = Math.min(100, Math.max(0, ((seconds - step.timeStart) / step.duration) * 100));
     return progress;
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-coffee-100 overflow-hidden max-w-2xl mx-auto">
      {/* Timer Display Header */}
      <div className="bg-coffee-50 p-6 md:p-8 text-center border-b border-coffee-100">
        <h3 className="text-coffee-600 font-bold uppercase tracking-widest text-xs mb-2 flex justify-center items-center gap-2">
          {isFinished ? (
              <span className="text-green-600 flex items-center gap-1"><CheckCircle size={14} /> Brew Complete</span>
          ) : isActive ? (
              <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span> Brewing Now</span>
          ) : 'Ready to Brew'}
        </h3>
        <div className="text-7xl md:text-8xl font-serif font-bold text-coffee-900 tabular-nums leading-none mb-6">
          {formatTime(seconds)}
        </div>
        
        {/* Controls */}
        <div className="flex justify-center gap-4">
            {!isActive && !isFinished && seconds === 0 && (
                <button 
                    onClick={toggle}
                    className="flex items-center gap-2 bg-coffee-600 hover:bg-coffee-700 text-white px-8 py-3 rounded-full font-bold shadow-lg shadow-coffee-200 transform transition-all hover:scale-105 active:scale-95"
                >
                    <Play size={20} fill="currentColor" /> Start Brew
                </button>
            )}
            
            {isActive && (
                <button 
                    onClick={toggle}
                    className="flex items-center gap-2 bg-white border-2 border-amber-200 hover:bg-amber-50 text-amber-800 px-8 py-3 rounded-full font-bold transition-all"
                >
                    <Pause size={20} fill="currentColor" /> Pause
                </button>
            )}

            {!isActive && seconds > 0 && !isFinished && (
                 <button 
                    onClick={toggle}
                    className="flex items-center gap-2 bg-coffee-600 hover:bg-coffee-700 text-white px-8 py-3 rounded-full font-bold shadow-lg transition-all"
                >
                    <Play size={20} fill="currentColor" /> Resume
                </button>
            )}

            {seconds > 0 && (
                <button 
                    onClick={() => { reset(); onReset(); }}
                    className="flex items-center gap-2 text-coffee-500 hover:text-coffee-800 px-4 py-3 rounded-full font-medium transition-all"
                >
                    <RefreshCw size={18} /> Reset
                </button>
            )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-6 md:p-8">
        {/* Current Instruction Box */}
        <div className="mb-8 relative overflow-hidden rounded-2xl bg-white border border-coffee-200 shadow-sm min-h-[180px] flex flex-col justify-center items-center text-center p-6 transition-all">
          {isFinished ? (
             <div className="animate-fade-in flex flex-col items-center">
               <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
               </div>
               <p className="text-2xl font-serif font-bold text-coffee-800">Enjoy your coffee!</p>
               <p className="text-coffee-600 mt-2 text-sm">Swirl the carafe gently and smell the aroma before serving.</p>
             </div>
          ) : (
            <>
              <div className="absolute top-4 right-4 text-xs font-mono text-coffee-400">
                  Step {currentStepIndex + 1} of {recipe.steps.length}
              </div>
              <h4 className="text-3xl font-serif font-bold text-coffee-900 mb-3">{currentStep?.action || "Get Ready"}</h4>
              <p className="text-coffee-600 text-lg mb-6 max-w-md mx-auto leading-relaxed">{currentStep?.description || "Press start when you are ready."}</p>
              
              {currentStep?.waterAmount && (
                  <div className="inline-flex items-center gap-2 bg-coffee-100 text-coffee-900 px-4 py-1.5 rounded-full text-sm font-bold shadow-sm">
                      <span className="text-coffee-500 font-normal">Target Weight:</span>
                      {currentStep.waterAmount}g
                  </div>
              )}
              
              {isActive && (
                  <div className="absolute bottom-0 left-0 w-full h-1.5 bg-coffee-100">
                      <div 
                          className="h-full bg-coffee-600 transition-all duration-1000 ease-linear"
                          style={{ width: `${progressPercentage(currentStep)}%`}}
                      />
                  </div>
              )}
            </>
          )}
        </div>

        {/* Dynamic Steps List */}
        <div>
           <h5 className="text-xs font-bold text-coffee-400 uppercase tracking-widest mb-4 px-2">Timeline</h5>
           <div 
              ref={stepsContainerRef}
              className="space-y-4 max-h-80 overflow-y-auto pr-2 pb-10 scroll-smooth"
           >
              {recipe.steps.map((step, idx) => {
                  const isCurrent = idx === currentStepIndex && !isFinished;
                  const isPast = idx < currentStepIndex || isFinished;
                  const isNext = idx === currentStepIndex + 1 && !isFinished;

                  return (
                      <div 
                          key={idx} 
                          ref={isCurrent ? activeStepRef : null}
                          className={`
                              relative flex gap-4 p-4 rounded-xl text-sm transition-all duration-500 border
                              ${isCurrent 
                                  ? 'bg-coffee-600 text-white border-coffee-600 shadow-xl shadow-coffee-200 scale-105 z-10 ring-2 ring-coffee-400 ring-offset-2' 
                                  : isNext 
                                      ? 'bg-amber-50 text-coffee-900 border-amber-200 opacity-90 translate-x-2'
                                      : isPast
                                          ? 'bg-transparent text-coffee-300 border-transparent opacity-50 grayscale' 
                                          : 'bg-white text-coffee-500 border-transparent opacity-60'
                              }
                          `}
                      >
                          {/* Time Indicator */}
                          <div className={`font-mono font-bold w-12 shrink-0 flex flex-col items-center justify-center rounded-lg transition-colors ${isCurrent ? 'bg-white/20 text-white' : 'bg-coffee-50 text-coffee-400'}`}>
                              <span>{formatTime(step.timeStart)}</span>
                          </div>

                          <div className="flex-1 flex flex-col justify-center">
                              <div className="flex items-center gap-2">
                                  {isNext && (
                                    <span className="animate-pulse text-[10px] uppercase font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                                      Next <ArrowRight size={8} />
                                    </span>
                                  )}
                                  <span className={`font-bold text-base block ${isCurrent ? 'text-white' : 'text-coffee-800'}`}>{step.action}</span>
                              </div>
                              <span className={`block mt-1 ${isCurrent ? 'text-coffee-100' : 'text-coffee-500'}`}>{step.description}</span>
                          </div>
                          
                          {step.waterAmount && (
                              <div className={`font-medium tabular-nums self-center ${isCurrent ? 'text-white' : 'text-coffee-600'}`}>
                                  {step.waterAmount}g
                              </div>
                          )}
                          
                          {isCurrent && (
                              <div className="absolute right-2 top-2">
                                 <span className="relative flex h-3 w-3">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
                                </span>
                              </div>
                          )}
                      </div>
                  );
              })}
           </div>
        </div>
      </div>
    </div>
  );
};

export default BrewTimer;
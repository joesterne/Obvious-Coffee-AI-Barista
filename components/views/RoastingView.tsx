import React, { memo } from 'react';
import { Printer, Flame, Factory, Check, Globe } from 'lucide-react';
import RoastingDiagram from '../RoastingDiagram';

const RoastingView = () => (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <div className="mb-10 text-center relative">
        <button 
            onClick={() => window.print()}
            className="absolute right-0 top-0 text-coffee-400 hover:text-coffee-800 p-2 rounded-full hover:bg-coffee-50 transition-colors no-print"
            title="Print Guide"
        >
            <Printer size={20} />
        </button>
        <h2 className="text-3xl font-brand font-bold text-coffee-950 mb-2 uppercase tracking-wide">The Roast Masterclass</h2>
        <p className="text-coffee-600">Understand the journey from green seed to roasted bean.</p>
      </div>

      {/* Visual Roast Stages Gallery */}
      <div className="mb-12 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="group relative rounded-xl overflow-hidden aspect-square shadow-sm border border-coffee-100">
            <img 
                src="https://images.unsplash.com/photo-1524350876685-274059332603?auto=format&fit=crop&w=400&q=80" 
                alt="Green Coffee Beans" 
                className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                <span className="text-white font-bold text-sm tracking-wider uppercase">1. Green</span>
            </div>
        </div>
        <div className="group relative rounded-xl overflow-hidden aspect-square shadow-sm border border-coffee-100">
            <img 
                src="https://images.unsplash.com/photo-1611317546497-b25867142c22?auto=format&fit=crop&w=400&q=80" 
                alt="Yellowing Coffee Beans" 
                className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700 sepia-[.3] brightness-110" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                <span className="text-white font-bold text-sm tracking-wider uppercase">2. Drying</span>
            </div>
        </div>
        <div className="group relative rounded-xl overflow-hidden aspect-square shadow-sm border border-coffee-100">
            <img 
                src="https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=400&q=80" 
                alt="Medium Roast Coffee" 
                className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                <span className="text-white font-bold text-sm tracking-wider uppercase">3. Medium</span>
            </div>
        </div>
        <div className="group relative rounded-xl overflow-hidden aspect-square shadow-sm border border-coffee-100">
            <img 
                src="https://images.unsplash.com/photo-1610632380989-680fe40816c6?auto=format&fit=crop&w=400&q=80" 
                alt="Dark Roast Coffee" 
                className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                <span className="text-white font-bold text-sm tracking-wider uppercase">4. Dark</span>
            </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-coffee-100 p-4 mb-8 break-inside-avoid max-w-lg mx-auto">
        <h3 className="text-base font-bold text-coffee-800 mb-2 flex items-center gap-2"><Flame size={16} className="text-coffee-500" /> The Roasting Curve</h3>
        <div className="w-full h-24 mb-3 bg-coffee-50 rounded-lg p-2"><RoastingDiagram type="stages" /></div>
        <div className="grid grid-cols-3 gap-2 text-[10px]">
           <div className="p-2 rounded bg-green-50/50 border border-green-100">
                <h4 className="font-bold text-coffee-800 mb-0.5">1. Drying</h4>
                <p className="text-coffee-500 leading-tight">Moisture leaves. Green to yellow.</p>
           </div>
           <div className="p-2 rounded bg-amber-50/50 border border-amber-100">
                <h4 className="font-bold text-coffee-800 mb-0.5">2. Maillard</h4>
                <p className="text-coffee-500 leading-tight">Browning. Toast & caramel notes.</p>
           </div>
           <div className="p-2 rounded bg-coffee-50/50 border border-coffee-100">
                <h4 className="font-bold text-coffee-800 mb-0.5">3. Develop</h4>
                <p className="text-coffee-500 leading-tight">First crack. Flavor balance.</p>
           </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-8">
         <div className="bg-white rounded-2xl shadow-sm border border-coffee-100 p-6 flex flex-col break-inside-avoid">
            <div className="flex items-center gap-3 mb-4"><div className="p-2 bg-coffee-100 rounded-lg text-coffee-800"><Factory size={20} /></div><h3 className="font-bold text-lg text-coffee-800">Drum Roasting</h3></div>
            <div className="h-40 w-full mb-4 bg-coffee-50 rounded-xl p-4"><RoastingDiagram type="drum" /></div>
            <div className="flex-1">
               <p className="text-coffee-600 text-sm mb-4"><strong>Mechanism:</strong> Conduction & Convection. Beans tumble in a heated spinning drum.</p>
               <ul className="space-y-2 text-sm text-coffee-500"><li className="flex items-start gap-2"><Check size={14} className="mt-1 text-coffee-400" /> Produces a heavy, rich body.</li></ul>
            </div>
         </div>
         <div className="bg-white rounded-2xl shadow-sm border border-coffee-100 p-6 flex flex-col break-inside-avoid">
            <div className="flex items-center gap-3 mb-4"><div className="p-2 bg-blue-100 rounded-lg text-blue-800"><Flame size={20} /></div><h3 className="font-bold text-lg text-coffee-800">Fluid Bed</h3></div>
            <div className="h-40 w-full mb-4 bg-coffee-50 rounded-xl p-4"><RoastingDiagram type="fluid_bed" /></div>
            <div className="flex-1">
               <p className="text-coffee-600 text-sm mb-4"><strong>Mechanism:</strong> Pure Convection. Beans float on a bed of hot air.</p>
               <ul className="space-y-2 text-sm text-coffee-500"><li className="flex items-start gap-2"><Check size={14} className="mt-1 text-coffee-400" /> Highlights bright acidity and clean flavors.</li></ul>
            </div>
         </div>
      </div>

      <div className="bg-gradient-to-br from-coffee-800 to-coffee-900 rounded-2xl p-8 text-white break-inside-avoid">
         <div className="flex items-center gap-3 mb-6"><Globe size={24} className="text-coffee-200" /><h3 className="text-2xl font-brand font-bold uppercase">Nature vs. Nurture</h3></div>
         <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
               <h4 className="text-lg font-bold text-coffee-100 mb-2 border-b border-coffee-700 pb-2">Country of Origin (Nature)</h4>
               <p className="text-coffee-200 text-sm mb-4 leading-relaxed">This is the DNA of the coffee. The variety, soil, altitude, and processing method determine the <em>potential</em> flavors available.</p>
            </div>
            <div>
               <h4 className="text-lg font-bold text-coffee-100 mb-2 border-b border-coffee-700 pb-2">Roast Profile (Nurture)</h4>
               <p className="text-coffee-200 text-sm mb-4 leading-relaxed">The roaster decides how to express those flavors. They can highlight the fruitiness (light roast) or mask it with roastiness (dark roast).</p>
            </div>
         </div>
      </div>
    </div>
);

export default memo(RoastingView);
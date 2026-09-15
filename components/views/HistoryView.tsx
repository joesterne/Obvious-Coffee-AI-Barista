import React from 'react';
import { View, Recipe } from '../../types';
import { Trash2, Droplets, ArrowRight, Printer } from 'lucide-react';

interface HistoryViewProps {
  historyItems: Recipe[];
  handleClearHistory: () => void;
  handleLoadHistoryItem: (item: Recipe) => void;
  setCurrentView: (view: View) => void;
}

const HistoryView: React.FC<HistoryViewProps> = ({ historyItems, handleClearHistory, handleLoadHistoryItem, setCurrentView }) => (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
           <h2 className="text-3xl font-brand font-bold text-coffee-950 uppercase tracking-wide">Brew History</h2>
           <p className="text-coffee-600">Your recent generations.</p>
        </div>
        <div className="flex items-center gap-2 no-print">
            {historyItems.length > 0 && (
                <button 
                    onClick={() => window.print()}
                    className="flex items-center gap-2 text-coffee-600 hover:text-coffee-900 px-3 py-2 rounded-lg hover:bg-coffee-100 transition-colors"
                    title="Print History"
                >
                    <Printer size={18} /> <span className="hidden sm:inline">Print</span>
                </button>
            )}
            {historyItems.length > 0 && (
            <button onClick={handleClearHistory} className="flex items-center gap-2 text-red-500 hover:text-red-700 text-sm font-medium px-3 py-2 rounded-lg hover:bg-red-50 transition-colors">
                <Trash2 size={16} /> Clear History
            </button>
            )}
        </div>
      </div>
      {historyItems.length === 0 ? (
          <div className="text-center py-20 bg-coffee-50/50 rounded-2xl border border-dashed border-coffee-200">
              <Droplets size={48} className="mx-auto text-coffee-300 mb-4" />
              <h3 className="text-xl font-medium text-coffee-800">No brewing history</h3>
              <p className="text-coffee-500 mb-6">Generated recipes will automatically appear here.</p>
              <button onClick={() => setCurrentView(View.BREW_GUIDE)} className="bg-coffee-600 text-white px-6 py-2 rounded-full font-bold hover:bg-coffee-700 transition-colors">
                  Generate a Recipe
              </button>
          </div>
      ) : (
          <div className="space-y-4">
              {historyItems.map((item) => (
                  <div key={item.id} className="bg-white p-4 rounded-xl shadow-sm border border-coffee-100 flex items-center justify-between hover:border-coffee-300 transition-all group break-inside-avoid">
                      <div className="flex items-center gap-4 overflow-hidden">
                          <div className="bg-coffee-50 p-3 rounded-lg text-coffee-600 flex-shrink-0"><Droplets size={20} /></div>
                          <div className="min-w-0">
                              <h3 className="font-brand font-bold text-coffee-900 uppercase truncate">{item.method}</h3>
                              <p className="text-xs text-coffee-500 truncate">{item.description}</p>
                              <div className="flex gap-3 mt-1 text-[10px] text-coffee-400 font-mono uppercase">
                                  <span>{new Date(item.dateSaved || 0).toLocaleString()}</span>
                                  <span>{item.coffeeAmount}g / {item.waterAmount}g</span>
                              </div>
                          </div>
                      </div>
                      <button onClick={() => handleLoadHistoryItem(item)} className="p-2 text-coffee-500 hover:text-coffee-800 hover:bg-coffee-50 rounded-full transition-colors no-print">
                         <ArrowRight size={20} />
                      </button>
                  </div>
              ))}
          </div>
      )}
    </div>
);

export default HistoryView;

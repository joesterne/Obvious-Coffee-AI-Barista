import React from 'react';
import { FavoriteItem, Recipe, LatteArtPattern } from '../../types';
import { Heart, Trash2, Droplets, Palette, Calendar, ArrowRight, Printer } from 'lucide-react';

interface FavoritesViewProps {
  savedItems: FavoriteItem[];
  handleDeleteItem: (id: string, e?: React.MouseEvent) => void;
  handleLoadFavorite: (item: FavoriteItem) => void;
}

const FavoritesView: React.FC<FavoritesViewProps> = ({ savedItems, handleDeleteItem, handleLoadFavorite }) => (
    <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="mb-8 flex justify-between items-end">
            <div>
                <h2 className="text-3xl font-brand font-bold text-coffee-950 uppercase tracking-wide">Your Favorite Brews & Guides</h2>
                <p className="text-coffee-600">Revisit your best cups and tutorials.</p>
            </div>
            {savedItems.length > 0 && (
                <button 
                    onClick={() => window.print()}
                    className="flex items-center gap-2 text-coffee-600 hover:text-coffee-900 px-3 py-2 rounded-lg hover:bg-coffee-100 transition-colors no-print"
                >
                    <Printer size={18} /> Print Favorites
                </button>
            )}
        </div>
        {savedItems.length === 0 ? (
            <div className="text-center py-20 bg-coffee-50/50 rounded-2xl border border-dashed border-coffee-200">
                <Heart size={48} className="mx-auto text-coffee-300 mb-4" />
                <h3 className="text-xl font-medium text-coffee-800">No saved favorites yet</h3>
                <p className="text-coffee-500 mb-6">Create a recipe or browse latte art guides to save them.</p>
            </div>
        ) : (
            <div className="grid md:grid-cols-2 gap-6">
                {savedItems.map((saved) => {
                    const isRecipe = saved.type === 'recipe';
                    return (
                      <div key={saved.id} className="bg-white p-6 rounded-2xl shadow-sm border border-coffee-100 hover:shadow-md transition-all group relative break-inside-avoid">
                          <div className="flex justify-between items-start mb-4">
                              <div className="flex items-center gap-2">
                                  {isRecipe ? <Droplets size={16} className="text-coffee-400"/> : <Palette size={16} className="text-coffee-400"/>}
                                  <div>
                                      <h3 className="text-xl font-brand font-bold text-coffee-900 uppercase">{isRecipe ? (saved as Recipe).method : (saved as LatteArtPattern).name}</h3>
                                      <div className="text-xs font-mono text-coffee-500 mt-1 flex items-center gap-1">
                                          <Calendar size={12} />
                                          {saved.dateSaved ? new Date(saved.dateSaved).toLocaleDateString() : 'Unknown Date'}
                                      </div>
                                  </div>
                              </div>
                              <button onClick={(e) => handleDeleteItem(saved.id!, e)} className="p-2 text-coffee-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors no-print">
                                  <Trash2 size={18} />
                              </button>
                          </div>
                          <p className="text-coffee-600 text-sm line-clamp-2 mb-4 h-10">{saved.description}</p>
                          <button onClick={() => handleLoadFavorite(saved)} className="w-full bg-coffee-50 text-coffee-800 py-2 rounded-lg font-medium hover:bg-coffee-100 flex items-center justify-center gap-2 group-hover:bg-coffee-600 group-hover:text-white transition-colors no-print">
                              {isRecipe ? "Brew This Recipe" : "View Tutorial"} <ArrowRight size={16} />
                          </button>
                      </div>
                    );
                })}
            </div>
        )}
    </div>
);

export default FavoritesView;

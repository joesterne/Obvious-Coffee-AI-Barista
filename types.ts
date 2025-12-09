export enum View {
  HOME = 'HOME',
  BREW_GUIDE = 'BREW_GUIDE',
  FLAVOR_EXPLORER = 'FLAVOR_EXPLORER',
  TUTOR = 'TUTOR',
  VIDEO_STUDIO = 'VIDEO_STUDIO',
  FAVORITES = 'FAVORITES',
  ROASTING = 'ROASTING',
  LATTE_ART = 'LATTE_ART',
}

export interface CoffeeProfile {
  origin: string;
  roastLevel: 'Light' | 'Medium' | 'Dark';
  process?: 'Washed' | 'Natural' | 'Honey' | 'Experimental';
  tastingNotes: string[];
}

export interface BrewStep {
  timeStart: number; // seconds
  duration: number; // seconds
  action: string;
  description: string;
  waterAmount?: number; // cumulative water amount in grams
}

export interface Recipe {
  type: 'recipe';
  id?: string; // Optional for saved recipes
  dateSaved?: number; // Optional timestamp
  method: string;
  coffeeAmount: number; // grams
  waterAmount: number; // grams
  waterTemp: number; // celsius
  grindSize: string;
  ratio: string;
  steps: BrewStep[];
  description: string;
  flavorExpectation: string;
}

export interface LatteArtPattern {
  type: 'latte_art';
  id: string;
  dateSaved?: number;
  name: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  description: string;
  steps: string[];
  videoPrompt: string;
  image: string; // Placeholder/Thumbnail URL
}

export type FavoriteItem = Recipe | LatteArtPattern;

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
  timestamp: number;
}

export interface MethodDetails {
  id: string;
  name: string;
  image: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  body: 'Light' | 'Medium' | 'Heavy';
  description: string;
}
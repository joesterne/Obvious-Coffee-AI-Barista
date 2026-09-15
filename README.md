# Obvious Coffee AI Barista

The Obvious choice for better brewing. AI-powered sensory guidance, recipe generation, and roasting education. 

This application serves as a comprehensive tool for coffee enthusiasts, leveraging Google's Gemini AI models to provide personalized coffee brewing recipes, flavor analyses, and interactive tutorials.

## Features

- ☕ **AI Recipe Generation**: Dial in your perfect cup by providing your bean's origin, roast level, process, and tasting notes. The AI will generate a tailored recipe with precise measurements, grind size, and step-by-step instructions.
- 🎯 **Flavor Emphasis**: Specifically target and highlight your favorite flavor notes (e.g., Chocolate, Berry, Jasmine) and the AI will adjust your brewing variables to maximize those characteristics.
- 🧠 **Flavor Explorer**: Understand the chemistry behind your cup. Get detailed, educational breakdowns of why specific origins and roasts produce certain flavor profiles.
- ⏱️ **Interactive Brew Timer**: Built-in step-by-step timer that directly integrates with your generated or saved AI recipes.
- 🎓 **AI Barista Tutor**: A dedicated chat assistant to help you troubleshoot sour/bitter extractions, understand extraction theory, and improve your daily brew.
- 🎥 **Video Studio & Latte Art**: Generate instructional video previews for specific brewing techniques or latte art patterns using generative AI video capabilities.
- 💾 **Local Persistence**: Save your favorite recipes, tutorial guides, and history using offline-first local storage.

## Tech Stack

- **Frontend Framework**: React 19 + Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **AI Integration**: Google Gen AI SDK (`@google/genai`) for text, chat, and video generation

## Getting Started

### Prerequisites
- Node.js (v18+)
- A Google Gemini API Key

### Installation

1. Install the dependencies:
   ```bash
   npm install
   ```

2. Configure your environment variables:
   Create a `.env.local` file in the root directory and add your API key:
   ```env
   GEMINI_API_KEY=your_api_key_here
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## Architecture & Performance
This application features a highly modular and optimized architecture:
- **Modular Component Structure**: Clean separation of concerns with distinct views (`HomeView`, `BrewGuideView`, `LatteArtView`, etc.) extracted into dedicated files.
- **Memoization & Stability**: Heavy usage of `React.memo`, `useCallback`, and `useMemo` to prevent unnecessary re-renders of static UI components and complex JSX blocks.
- **Strict Typing**: Full TypeScript adoption with robust interfaces for recipes, coffee profiles, and latte art patterns.

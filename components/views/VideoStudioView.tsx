import React, { useState, useRef, memo } from 'react';
import * as GeminiService from '../../services/geminiService';
import { ensureApiKey } from '../../utils/auth';
import { Upload, Film, Loader2 } from 'lucide-react';

const VideoStudioView: React.FC = () => {
  const [videoPrompt, setVideoPrompt] = useState('Cinematic close-up of coffee brewing, steam rising, warm lighting, 4k');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [selectedImagePreview, setSelectedImagePreview] = useState<string | null>(null);
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);
  const [videoLoadingMessage, setVideoLoadingMessage] = useState('Initializing Veo...');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (ev) => {
        setSelectedImagePreview(ev.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerateVideo = async () => {
    if (!selectedImage) {
      alert("Please upload an image first.");
      return;
    }
    if (!(await ensureApiKey())) return;

    setIsGeneratingVideo(true);
    setGeneratedVideoUrl(null);
    setVideoLoadingMessage("Analyzing image composition...");
    
    const messages = [
      "Selecting the finest origin pixels...",
      "Heating up the neural boiler...",
      "Grinding the frame buffer...",
      "Pouring digital latte art...",
      "Polishing the portafilter...",
      "Almost ready to serve..."
    ];
    let msgIdx = 0;
    const interval = setInterval(() => {
      setVideoLoadingMessage(messages[msgIdx % messages.length]);
      msgIdx++;
    }, 4000);

    try {
      const url = await GeminiService.generateBrewVideo(selectedImage, videoPrompt);
      setGeneratedVideoUrl(url);
    } catch (e) {
      console.error(e);
      alert("Video generation failed. Please check your API key and try again.");
    } finally {
      clearInterval(interval);
      setIsGeneratingVideo(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <div className="mb-8">
         <h2 className="text-3xl font-brand font-bold text-coffee-950 uppercase tracking-wide">AI Video Studio</h2>
         <p className="text-coffee-600">Visualize your brew with Veo.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-6">
           {/* Step 1: Image Upload */}
           <div className="bg-white p-6 rounded-2xl shadow-sm border border-coffee-100">
              <h3 className="font-bold text-coffee-800 mb-4 flex items-center gap-2">
                <span className="bg-coffee-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">1</span>
                Upload Reference
              </h3>
              
              <div 
                onClick={() => fileInputRef.current?.click()}
                className={`
                   border-2 border-dashed rounded-xl h-48 flex flex-col items-center justify-center cursor-pointer transition-all
                   ${selectedImagePreview ? 'border-coffee-300 bg-coffee-50' : 'border-coffee-200 hover:border-coffee-400 hover:bg-coffee-50'}
                `}
              >
                 {selectedImagePreview ? (
                   <img src={selectedImagePreview} alt="Preview" className="h-full w-full object-contain p-2" />
                 ) : (
                   <div className="text-center p-4">
                      <Upload className="mx-auto text-coffee-300 mb-2" />
                      <p className="text-coffee-500 text-sm font-medium">Click to upload photo</p>
                      <p className="text-coffee-400 text-xs mt-1">PNG or JPG</p>
                   </div>
                 )}
                 <input 
                   ref={fileInputRef}
                   type="file" 
                   accept="image/*" 
                   onChange={handleImageSelect}
                   className="hidden"
                 />
              </div>
           </div>

           {/* Step 2: Prompt */}
           <div className="bg-white p-6 rounded-2xl shadow-sm border border-coffee-100">
              <h3 className="font-bold text-coffee-800 mb-4 flex items-center gap-2">
                <span className="bg-coffee-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">2</span>
                Describe Scene
              </h3>
              <textarea
                value={videoPrompt}
                onChange={(e) => setVideoPrompt(e.target.value)}
                className="w-full p-4 bg-coffee-50 border border-coffee-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-coffee-400 min-h-[120px] text-coffee-800"
                placeholder="Describe camera movement, lighting, and action..."
              />
              <button 
                onClick={handleGenerateVideo}
                disabled={isGeneratingVideo || !selectedImage}
                className={`w-full mt-4 py-3 rounded-full font-bold flex items-center justify-center gap-2 transition-all shadow-lg ${
                  isGeneratingVideo || !selectedImage
                  ? 'bg-coffee-200 text-coffee-400 cursor-not-allowed'
                  : 'bg-coffee-600 hover:bg-coffee-700 text-white hover:scale-105'
                }`}
              >
                {isGeneratingVideo ? (
                  <>
                     <Loader2 className="animate-spin" /> Generating...
                  </>
                ) : (
                  <>
                     <Film size={20} /> Generate Video
                  </>
                )}
              </button>
           </div>
        </div>

        {/* Video Output */}
        <div className="bg-black rounded-2xl overflow-hidden shadow-2xl min-h-[400px] flex items-center justify-center relative">
           {isGeneratingVideo && (
              <div className="text-center z-10 p-6">
                 <Loader2 className="animate-spin text-coffee-400 mx-auto mb-4 w-12 h-12" />
                 <p className="text-white font-medium text-lg animate-pulse">{videoLoadingMessage}</p>
                 <p className="text-white/40 text-sm mt-2">This may take a minute...</p>
              </div>
           )}
           
           {!isGeneratingVideo && generatedVideoUrl && (
              <video 
                src={generatedVideoUrl} 
                controls 
                autoPlay 
                loop 
                className="w-full h-full object-contain"
              />
           )}

           {!isGeneratingVideo && !generatedVideoUrl && (
              <div className="text-center text-white/30 p-8">
                 <Film size={64} className="mx-auto mb-4 opacity-50" />
                 <p className="text-lg font-medium">Ready to render</p>
                 <p className="text-sm mt-2 max-w-xs mx-auto">Upload an image and click generate to create a Veo video.</p>
              </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default memo(VideoStudioView);
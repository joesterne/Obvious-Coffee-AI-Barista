import React, { useState, useRef, useEffect, memo } from 'react';
import { ChatMessage } from '../../types';
import * as GeminiService from '../../services/geminiService';
import { MessageSquare, Send } from 'lucide-react';

const TutorView: React.FC = () => {
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isChatting, setIsChatting] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const handleChatSend = async () => {
    if (!chatInput.trim()) return;
    const userMsg: ChatMessage = { role: 'user', content: chatInput, timestamp: Date.now() };
    setChatHistory(prev => [...prev, userMsg]);
    setChatInput('');
    setIsChatting(true);

    try {
      const apiHistory = chatHistory.map(m => ({ role: m.role, content: m.content }));
      apiHistory.push({ role: 'user', content: userMsg.content });
      const responseText = await GeminiService.getTutorResponse(apiHistory, userMsg.content);
      setChatHistory(prev => [...prev, { role: 'model', content: responseText, timestamp: Date.now() }]);
    } catch (e) {
      console.error(e);
    } finally {
      setIsChatting(false);
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  return (
    <div className="max-w-2xl mx-auto px-6 py-8 h-[calc(100vh-80px)] flex flex-col">
      <div className="mb-6 flex-shrink-0">
        <h2 className="text-3xl font-brand font-bold text-coffee-950 uppercase tracking-wide">Barista Tutor</h2>
        <p className="text-coffee-600">Expert advice on demand.</p>
      </div>

      <div className="flex-1 bg-white rounded-2xl shadow-sm border border-coffee-100 overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
           {chatHistory.length === 0 && (
              <div className="text-center py-10 text-coffee-400">
                 <MessageSquare size={48} className="mx-auto mb-4 opacity-50" />
                 <p>Ask me about grind size, extraction issues, or gear recommendations!</p>
              </div>
           )}
           {chatHistory.map((msg, i) => (
             <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
               <div className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed ${
                 msg.role === 'user' 
                 ? 'bg-coffee-600 text-white rounded-tr-none' 
                 : 'bg-coffee-50 text-coffee-800 rounded-tl-none'
               }`}>
                 {msg.content}
               </div>
             </div>
           ))}
           {isChatting && (
             <div className="flex justify-start">
               <div className="bg-coffee-50 p-4 rounded-2xl rounded-tl-none flex gap-1">
                 <span className="w-2 h-2 bg-coffee-400 rounded-full animate-bounce"></span>
                 <span className="w-2 h-2 bg-coffee-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                 <span className="w-2 h-2 bg-coffee-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
               </div>
             </div>
           )}
           <div ref={chatEndRef} />
        </div>
        
        <div className="p-4 border-t border-coffee-100 bg-coffee-50/50">
           <div className="flex gap-2">
             <input
               type="text"
               value={chatInput}
               onChange={(e) => setChatInput(e.target.value)}
               onKeyDown={(e) => e.key === 'Enter' && handleChatSend()}
               placeholder="Why is my coffee bitter?"
               className="flex-1 p-3 border border-coffee-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-coffee-400"
             />
             <button 
               onClick={handleChatSend}
               disabled={!chatInput.trim() || isChatting}
               className="bg-coffee-600 text-white p-3 rounded-xl hover:bg-coffee-700 disabled:opacity-50 transition-colors"
             >
               <Send size={20} />
             </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default memo(TutorView);
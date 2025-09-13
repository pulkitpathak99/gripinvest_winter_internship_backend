// frontend/components/chatbot/Chatbot.tsx
"use client";
import { useState } from 'react';
import { useChatbotStore } from '@/stores/chatbotStore';
import { X, Send, Bot } from 'lucide-react';
import api from '@/lib/api';
import { usePathname } from 'next/navigation';

export default function Chatbot() {
  const { isOpen, closeChat } = useChatbotStore();
  const [messages, setMessages] = useState<{ role: 'user' | 'model'; parts: string }[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMessage = { role: 'user' as const, parts: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const history = messages.map(msg => ({ role: msg.role, parts: msg.parts }));
      const response = await api.post('/ai/chat', { 
        history, 
        message: input,
        context: { path: pathname } // <-- Sending context!
      });
      const aiMessage = { role: 'model' as const, parts: response.data.response };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage = { role: 'model' as const, parts: "Sorry, I'm having trouble connecting right now." };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-4 right-4 w-96 h-[600px] bg-slate-900 border border-slate-700 rounded-xl shadow-2xl flex flex-col z-50">
      <header className="p-4 border-b border-slate-700 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Bot className="text-blue-400" />
          <h3 className="text-lg font-semibold text-white">Finley, AI Analyst</h3>
        </div>
        <button onClick={closeChat} className="text-gray-400 hover:text-white"><X /></button>
      </header>
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <p className={`max-w-xs px-4 py-2 rounded-2xl ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-slate-700 text-gray-200 rounded-bl-none'}`}>
              {msg.parts}
            </p>
          </div>
        ))}
        {isLoading && <p className="text-center text-gray-400">Finley is thinking...</p>}
      </div>
      <footer className="p-4 border-t border-slate-700">
        <div className="flex items-center gap-2">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about your portfolio..." 
            className="flex-1 bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button onClick={handleSend} className="bg-blue-600 p-2 rounded-lg text-white hover:bg-blue-700"><Send /></button>
        </div>
      </footer>
    </div>
  );
}
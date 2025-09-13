// frontend/components/chatbot/ChatbotTrigger.tsx
"use client";

import { useChatbotStore } from '@/stores/chatbotStore';
import { MessageCircle } from 'lucide-react';

export default function ChatbotTrigger() {
  const { toggleChat } = useChatbotStore();
  
  return (
    <button 
      onClick={toggleChat} 
      className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-gray-300 rounded-full hover:bg-slate-700 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      <MessageCircle size={20} />
      <span className="text-sm font-medium">Chat with Finley</span>
    </button>
  );
}
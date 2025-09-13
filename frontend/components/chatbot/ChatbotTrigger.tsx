// frontend/components/chatbot/ChatbotTrigger.tsx
"use client";
import { useChatbotStore } from '@/stores/chatbotStore';
import { MessageCircle } from 'lucide-react';

export default function ChatbotTrigger() {
  const { toggleChat } = useChatbotStore();
  return (
    <button onClick={toggleChat} className="p-2 rounded-full hover:bg-slate-800 transition-colors">
      <MessageCircle size={22} />
    </button>
  );
}
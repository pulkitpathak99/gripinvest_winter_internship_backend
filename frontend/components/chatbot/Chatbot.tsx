"use client";
import { useState, useEffect, useRef } from "react";
import { useChatbotStore } from "@/stores/chatbotStore";
import { X, Send, Bot } from "lucide-react";
import api from "@/lib/api";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import clsx from "clsx";

export default function Chatbot() {
  const { isOpen, closeChat } = useChatbotStore();
  const [messages, setMessages] = useState<
    { role: "user" | "model"; parts: string }[]
  >([
    // Initial message from Finley
    {
      role: "model",
      parts:
        "Hello! I'm Finley, your AI Investment Analyst. How can I help you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Automatically scroll to the latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = { role: "user" as const, parts: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Create the history by removing the last message if it's the user's input
      const history = [...messages, userMessage].slice(0, -1);
      const response = await api.post("/ai/chat", {
        history,
        message: input,
        context: { path: pathname },
      });
      const aiMessage = {
        role: "model" as const,
        parts: response.data.response,
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Chat API error:", error);
      const errorMessage = {
        role: "model" as const,
        parts:
          "Sorry, I'm having trouble connecting right now. Please try again later.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Do not render the component if the store says it's closed
  // AnimatePresence in the layout will handle the exit animation
  if (!isOpen) return null;

  return (
    <motion.div
      className="fixed bottom-4 right-4 w-96 h-[600px] bg-slate-900/80 backdrop-blur-lg border border-slate-700 rounded-xl shadow-2xl flex flex-col z-50"
      // Animation properties for the chat window
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 50, scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      <header className="p-4 border-b border-slate-700 flex justify-between items-center flex-shrink-0">
        <div className="flex items-center gap-3">
          <Bot className="text-blue-400" />
          <h3 className="text-lg font-semibold text-white">
            Finley, AI Analyst
          </h3>
        </div>
        <button onClick={closeChat} className="text-gray-400 hover:text-white">
          <X size={20} />
        </button>
      </header>

      <motion.div
        className="flex-1 p-4 overflow-y-auto space-y-4"
        // Animation container for staggering children
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.08,
            },
          },
        }}
        initial="hidden"
        animate="visible"
      >
        {messages.map((msg, index) => (
          <motion.div
            key={index}
            className={clsx(
              "flex",
              msg.role === "user" ? "justify-end" : "justify-start",
            )}
            // Animation for each individual message
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
          >
            <p
              className={`max-w-xs px-4 py-2 rounded-2xl ${msg.role === "user" ? "bg-blue-600 text-white rounded-br-none" : "bg-slate-700 text-gray-200 rounded-bl-none"}`}
            >
              {msg.parts}
            </p>
          </motion.div>
        ))}
        {isLoading && (
          <motion.div
            className="flex justify-start"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="max-w-xs px-4 py-2 rounded-2xl bg-slate-700 text-gray-400 rounded-bl-none">
              Finley is thinking...
            </p>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </motion.div>

      <footer className="p-4 border-t border-slate-700 flex-shrink-0">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            placeholder="Ask about your portfolio..."
            className="flex-1 bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            className="bg-blue-600 p-2 rounded-lg text-white hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            <Send size={18} />
          </button>
        </div>
      </footer>
    </motion.div>
  );
}

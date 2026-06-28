'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useChat } from '@ai-sdk/react';
import { Send, Loader2, Bot, User, AlertCircle, RefreshCcw } from 'lucide-react';
import { MarkdownRenderer } from './markdown-renderer';

interface AiChatProps {
  chatId: string;
}

export const AiChat: React.FC<AiChatProps> = ({ chatId }) => {
  const {
    messages,
    status,
    sendMessage,
    error,
    regenerate,
  } = useChat({
    // Optional: api isn't valid if the new sdk removed it or we can pass it if it still exists. Let's just omit if it complains, wait it did complain earlier:
    api: process.env.NEXT_PUBLIC_API_URL ? `${process.env.NEXT_PUBLIC_API_URL}/ai/chat` : 'http://localhost:4000/api/ai/chat',
    id: chatId,
    headers: {
      Authorization: typeof window !== 'undefined' ? `Bearer ${localStorage.getItem('accessToken')}` : ''
    }
  } as any);

  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const isLoading = status === 'submitted' || status === 'streaming';

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    
    // We send a message
    sendMessage({
      role: 'user',
      parts: [{ type: 'text', text: input }]
    } as any);
    
    setInput('');
  };

  const getMessageContent = (message: any) => {
    if (message.parts && Array.isArray(message.parts)) {
      return message.parts
        .filter((p: any) => p.type === 'text')
        .map((p: any) => p.text)
        .join('');
    }
    return '';
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-950">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.length === 0 && !isLoading && !error && (
          <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 dark:text-gray-400 space-y-4">
            <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-2">
              <Bot size={32} className="text-blue-500" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">How can I help you today?</h3>
            <p className="text-sm max-w-sm">
              I can assist you with your tasks, analyze projects, or answer questions about your workflow.
            </p>
          </div>
        )}

        {messages.map((message: any) => (
          <div
            key={message.id}
            className={`flex items-start gap-4 ${
              message.role === 'user' ? 'flex-row-reverse' : ''
            }`}
          >
            <div
              className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                message.role === 'user'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'
              }`}
            >
              {message.role === 'user' ? <User size={18} /> : <Bot size={18} />}
            </div>
            
            <div
              className={`max-w-[85%] rounded-2xl px-5 py-4 ${
                message.role === 'user'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 text-gray-900 dark:text-gray-100'
              }`}
            >
              {message.role === 'user' ? (
                <p className="whitespace-pre-wrap leading-relaxed">{getMessageContent(message)}</p>
              ) : (
                <MarkdownRenderer content={getMessageContent(message)} />
              )}
            </div>
          </div>
        ))}

        {isLoading && messages.length > 0 && messages[messages.length - 1].role === 'user' && (
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 flex items-center justify-center">
              <Bot size={18} />
            </div>
            <div className="bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl px-5 py-4">
              <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
            </div>
          </div>
        )}

        {error && (
          <div className="flex flex-col items-center justify-center p-6 mt-4 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 rounded-xl text-center space-y-3">
            <AlertCircle className="w-8 h-8 text-red-500" />
            <div>
              <p className="text-red-800 dark:text-red-400 font-medium">Something went wrong</p>
              <p className="text-sm text-red-600 dark:text-red-500/80 mt-1">{error.message || 'An error occurred while communicating with the AI.'}</p>
            </div>
            <button
              onClick={() => regenerate()}
              className="flex items-center gap-2 px-4 py-2 mt-2 bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/50 text-red-700 dark:text-red-400 rounded-lg transition-colors text-sm font-medium"
            >
              <RefreshCcw size={16} />
              Try again
            </button>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-950">
        <form
          onSubmit={handleSubmit}
          className="relative max-w-4xl mx-auto flex items-center"
        >
          <input
            className="w-full pl-5 pr-14 py-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 focus:border-blue-500 dark:focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-2xl outline-none transition-all text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="absolute right-2 p-2.5 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-200 dark:disabled:bg-gray-800 disabled:text-gray-400 text-white rounded-xl transition-colors"
          >
            {isLoading ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              <Send size={20} className="ml-0.5" />
            )}
          </button>
        </form>
        <div className="text-center mt-3">
          <span className="text-xs text-gray-400 dark:text-gray-500">AI can make mistakes. Consider verifying important information.</span>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { AiChat } from './ai-chat';
import { 
  MessageSquarePlus, 
  PanelRightClose, 
  MessageSquare, 
  History,
  MoreVertical,
  X
} from 'lucide-react';

interface AiSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ChatSession {
  id: string;
  title: string;
  date: string;
}

// Mock initial data since we don't modify backend
const INITIAL_CHATS: ChatSession[] = [
  { id: 'chat-1', title: 'Brainstorm Project X', date: 'Today' },
  { id: 'chat-2', title: 'Bug #402 Analysis', date: 'Yesterday' },
];

export const AiSidebar: React.FC<AiSidebarProps> = ({ isOpen, onClose }) => {
  const [activeChatId, setActiveChatId] = useState<string>('chat-1');
  const [chatHistory, setChatHistory] = useState<ChatSession[]>(INITIAL_CHATS);
  const [showHistory, setShowHistory] = useState(false);

  const handleNewChat = () => {
    const newId = `chat-${Date.now()}`;
    const newChat = { id: newId, title: 'New Conversation', date: 'Just now' };
    setChatHistory([newChat, ...chatHistory]);
    setActiveChatId(newId);
    setShowHistory(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-[400px] bg-white dark:bg-gray-950 border-l border-gray-200 dark:border-gray-800 shadow-2xl flex flex-col z-50 transform transition-transform duration-300 ease-in-out">
      {/* Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center text-white font-semibold">
            AI
          </div>
          <span className="font-semibold text-gray-900 dark:text-gray-100">Workspace AI</span>
        </div>
        
        <div className="flex items-center gap-1">
          <button
            onClick={() => setShowHistory(!showHistory)}
            className={`p-2 rounded-md transition-colors ${
              showHistory 
                ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' 
                : 'text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'
            }`}
            title="Chat History"
          >
            <History size={18} />
          </button>
          <button
            onClick={handleNewChat}
            className="p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 rounded-md transition-colors"
            title="New Chat"
          >
            <MessageSquarePlus size={18} />
          </button>
          <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-1" />
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 rounded-md transition-colors"
            title="Close sidebar"
          >
            <PanelRightClose size={18} />
          </button>
        </div>
      </div>

      <div className="flex-1 relative overflow-hidden flex flex-col">
        {/* History Panel - Slides over the chat if active */}
        <div 
          className={`absolute inset-0 bg-white dark:bg-gray-950 z-10 transition-transform duration-300 ease-in-out ${
            showHistory ? 'translate-x-0' : '-translate-x-full'
          } flex flex-col`}
        >
          <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">Conversation History</h3>
            <button 
              onClick={() => setShowHistory(false)}
              className="p-1.5 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 rounded-md"
            >
              <X size={16} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {chatHistory.map((chat) => (
              <button
                key={chat.id}
                onClick={() => {
                  setActiveChatId(chat.id);
                  setShowHistory(false);
                }}
                className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${
                  activeChatId === chat.id
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-900/50 text-gray-700 dark:text-gray-300'
                }`}
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <MessageSquare size={16} className="flex-shrink-0" />
                  <div className="text-left overflow-hidden">
                    <p className="text-sm font-medium truncate">{chat.title}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">{chat.date}</p>
                  </div>
                </div>
                {activeChatId === chat.id && (
                  <div className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Active Chat UI */}
        <div className="flex-1 flex flex-col bg-white dark:bg-gray-950">
          <AiChat key={activeChatId} chatId={activeChatId} />
        </div>
      </div>
    </div>
  );
};

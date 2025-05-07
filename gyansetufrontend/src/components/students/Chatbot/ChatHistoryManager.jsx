import React, { useState, useEffect } from 'react';
import { X, Search, Calendar, Trash2 } from 'lucide-react';
import ChatAPI from '../../../services/chatAPI';

const ChatHistoryManager = ({ onSelectChat, onNewChat }) => {
  const [chatHistory, setChatHistory] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(null);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    loadChatHistory();
  }, []);
  
  const loadChatHistory = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Use the actual ChatAPI service to get real data
      const history = await ChatAPI.getChatHistory({
        query: searchQuery,
        dateFilter: selectedDate
      });
      
      setChatHistory(history);
    } catch (error) {
      console.error('Error loading chat history:', error);
      setError('Failed to load chat history. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Load chat history when search or date filters change
  useEffect(() => {
    // Add a small delay to prevent too many API calls while typing
    const timer = setTimeout(() => {
      loadChatHistory();
    }, 500);
    
    return () => clearTimeout(timer);
  }, [searchQuery, selectedDate]);
  
  const handleSelectChat = async (chatId) => {
    try {
      setIsLoading(true);
      const chatData = await ChatAPI.getChat(chatId);
      onSelectChat(chatData);
    } catch (error) {
      console.error('Error loading chat:', error);
      setError(`Failed to load chat: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDeleteChat = async (e, chatId) => {
    e.stopPropagation(); // Prevent triggering the chat selection
    
    if (window.confirm('Are you sure you want to delete this chat?')) {
      try {
        await ChatAPI.deleteChat(chatId);
        // Refresh the chat history after deletion
        loadChatHistory();
      } catch (error) {
        console.error('Error deleting chat:', error);
        setError(`Failed to delete chat: ${error.message}`);
      }
    }
  };
  
  // Filter chats based on search query and selected date
  const filteredChats = chatHistory.filter(chat => {
    // If search query provided, filter based on title and preview
    if (searchQuery) {
      const matchesSearch = 
        chat.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        (chat.preview && chat.preview.toLowerCase().includes(searchQuery.toLowerCase()));
      
      if (!matchesSearch) return false;
    }
    
    // Date filtering will be handled by the backend, no need to filter again here
    
    return true;
  });
  
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden h-full flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Chat History</h2>
        
        {/* Search box */}
        <div className="relative mb-4">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search your chats..."
            className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        {/* Date filter tabs */}
        <div className="flex space-x-2 mb-4 overflow-x-auto pb-2">
          <button
            onClick={() => setSelectedDate(selectedDate === 'today' ? null : 'today')}
            className={`px-3 py-1 text-sm rounded-full whitespace-nowrap ${
              selectedDate === 'today' 
                ? 'bg-violet-100 text-violet-700 border border-violet-300' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Today
          </button>
          <button
            onClick={() => setSelectedDate(selectedDate === 'yesterday' ? null : 'yesterday')}
            className={`px-3 py-1 text-sm rounded-full whitespace-nowrap ${
              selectedDate === 'yesterday' 
                ? 'bg-violet-100 text-violet-700 border border-violet-300' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Yesterday
          </button>
          <button
            onClick={() => setSelectedDate(selectedDate === 'week' ? null : 'week')}
            className={`px-3 py-1 text-sm rounded-full whitespace-nowrap ${
              selectedDate === 'week' 
                ? 'bg-violet-100 text-violet-700 border border-violet-300' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            This Week
          </button>
          <button
            onClick={() => setSelectedDate(selectedDate === 'month' ? null : 'month')}
            className={`px-3 py-1 text-sm rounded-full whitespace-nowrap ${
              selectedDate === 'month' 
                ? 'bg-violet-100 text-violet-700 border border-violet-300' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            This Month
          </button>
        </div>
        
        {/* New chat button */}
        <button
          onClick={onNewChat}
          className="w-full py-2 text-sm bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors flex items-center justify-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 5v14M5 12h14" />
          </svg>
          New Chat
        </button>
      </div>
      
      {/* Chat history list */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex justify-center items-center h-32">
            <div className="loader">
              <div className="w-2 h-2 bg-violet-500 rounded-full animate-bounce mx-1" style={{ animationDelay: '0s' }}></div>
              <div className="w-2 h-2 bg-violet-500 rounded-full animate-bounce mx-1" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 bg-violet-500 rounded-full animate-bounce mx-1" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-32 text-red-500 p-4 text-center">
            <span className="text-sm">{error}</span>
            <button 
              className="mt-2 text-xs text-violet-600 hover:text-violet-800"
              onClick={loadChatHistory}
            >
              Try again
            </button>
          </div>
        ) : filteredChats.length > 0 ? (
          filteredChats.map(chat => (
            <div 
              key={chat.id}
              className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
              onClick={() => handleSelectChat(chat.id)}
            >
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <h3 className="font-medium text-gray-900">{chat.title}</h3>
                  <button
                    className="text-gray-400 hover:text-red-500 p-1"
                    onClick={(e) => handleDeleteChat(e, chat.id)}
                    aria-label="Delete chat"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <p className="text-sm text-gray-500 mt-1 line-clamp-2">{chat.preview}</p>
                <div className="flex items-center mt-2 text-xs text-gray-400">
                  <Calendar className="h-3 w-3 mr-1" />
                  <span>{chat.lastMessage}</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-32 text-gray-500 p-4 text-center">
            <span className="text-sm">No chats found</span>
            <p className="text-xs mt-1">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatHistoryManager;
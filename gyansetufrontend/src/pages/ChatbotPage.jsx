import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ChatInterface from '../components/students/Chatbot/ChatInterface';
import ChatHistoryManager from '../components/students/Chatbot/ChatHistoryManager';
import ChatHeader from '../components/students/common/ChatHeader';
import ChatAPI from '../services/chatAPI';

/**
 * ChatbotPage - Main container component for the educational chatbot
 * This component integrates all chatbot-related components and manages their state
 */
const ChatbotPage = () => {
  const [currentChat, setCurrentChat] = useState(null);
  const [showHistory, setShowHistory] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [forceRefresh, setForceRefresh] = useState(false); // Added for forcing re-render of ChatInterface
  
  const { chatId } = useParams();
  const navigate = useNavigate();
  
  // Check API health and load chat if chatId is provided
  useEffect(() => {
    const initialize = async () => {
      try {
        setLoading(true);
        
        // Check if API is reachable
        await ChatAPI.checkHealth();
        
        // If chatId is provided, load the chat
        if (chatId) {
          const chatData = await ChatAPI.getChat(chatId);
          setCurrentChat(chatData);
        }
      } catch (err) {
        console.error('Initialization error:', err);
        setError('Unable to connect to the server. Please check if the backend is running.');
      } finally {
        setLoading(false);
      }
    };
    
    initialize();
  }, [chatId]);
  
  // Function to handle chat selection from history
  const handleSelectChat = (chatData) => {
    setCurrentChat(chatData);
    // Update URL to include selected chat ID
    navigate(`/chatbot/${chatData.id}`);
  };
  
  // Function to start a new chat
  const handleNewChat = () => {
    // Clear current chat
    setCurrentChat(null);
    
    // Reset URL to remove chat ID
    navigate('/chatbot');
    
    // Force re-initialization of the ChatInterface component
    setForceRefresh(prev => !prev);
  };
  
  // Function to toggle history panel visibility (mobile)
  const toggleHistory = () => {
    setShowHistory(prev => !prev);
  };
  
  return (
    <div className="chatbot-page min-h-screen bg-gradient-to-br from-violet-100 via-white to-violet-400 overflow-hidden">
      <div className="flex h-screen p-2 md:p-4">
        {/* Chat History Sidebar - hidden on mobile unless toggled */}
        <div className={`
          ${showHistory ? 'translate-x-0' : '-translate-x-full'} 
          md:translate-x-0 transition-transform duration-300 ease-in-out
          w-full md:w-72 lg:w-80 xl:w-96 fixed md:relative top-0 left-0 h-full z-40
          md:mr-4 md:flex-shrink-0
        `}>
          <ChatHistoryManager 
            onSelectChat={handleSelectChat} 
            onNewChat={handleNewChat}
          />
        </div>
        
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col bg-gray-100 rounded-xl shadow-lg relative md:ml-0">
          {/* Overlay for mobile when history is open */}
          {showHistory && (
            <div 
              className="absolute inset-0 bg-black bg-opacity-50 z-30 md:hidden"
              onClick={() => setShowHistory(false)}
            />
          )}
          
          {/* Header with toggle button for mobile */}
          <ChatHeader 
            currentChat={currentChat} 
            onToggleHistory={toggleHistory}
            onNewChat={handleNewChat}
          />
          
          {/* Main Chat Interface */}
          <div className="flex-1 overflow-hidden bg-gradient-to-r from-violet-50 to-purple-50">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="loader">
                  <div className="w-3 h-3 bg-violet-500 rounded-full animate-bounce mx-1" style={{ animationDelay: '0s' }}></div>
                  <div className="w-3 h-3 bg-violet-500 rounded-full animate-bounce mx-1" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-3 h-3 bg-violet-500 rounded-full animate-bounce mx-1" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center h-full p-4 text-center">
                <h3 className="text-red-500 font-medium text-lg mb-2">Connection Error</h3>
                <p className="text-gray-700">{error}</p>
                <button 
                  className="mt-4 px-4 py-2 bg-violet-500 text-white rounded-lg hover:bg-violet-600 transition-colors"
                  onClick={() => window.location.reload()}
                >
                  Retry
                </button>
              </div>
            ) : (
              <ChatInterface 
                key={`chat-interface-${forceRefresh}`} // Add key based on forceRefresh state
                chat={currentChat} 
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatbotPage;
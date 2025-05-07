import React from 'react';
import { Menu, Book, Share2, Bell, PenSquare } from 'lucide-react';

const ChatHeader = ({ currentChat, onToggleHistory, onNewChat }) => {
  // Function to share the current chat
  const handleShareChat = () => {
    if (!currentChat) return;
    
    // In a real implementation, this would generate a shareable link
    const shareableLink = `${window.location.origin}/chat/${currentChat.id}`;
    
    // For this demo, just copy to clipboard
    navigator.clipboard.writeText(shareableLink)
      .then(() => {
        // Show some feedback to the user
        alert('Chat link copied to clipboard!');
      })
      .catch(err => {
        console.error('Failed to copy link: ', err);
      });
  };
  
  return (
    <header className="p-2 md:p-4 flex items-center justify-between border-b border-gray-200">
      <div className="flex items-center space-x-2">
        <button
          className="p-2 text-gray-500 hover:text-gray-800 md:hidden"
          onClick={onToggleHistory}
          aria-label="Toggle chat history"
        >
          <Menu className="w-5 h-5" />
        </button>
        
        <div className="relative group">
          <button
            className="p-1 md:p-2 bg-white rounded-full text-sm hover:bg-gray-100"
            onClick={onNewChat}
            aria-label="Create new chat"
          >
            <PenSquare className="w-4 h-4 md:w-5 md:h-5 text-violet-600" />
          </button>
          <span className="absolute left-1/2 transform -translate-x-1/2 top-10 bg-white text-black text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-md z-10">
            New chat
          </span>
        </div>
        
        <div className="relative group">
          <button
            className="p-1 md:p-2 bg-white rounded-full text-sm hover:bg-gray-100"
            aria-label="Quiz"
          >
            <Book className="w-4 h-4 md:w-5 md:h-5 text-violet-600" />
          </button>
          <span className="absolute left-1/2 transform -translate-x-1/2 top-10 bg-white text-black text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-md z-10">
            Create quiz
          </span>
        </div>
      </div>
      
      <h1 className="text-lg md:text-xl font-semibold text-violet-800 truncate max-w-[200px] md:max-w-md">
        {currentChat ? currentChat.title : 'Gyansetu'}
      </h1>
      
      <div className="flex items-center">
        <button
          className="p-1 md:p-2 text-gray-500 hover:text-gray-700 relative group"
          onClick={handleShareChat}
          disabled={!currentChat}
          aria-label="Share chat"
        >
          <Share2 className={`w-4 h-4 md:w-5 md:h-5 ${!currentChat ? 'opacity-50' : ''}`} />
          <span className="absolute right-0 top-10 bg-white text-black text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-md z-10">
            Share chat
          </span>
        </button>
        
        <button className="p-1 md:p-2 text-gray-500 hover:text-gray-700 ml-1 md:ml-2 relative group">
          <Bell className="w-4 h-4 md:w-5 md:h-5" />
          <span className="absolute right-0 top-10 bg-white text-black text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-md z-10">
            Notifications
          </span>
        </button>
      </div>
    </header>
  );
};

export default ChatHeader;
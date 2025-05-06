import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const ChatHistory = () => {
  const [chats, setChats] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Mock data - replace this with your actual data fetching logic
  useEffect(() => {
    // This would be replaced with your actual data fetching
    // e.g., from localStorage, a database, or an API
    const mockChats = [
      {
        id: 1,
        title: "Troubleshooting Inconsistent Navigation Behavior",
        lastMessage: "23 minutes ago"
      },
      {
        id: 2,
        title: "Modify Graph to Show Content Counts",
        lastMessage: "37 minutes ago"
      },
      {
        id: 3,
        title: "Troubleshooting Sign-Up Issues",
        lastMessage: "3 hours ago"
      },
      {
        id: 4,
        title: "Troubleshooting Collapsing Navbar",
        lastMessage: "4 hours ago"
      },
      {
        id: 5,
        title: "Expanding Teacher Dashboard Routes in React App",
        lastMessage: "4 hours ago"
      },
      {
        id: 6,
        title: "Responsive Content Section Design",
        lastMessage: "5 hours ago"
      }
    ];
    
    setChats(mockChats);
  }, []);

  // Filter chats based on search query
  const filteredChats = chats.filter(chat => 
    chat.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <div className='bg-gradient-to-br from-violet-400 via-white to-violet-300'>
    <div className="max-w-4xl mx-auto p-4  text-black min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-medium text-violet-700">Your chat history</h1>
        <button className="bg-white text-black px-4 py-2 rounded-lg flex items-center gap-2">
          <span>+</span> New chat
        </button>
      </div>
      
      {/* Search bar */}
      <div className="mb-6 relative">
        <div className="absolute inset-y-0 left-3 flex items-center">
          <svg className="h-5 w-5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          placeholder="Search your chats..."
          className="w-full py-2 pl-10 pr-4 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-600"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      {/* Chat history count */}
      <div className="mb-4 text-sm text-gray-400">
        You have {chats.length} previous chats with Claude <span className="text-blue-400 cursor-pointer">Select</span>
      </div>
      
      {/* Chat history list */}
      <div className="space-y-3">
        {filteredChats.map(chat => (
          <Link to={`/chat/${chat.id}`} key={chat.id}>
            <div className="p-4 bg-gray-300 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer">
              <h2 className="text-lg text-violet-600">{chat.title}</h2>
              <p className="text-sm text-gray-400">Last message {chat.lastMessage}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
    </div>
  );
};

export default ChatHistory;
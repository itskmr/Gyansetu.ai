import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, ThumbsUp, ThumbsDown, Copy, Repeat, Image as ImageIcon, X, ArrowDown, Maximize, Upload, FileText, Camera, Loader, AlertTriangle, Award, ChevronUp, Book } from 'lucide-react';
import MessageFormatter from './MessageFormatter';
import ChatAPI from '../../../services/chatAPI';

// Add custom CSS for horizontal bounce animation
const horizontalBounceStyle = `
  @keyframes bounce-horizontal {
    0%, 100% {
      transform: translateX(0);
      animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
    }
    50% {
      transform: translateX(10px);
      animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
    }
  }
  
  .animate-bounce-x {
    animation: bounce-horizontal 0.6s infinite;
  }
  
  .delay-100 {
    animation-delay: 0.1s;
  }
  
  .delay-200 {
    animation-delay: 0.2s;
  }
`;

const ChatInterface = ({ chat }) => {
  const [messages, setMessages] = useState([{
    id: 1,
    role: 'assistant',
    content: "# Welcome to Gyansetu.ai\n\nI'm your educational assistant. Ask me any question and I'll provide a detailed, structured answer. You can:\n\n* Upload files to ask questions about them\n* Upload images with text for analysis\n* Request image generation for visual explanations\n* Ask for simplified versions of my answers\n* Select marks value for answers that match exam question formats\n\nWhat would you like to learn about today?",
    timestamp: new Date().toISOString(),
  }]);
  
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState([]);
  const [isCreateImageActive, setIsCreateImageActive] = useState(false);
  const [likedMessages, setLikedMessages] = useState(new Set());
  const [dislikedMessages, setDislikedMessages] = useState(new Set());
  const [copiedMessages, setCopiedMessages] = useState(new Set());
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [zoomedImage, setZoomedImage] = useState(null);
  const [processingFiles, setProcessingFiles] = useState(false);
  const [processingImages, setProcessingImages] = useState(false);
  const [imageCount, setImageCount] = useState(0);
  const [connectionError, setConnectionError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [selectedMarks, setSelectedMarks] = useState(null);
  const [showMarksDropdown, setShowMarksDropdown] = useState(false);
  
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const chatContainerRef = useRef(null);
  const marksDropdownRef = useRef(null);
  const navigate = useNavigate();

  // Check server connectivity on load
  useEffect(() => {
    const checkServerConnection = async () => {
      try {
        await ChatAPI.checkHealth();
        setConnectionError(false);
      } catch (error) {
        console.error("Failed to connect to server:", error);
        setConnectionError(true);
      }
    };
    
    checkServerConnection();
  }, [retryCount]);
  
  // If a chat is provided, load its messages
  useEffect(() => {
    if (chat && chat.messages) {
      setMessages(chat.messages);
    }
  }, [chat]);
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  // Add scroll event listener to show/hide scroll button
  useEffect(() => {
    const container = chatContainerRef.current;
    if (!container) return;
    
    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const isScrolledUp = scrollHeight - scrollTop - clientHeight > 100;
      setShowScrollButton(isScrolledUp);
    };
    
    container.addEventListener('scroll', handleScroll);
    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  // Add escape key handler for closing zoomed image
  useEffect(() => {
    const handleEscKey = (e) => {
      if (e.key === 'Escape' && zoomedImage) {
        setZoomedImage(null);
      }
    };
    
    window.addEventListener('keydown', handleEscKey);
    return () => {
      window.removeEventListener('keydown', handleEscKey);
    };
  }, [zoomedImage]);
  
  // Close marks dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (marksDropdownRef.current && !marksDropdownRef.current.contains(e.target)) {
        setShowMarksDropdown(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  
  const handleImageZoom = (imageUrl) => {
    console.log("Zooming image:", imageUrl);
    setZoomedImage(imageUrl);
  };
  
  const closeZoomedImage = () => {
    setZoomedImage(null);
  };

  const retryConnection = () => {
    setRetryCount(prev => prev + 1);
  };
  
  const handleMarksSelection = (marks) => {
    setSelectedMarks(marks);
    setShowMarksDropdown(false);
  };
  
  const toggleMarksDropdown = () => {
    setShowMarksDropdown(prev => !prev);
  };

  const handleCreateQuiz = () => {
    // If there's a topic in the current conversation, extract it
    let suggestedTopic = '';
    
    // Try to get the last assistant message
    const lastAssistantMessage = [...messages]
      .reverse()
      .find(m => m.role === 'assistant');
    
    // If there's a message, extract a topic from the first heading
    if (lastAssistantMessage && lastAssistantMessage.content) {
      // Try to find a heading
      const headingMatch = lastAssistantMessage.content.match(/^#\s+(.*?)$/m);
      if (headingMatch && headingMatch[1]) {
        suggestedTopic = headingMatch[1].trim();
      }
    }
    
    // If no topic from headings, take the last user message
    if (!suggestedTopic) {
      const lastUserMessage = [...messages]
        .reverse()
        .find(m => m.role === 'user');
        
      if (lastUserMessage && lastUserMessage.content) {
        // Take the first few words
        const words = lastUserMessage.content.split(' ');
        suggestedTopic = words.slice(0, Math.min(5, words.length)).join(' ');
      }
    }
    
    // Navigate to quiz creation with suggested topic
    navigate('/quiz/create', { 
      state: { suggestedTopic }
    });
  };
  
  const handleSendMessage = async () => {
    if (!inputValue.trim() && attachedFiles.length === 0) return;
    
    // Check for server connection before sending
    if (connectionError) {
      alert("Cannot connect to server. Please check if the server is running and try again.");
      return;
    }
    
    // Count images in the attached files
    const imageFiles = attachedFiles.filter(file => file.type.includes('image'));
    setImageCount(imageFiles.length);
    
    // Create a message about the files if they are the primary content
    let messageContent = inputValue.trim();
    if (!messageContent && attachedFiles.length > 0) {
      if (imageFiles.length > 0) {
        messageContent = `Please analyze ${imageFiles.length === attachedFiles.length ? 'these' : 'these files including'} ${imageFiles.length} image(s) and tell me about their content${inputValue ? ': ' + inputValue : '.'}`;
      } else {
        messageContent = `Please analyze these ${attachedFiles.length} file(s) and provide information based on their content.`;
      }
    }
    
    // Append marks information to message if selected
    if (selectedMarks) {
      messageContent += ` (${selectedMarks} marks)`;
    }
    
    const newUserMsg = {
      id: Date.now(),
      role: 'user',
      content: messageContent,
      files: attachedFiles,
      timestamp: new Date().toISOString(),
    };
    
    setMessages(prev => [...prev, newUserMsg]);
    setInputValue('');
    setIsLoading(true);
    setProcessingFiles(attachedFiles.length > 0);
    setProcessingImages(imageFiles.length > 0);
    
    try {
      // Use the actual API to send the message
      const chatId = chat ? chat.id : null;
      
      console.log('Sending message with files:', attachedFiles.length, 'including', imageFiles.length, 'images and image generation:', isCreateImageActive, 'marks:', selectedMarks);
      
      const response = await ChatAPI.sendMessage(
        messageContent,
        attachedFiles,
        isCreateImageActive,
        chatId,
        selectedMarks // Pass the selected marks to the API
      );
      
      console.log('API Response:', response);
      setConnectionError(false);
      
      // Process the image URL to make sure it's correct
      let imageUrl = response.imageUrl;
      
      // Log image URL
      console.log('Original Image URL in response:', imageUrl);
      
      // Fix image URL if it exists
      if (imageUrl) {
        // If it's a relative path without a leading slash, add one
        if (!imageUrl.startsWith('/') && !imageUrl.startsWith('http')) {
          imageUrl = '/' + imageUrl;
        }
        
        // If it's a relative path, construct the full URL with the backend base URL
        if (imageUrl.startsWith('/') && !imageUrl.startsWith('//')) {
          // Extract the base URL from your API configuration
          const apiBaseUrl = 'http://localhost:5000'; // Change this to match your backend URL
          imageUrl = apiBaseUrl + imageUrl;
        }
        
        console.log('Fixed image URL:', imageUrl);
      }
      
      const assistantMsg = {
        id: response.messageId || Date.now() + 1,
        role: 'assistant',
        content: response.content,
        imageUrl: imageUrl,
        timestamp: response.timestamp || new Date().toISOString(),
      };
      
      setMessages(prev => [...prev, assistantMsg]);
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Check if it's a connection error
      if (error.isConnectionError) {
        setConnectionError(true);
      }
      
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        role: 'assistant',
        content: "# Sorry\n\n" + (error.isConnectionError 
          ? "I cannot connect to the server right now. Please check if the server is running and try again later."
          : "I'm having trouble processing your request right now. Please try again later."),
        timestamp: new Date().toISOString(),
        isError: true
      }]);
    } finally {
      setIsLoading(false);
      setProcessingFiles(false);
      setProcessingImages(false);
      setImageCount(0);
      setAttachedFiles([]);
      setIsCreateImageActive(false);
      setSelectedMarks(null); // Reset marks selection after sending
    }
  };
  
  const handleSimplifyResponse = async (messageId) => {
    const messageToSimplify = messages.find(m => m.id === messageId);
    if (!messageToSimplify || messageToSimplify.role !== 'assistant') return;
    
    try {
      setIsLoading(true);
      const response = await ChatAPI.simplifyMessage(messageId);
      
      console.log('Simplify Response:', response);
      
      // Replace the message with its simplified version
      setMessages(prev => prev.map(msg => 
        msg.id === messageId 
          ? { 
              ...msg, 
              content: response.content,
              simplified: true
            } 
          : msg
      ));
    } catch (error) {
      console.error('Error simplifying message:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleFileUpload = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      
      // Log each file for debugging
      newFiles.forEach((file, index) => {
        console.log(`Selected file ${index + 1}/${newFiles.length}:`, file.name, file.type, file.size);
      });
      
      setAttachedFiles(prev => [...prev, ...newFiles]);
    }
  };
  
  const removeAttachedFile = (fileToRemove) => {
    setAttachedFiles(prev => prev.filter(file => file !== fileToRemove));
  };
  
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  const toggleLike = async (messageId) => {
    setLikedMessages(prev => {
      const newSet = new Set(prev);
      if (newSet.has(messageId)) {
        newSet.delete(messageId);
      } else {
        newSet.add(messageId);
        if (dislikedMessages.has(messageId)) {
          setDislikedMessages(prevDislikes => {
            const newDislikes = new Set(prevDislikes);
            newDislikes.delete(messageId);
            return newDislikes;
          });
        }
      }
      return newSet;
    });
    
    try {
      // Send feedback to API
      await ChatAPI.submitFeedback(messageId, 'like');
    } catch (error) {
      console.error('Error submitting feedback:', error);
    }
  };
  
  const toggleDislike = async (messageId) => {
    setDislikedMessages(prev => {
      const newSet = new Set(prev);
      if (newSet.has(messageId)) {
        newSet.delete(messageId);
      } else {
        newSet.add(messageId);
        if (likedMessages.has(messageId)) {
          setLikedMessages(prevLikes => {
            const newLikes = new Set(prevLikes);
            newLikes.delete(messageId);
            return newLikes;
          });
        }
      }
      return newSet;
    });
    
    try {
      // Send feedback to API
      await ChatAPI.submitFeedback(messageId, 'dislike');
    } catch (error) {
      console.error('Error submitting feedback:', error);
    }
  };
  
  const handleCopy = (messageId) => {
    const message = messages.find(m => m.id === messageId && m.role === 'assistant');
    if (message) {
      navigator.clipboard.writeText(message.content).then(() => {
        setCopiedMessages(prev => new Set(prev).add(messageId));
        
        // Reset the "copied" status after 2 seconds
        setTimeout(() => {
          setCopiedMessages(prev => {
            const newSet = new Set(prev);
            newSet.delete(messageId);
            return newSet;
          });
        }, 2000);
      }).catch(err => {
        console.error('Failed to copy text: ', err);
      });
    }
  };
  
  const getFileTypeDisplay = (file) => {
    if (file.type.includes('pdf')) return 'PDF';
    if (file.type.includes('word')) return 'Word';
    if (file.type.includes('excel') || file.type.includes('spreadsheet')) return 'Excel';
    if (file.type.includes('text')) return 'Text';
    if (file.type.includes('image')) return 'Image';
    return 'File';
  };
  
  const getFileIcon = (file) => {
    if (file.type.includes('image')) return <Camera className="w-3 h-3 mr-1 text-green-500" />;
    if (file.type.includes('pdf')) return <FileText className="w-3 h-3 mr-1 text-red-500" />;
    if (file.type.includes('word')) return <FileText className="w-3 h-3 mr-1 text-blue-500" />;
    if (file.type.includes('excel')) return <FileText className="w-3 h-3 mr-1 text-green-600" />;
    if (file.type.includes('text')) return <FileText className="w-3 h-3 mr-1 text-gray-500" />;
    return <FileText className="w-3 h-3 mr-1 text-gray-500" />;
  };
  
  return (
    <div className="flex-1 flex flex-col rounded-xl md:rounded-2xl m-2 md:m-3 overflow-hidden text-gray-900 h-full">
      {/* Add style tag for custom animation */}
      <style>{horizontalBounceStyle}</style>
      
      {/* Server Connection Error Alert */}
      {connectionError && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 flex justify-between items-center">
          <div className="flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2 text-red-500" />
            <span>Cannot connect to server. Please check if the backend server is running.</span>
          </div>
          <button 
            onClick={retryConnection}
            className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded text-sm"
          >
            Retry
          </button>
        </div>
      )}
      
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-2 md:p-4 relative flex flex-col"
        style={{ height: 'calc(100vh - 200px)' }}
      >
        {messages.map((message) => (
          <div key={message.id} className="mb-4 md:mb-6 w-full flex">
            {message.role === 'assistant' && (
              <div className="mb-2 md:mb-4 w-full md:w-2/3">
                <div className="flex items-start">
                  <div className={`bg-white p-3 md:p-4 rounded-lg w-full shadow-sm ${message.isError ? 'border-l-4 border-red-500' : ''}`}>
                    <MessageFormatter content={message.content} />
                    
                    {/* Image with zoom functionality */}
                    {message.imageUrl && (
                      <div className="mt-4 rounded-lg overflow-hidden border border-gray-200">
                        <img 
                          src={message.imageUrl} 
                          alt="Generated illustration" 
                          className="w-full object-contain max-h-96 cursor-pointer"
                          onClick={() => handleImageZoom(message.imageUrl)}
                          onError={(e) => {
                            console.error('Image failed to load:', message.imageUrl);
                            e.target.style.display = 'none';
                            e.target.parentNode.innerHTML += `<div class="p-4 bg-gray-100 text-center text-gray-600">
                              <p>Image could not be loaded</p>
                              <p class="text-xs mt-1">${message.imageUrl}</p>
                            </div>`;
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex mt-1 md:mt-2 ml-1 md:ml-2">
                  <button
                    className={`p-1 ${likedMessages.has(message.id) ? 'text-violet-600' : 'text-gray-400'} hover:text-${likedMessages.has(message.id) ? 'violet-700' : 'gray-600'}`}
                    onClick={() => toggleLike(message.id)}
                    aria-label="Like message"
                  >
                    <ThumbsUp className="w-4 h-4 md:w-5 md:h-5" />
                  </button>
                  <button
                    className={`p-1 ml-1 ${dislikedMessages.has(message.id) ? 'text-violet-600' : 'text-gray-400'} hover:text-${dislikedMessages.has(message.id) ? 'violet-700' : 'gray-600'}`}
                    onClick={() => toggleDislike(message.id)}
                    aria-label="Dislike message"
                  >
                    <ThumbsDown className="w-4 h-4 md:w-5 md:h-5" />
                  </button>
                  <button
                    className={`p-1 ml-1 ${copiedMessages.has(message.id) ? 'text-violet-600' : 'text-gray-400'} hover:text-violet-700`}
                    onClick={() => handleCopy(message.id)}
                    aria-label="Copy message"
                  >
                    <Copy className="w-4 h-4 md:w-5 md:h-5" />
                  </button>
                  {!message.simplified && !message.isError && (
                    <button
                      className="p-1 ml-1 text-gray-400 hover:text-violet-700"
                      onClick={() => handleSimplifyResponse(message.id)}
                      aria-label="Simplify message"
                    >
                      <Repeat className="w-4 h-4 md:w-5 md:h-5" />
                    </button>
                  )}
                </div>
              </div>
            )}

            {message.role === 'user' && (
              <div className="ml-auto w-full md:w-1/2 md:pl-6">
                <div className="bg-blue-50 rounded-lg p-2 md:p-3">
                  <p className="text-sm md:text-base text-gray-800">{message.content}</p>
                  
                  {/* Display attached files with improved styling */}
                  {message.files && message.files.length > 0 && (
                    <div className="mt-2 space-y-1">
                      <p className="text-xs text-gray-600 font-medium">Attached files:</p>
                      {message.files.map((file, index) => (
                        <div key={index} className="flex items-center text-xs text-gray-700 bg-white rounded-md p-1 border border-gray-200">
                          {getFileIcon(file)}
                          <span className="truncate max-w-[200px]">{file.name}</span>
                          <span className="ml-auto text-gray-500 text-xxs">{getFileTypeDisplay(file)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
        
        {isLoading && (
          <div className="flex items-center justify-center my-4 space-x-3">
            <div className="loader flex flex-row">
              <div className="w-3 h-3 bg-violet-500 rounded-full animate-bounce-x mx-1"></div>
              <div className="w-3 h-3 bg-violet-500 rounded-full animate-bounce-x mx-1 delay-100"></div>
              <div className="w-3 h-3 bg-violet-500 rounded-full animate-bounce-x mx-1 delay-200"></div>
            </div>
            {processingFiles && !processingImages && (
              <div className="text-xs text-violet-700">
                Processing your files... This may take a moment.
              </div>
            )}
            {processingImages && (
              <div className="text-xs text-violet-700">
                Analyzing {imageCount} image{imageCount !== 1 ? 's' : ''}... This may take a moment.
              </div>
            )}
          </div>
        )}
        
        {showScrollButton && (
          <button 
            onClick={scrollToBottom}
            className="fixed bottom-24 right-6 bg-violet-500 text-white p-2 rounded-full shadow-lg hover:bg-violet-600 z-10"
            aria-label="Scroll to bottom"
          >
            <ArrowDown className="w-5 h-5" />
          </button>
        )}
      </div>
      
      {/* Zoomed Image Overlay */}
      {zoomedImage && (
        <div 
          className="fixed inset-0 bg-transparent z-50 flex items-center justify-center"
          onClick={closeZoomedImage}
        >
          <div 
            className="relative w-[100%] h-[100%] ml-100 flex items-center justify-center backdrop-blur" 
            onClick={(e) => e.stopPropagation()}
          >
            <img 
              src={zoomedImage} 
              alt="Enlarged illustration" 
              className="max-w-full max-h-full object-contain border-4 border-white shadow-2xl bg-white"
            />
            <button 
              className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-lg"
              onClick={closeZoomedImage}
              aria-label="Close zoomed image"
            >
              <X className="w-6 h-6 text-gray-700" />
            </button>
          </div>
        </div>
      )}

      {/* Input Area with improved file feedback */}
      <div className="p-2 md:p-4">
        <div className="flex flex-wrap md:flex-nowrap items-center rounded-xl md:rounded-4xl bg-white px-2 md:px-3 py-1 md:py-2 relative w-full shadow-md">
          <div className="flex items-center w-full md:w-auto mb-2 md:mb-0 order-1 md:order-none space-x-2">
            {/* Create Image Button */}
            <button
              className={`px-2 md:px-3 py-1 md:py-2 rounded-full text-xs md:text-sm ${isCreateImageActive ? 'bg-violet-500 text-white' : 'bg-gray-200 text-gray-700'} `}
              onClick={() => setIsCreateImageActive(!isCreateImageActive)}
              disabled={connectionError}
            >
              <ImageIcon className="w-3 h-3 md:w-4 md:h-4 mr-1 inline" /> Create image
            </button>
            
            {/* Create Quiz Button */}
            <button
              className="px-2 md:px-3 py-1 md:py-2 rounded-full text-xs md:text-sm bg-green-200 text-green-700 hover:bg-green-300"
              onClick={handleCreateQuiz}
              disabled={connectionError}
            >
              <Book className="w-3 h-3 md:w-4 md:h-4 mr-1 inline" /> Create Quiz
            </button>
            
            {/* Marks Button with Dropdown */}
            <div ref={marksDropdownRef} className="relative">
              <button
                className={`px-2 md:px-3 py-1 md:py-2 rounded-full text-xs md:text-sm flex items-center ${selectedMarks ? 'bg-violet-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                onClick={toggleMarksDropdown}
                disabled={connectionError}
              >
                <Award className="w-3 h-3 md:w-4 md:h-4 mr-1" /> 
                {selectedMarks ? `${selectedMarks} marks` : 'Marks'} 
                <ChevronUp className={`w-3 h-3 md:w-4 md:h-4 ml-1 transition-transform ${showMarksDropdown ? 'rotate-180' : ''}`} />
              </button>
              
              {/* Dropdown Menu */}
              {showMarksDropdown && (
                <div className="absolute bottom-full left-0 mb-1 w-32 bg-white rounded-lg shadow-lg z-10 overflow-hidden">
                  <button
                    className="w-full text-left px-3 py-2 text-sm hover:bg-violet-100 text-gray-700"
                    onClick={() => handleMarksSelection(2)}
                  >
                    2 marks
                  </button>
                  <button
                    className="w-full text-left px-3 py-2 text-sm hover:bg-violet-100 text-gray-700"
                    onClick={() => handleMarksSelection(5)}
                  >
                    5 marks
                  </button>
                  <button
                    className="w-full text-left px-3 py-2 text-sm hover:bg-violet-100 text-gray-700"
                    onClick={() => handleMarksSelection(7)}
                  >
                    7 marks
                  </button>
                  {selectedMarks && (
                    <button
                      className="w-full text-left px-3 py-2 text-sm hover:bg-violet-100 text-red-500"
                      onClick={() => handleMarksSelection(null)}
                    >
                      Clear
                    </button>
                  )}
                </div>
              )}
            </div>
            
            {/* File Upload Button */}
            <input
              type="file"
              multiple
              ref={fileInputRef}
              onChange={handleFileUpload}
              className="hidden"
              accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.csv,.txt"
              disabled={connectionError}
            />
            <button
              className="text-gray-400 p-1 hover:text-violet-600"
              onClick={() => fileInputRef.current.click()}
              disabled={connectionError}
            >
              <Upload className="w-4 h-4 md:w-5 md:h-5" />
            </button>
          </div>
          
          <div className="w-full flex-1 order-3 md:order-none">
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={
                connectionError ? "Server connection error. Please try again later..." :
                attachedFiles.some(file => file.type.includes('image')) 
                  ? "Ask about the content in your images..." 
                  : attachedFiles.length > 0 
                    ? "Ask a question about your files..." 
                    : selectedMarks 
                      ? `Ask your ${selectedMarks}-mark question...`
                      : "Ask an educational question..."
              }
              className="w-full px-2 py-1 md:py-2 rounded-lg outline-none text-sm md:text-base text-gray-800 resize-none"
              rows={inputValue.split('\n').length > 3 ? inputValue.split('\n').length : 1}
              style={{ minHeight: '40px', maxHeight: '120px' }}
              disabled={connectionError}
            />
          </div>
          
          {attachedFiles.length > 0 && (
            <div className="flex flex-wrap gap-1 md:gap-2 mb-2 md:ml-2 w-full md:w-auto order-2 md:order-none">
              {attachedFiles.map((file, index) => (
                <div key={index} className="flex items-center bg-gray-200 rounded-full px-2 md:px-3 py-1">
                  {getFileIcon(file)}
                  <span className="text-xs md:text-sm text-gray-800 mr-1 md:mr-2 truncate max-w-24 md:max-w-32">{file.name}</span>
                  <button
                    className="text-gray-500 hover:text-gray-700 p-1"
                    onClick={() => removeAttachedFile(file)}
                  >
                    <X className="w-3 h-3 md:w-4 md:h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
          
          <button 
            className={`bg-violet-500 text-white p-2 md:p-3 rounded-md md:ml-2 order-4 md:order-none 
              ${(isLoading || connectionError) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-violet-600'}`}
            onClick={handleSendMessage}
            disabled={isLoading || connectionError}
          >
            {isLoading ? <Loader className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </button>
        </div>
      </div>
      
      <div className="pb-1 md:pb-2 text-xs text-gray-500 text-center">
        {connectionError ? 
          "⚠️ Cannot connect to backend server. Please check if it's running." :
          selectedMarks ? 
            `Answering with ${selectedMarks}-mark detail level. Select a different value or clear to change.` :
          attachedFiles.some(file => file.type.includes('image')) ? 
            `${attachedFiles.filter(file => file.type.includes('image')).length} image(s) ready for analysis. Ask a question about the image content.` :
            attachedFiles.length > 0 ? 
              `${attachedFiles.length} file(s) ready to upload. Ask a question about them or click send to analyze.` : 
              "Gyansetu.ai - Personalized AI learning for students. Ask any educational question or upload images."}
      </div>
    </div>
  );
};

export default ChatInterface;
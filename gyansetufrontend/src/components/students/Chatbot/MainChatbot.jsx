import React, { useState, useEffect, useRef } from "react";
import { Routes, Route, NavLink } from "react-router-dom";
import {
  Search,
  Bell,
  FileText,
  BarChart2,
  Settings,
  HelpCircle,
  LogOut,
  Send,
  ThumbsUp,
  ThumbsDown,
  Copy,
  Repeat,
  Trash2,
  Plus,
  X,
  Image as ImageIcon,
  Share2,
  Edit,
  BookOpen,
  Notebook,
  Bookmark,
  Info,
  Menu,
} from "lucide-react";
import NotesApp from "../notes/NotesApp";

// Placeholder components for routes
const Quiz = () => (
  <div className="p-4">
    <h2>Quiz Page</h2>
    <p>This is the Quiz page.</p>
  </div>
);
const Notes = () => (
  <div className="p-4">
    <h2>Notes Page</h2>
    <p>This is the Notes page.</p>
  </div>
);
const ChatHistory = () => (
  <div className="p-4">
    <h2>Chat History</h2>
    <p>This is the Chat History page.</p>
  </div>
);
const SettingsPage = () => (
  <div className="p-4">
    <h2>Settings</h2>
    <p>This is the Settings page.</p>
  </div>
);
const UpdatesFAQ = () => (
  <div className="p-4">
    <h2>Updates & FAQ</h2>
    <p>This is the Updates & FAQ page.</p>
  </div>
);

const MainChatbot = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [activeTab, setActiveTab] = useState("HTML");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState([]);
  const [isCreateImageActive, setIsCreateImageActive] = useState(false);
  const [isSharePopupOpen, setIsSharePopupOpen] = useState(false);
  const [isQuizPopupOpen, setIsQuizPopupOpen] = useState(false);
  const [historyItems, setHistoryItems] = useState([
    { id: 1, title: "Create welcome form", description: "Write code HTML" },
    {
      id: 2,
      title: "Instructions",
      description: "How to set up a Wi-Fi wireless network?",
    },
    {
      id: 3,
      title: "Career",
      description: "How to organize your working day effectively?",
    },
    {
      id: 4,
      title: "Career",
      description: "Tips to improve productivity at work",
    },
    {
      id: 5,
      title: "Onboarding",
      description: "How does artificial intelligence work?",
    },
    { id: 6, title: "Onboarding", description: "What can you do?" },
  ]);
  const [likedMessages, setLikedMessages] = useState(new Set());
  const [dislikedMessages, setDislikedMessages] = useState(new Set());
  const [copiedMessages, setCopiedMessages] = useState(new Set());
  const menuRef = useRef(null);
  const sharePopupRef = useRef(null);
  const quizPopupRef = useRef(null);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const sidebarRef = useRef(null);

  const sidebarLinks = [
    {
      icon: <BookOpen className="w-5 h-5" />,
      label: "Quiz",
      pro: true,
      path: "/quiz",
    },
    { icon: <Notebook className="w-5 h-5" />, label: "Notes", path: "/notes" },
    {
      icon: <Bookmark className="w-5 h-5" />,
      label: "Chat History",
      pro: true,
      path: "/chathistory",
    },
    {
      icon: <Settings className="w-5 h-5" />,
      label: "Settings",
      path: "/settings",
    },
    {
      icon: <Info className="w-5 h-5" />,
      label: "Updates & FAQ",
      path: "/updates-faq",
    },
  ];

  const codeExample = `let cancelButton = document.getElementById("cancel-button");
let sendButton = document.getElementById("send-button");

cancelButton.addEventListener("click", function() {
  console.log("Cancel button clicked");
});

sendButton.addEventListener("click", function() {
  console.log("Send button clicked");
});`;

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
      if (
        sharePopupRef.current &&
        !sharePopupRef.current.contains(event.target)
      ) {
        setIsSharePopupOpen(false);
      }
      if (
        quizPopupRef.current &&
        !quizPopupRef.current.contains(event.target)
      ) {
        setIsQuizPopupOpen(false);
      }
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        window.innerWidth < 768 &&
        isSidebarOpen
      ) {
        setIsSidebarOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSidebarOpen]);

  const handleSendMessage = () => {
    if (inputValue.trim() || attachedFiles.length > 0) {
      const fileNames = attachedFiles.map((file) => file.name).join(", ");
      const newMessage = {
        id: messages.length + 1,
        role: "user",
        content: inputValue.trim() || `Uploaded files: ${fileNames}`,
        files: attachedFiles.map((file) => ({
          name: file.name,
          type: file.type,
        })),
        timestamp: new Date().toISOString(),
      };

      setMessages([...messages, newMessage]);
      setInputValue("");
      setAttachedFiles([]);

      setTimeout(() => {
        const assistantResponse = {
          id: messages.length + 2,
          role: "assistant",
          content:
            attachedFiles.length > 0
              ? `Received your files: ${fileNames}. How can I assist you with them?`
              : "I understand you're interested in learning about this topic. Let me provide you with some information...",
          timestamp: new Date().toISOString(),
        };

        setMessages((prevMessages) => [...prevMessages, assistantResponse]);
      }, 1000);
    }
    if (isCreateImageActive) {
      handleCreateImage();
    }
  };

  const handleFileUpload = (files) => {
    if (files && files.length > 0) {
      const newFiles = Array.from(files);
      setAttachedFiles((prevFiles) => [...prevFiles, ...newFiles]);
      setIsMenuOpen(false);
    }
  };

  const handleCreateImage = () => {
    console.log("Sending request to backend to create image...");
    setIsCreateImageActive(false);
  };

  const handleNewChat = () => {
    if (messages.length > 1) {
      const lastUserMessage = messages.findLast((m) => m.role === "user");
      if (lastUserMessage) {
        setHistoryItems((prev) => [
          ...prev,
          {
            id: Date.now(),
            title: lastUserMessage.content.split("\n")[0] || "New Chat",
            description: lastUserMessage.content,
          },
        ]);
      }
    }
    setMessages([
      {
        id: 1,
        role: "assistant",
        content:
          "Welcome to Gurukul.ai! I can help you learn any subject. What would you like to study today?",
        timestamp: new Date().toISOString(),
      },
    ]);
  };

  const handleShareChat = () => {
    const chatLink = `https://yourdomain.com/chat/${Date.now()}`;
    return chatLink;
  };

  const handleDeleteHistoryItem = (id) => {
    setHistoryItems((prev) => prev.filter((item) => item.id !== id));
  };

  const toggleLike = (messageId) => {
    setLikedMessages((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(messageId)) {
        newSet.delete(messageId);
      } else {
        newSet.add(messageId);
        if (dislikedMessages.has(messageId))
          setDislikedMessages((prev) => {
            const newDislikeSet = new Set(prev);
            newDislikeSet.delete(messageId);
            return newDislikeSet;
          });
      }
      return newSet;
    });
  };

  const toggleDislike = (messageId) => {
    setDislikedMessages((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(messageId)) {
        newSet.delete(messageId);
      } else {
        newSet.add(messageId);
        if (likedMessages.has(messageId))
          setLikedMessages((prev) => {
            const newLikeSet = new Set(prev);
            newLikeSet.delete(messageId);
            return newLikeSet;
          });
      }
      return newSet;
    });
  };

  const handleCopy = (messageId) => {
    const message = messages.find(
      (m) => m.id === messageId && m.role === "assistant"
    );
    if (message) {
      navigator.clipboard
        .writeText(message.content)
        .then(() => {
          console.log("Text copied to clipboard");
          setCopiedMessages((prev) => new Set(prev).add(messageId));
        })
        .catch((err) => {
          console.error("Failed to copy text: ", err);
        });
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const formatCode = (code) => {
    return code.split("\n").map((line, index) => (
      <div key={index} className="flex">
        <span className="text-gray-500 w-8 text-right pr-2">{index + 1}</span>
        <span className="flex-1">{line}</span>
      </div>
    ));
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-violet-100 via-white to-violet-400 overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={`${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 fixed md:static z-30 h-full md:w-48 lg:w-64 bg-white flex flex-col transition-transform duration-300 ease-in-out`}
      >
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center">
            <div className="bg-purple-800 w-8 h-8 rounded-md flex items-center justify-center mr-2">
              <span className="text-white font-bold">G</span>
            </div>
            <span className="font-semibold text-lg">Gyansetu</span>
          </div>
          <button
            className="md:hidden text-gray-500 hover:text-gray-800"
            onClick={() => setIsSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1">
          <nav className="px-2 py-6">
            <div className="space-y-7">
              {sidebarLinks.map((link, index) => (
                <NavLink
                  key={index}
                  to={link.path}
                  className={({ isActive }) =>
                    `flex items-center px-4 py-3 mb-3 rounded-md w-full md:w-11/12 mx-auto ${
                      isActive
                        ? "bg-purple-100 text-purple-800"
                        : "bg-gray-100 text-purple-700 hover:bg-gradient-to-r hover:from-purple-300 hover:to-purple-100 hover:text-purple-800"
                    }`
                  }
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <div className="text-gray-400">{link.icon}</div>
                  <span className="ml-3 text-sm">{link.label}</span>
                  {link.pro && (
                    <span className="ml-auto text-xs bg-purple-200 text-purple-800 rounded px-1">
                      Pro
                    </span>
                  )}
                </NavLink>
              ))}
            </div>
          </nav>
        </div>

        <div className="p-4 mt-auto">
          <div className="bg-gradient-to-r from-violet-500 to-purple-300 rounded-lg p-4">
            <h3 className="font-bold text-white">
              Knowledge is your superpower
            </h3>
            <p className="text-sm text-white opacity-90 mt-1">
              Keep powering up!
            </p>
          </div>
          <button className="flex items-center w-full mt-6 text-purple-700 hover:text-purple-800">
            <LogOut className="w-5 h-5 mr-2" />
            <span>Exit</span>
          </button>
        </div>
      </div>

      {/* Main Content Area with Routes */}
      <div className="flex-1 flex overflow-hidden bg-gray-300 m-2 sm:m-4 md:m-6 rounded-2xl md:rounded-4xl">
        <Routes>
          <Route
            path="/"
            element={
              <div className="flex-1 flex flex-col rounded-xl md:rounded-2xl m-2 md:m-3 overflow-hidden text-gray-900">
                <div className="p-2 md:p-4 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <button
                      className="p-2 text-gray-500 hover:text-gray-800 md:hidden"
                      onClick={toggleSidebar}
                      aria-label="Open sidebar menu"
                    >
                      <Menu className="w-6 h-6" />
                    </button>
                    <div className="relative group">
                      <button
                        className="p-1 md:p-2 bg-white rounded-full text-sm hover:bg-transparent group-hover:bg-gray-300"
                        onClick={handleNewChat}
                      >
                        <Edit className="w-4 h-4 md:w-5 md:h-5" />
                      </button>
                      <span className="absolute left-1/2 transform -translate-x-1/4 top-10 bg-white text-black text-xs rounded py-1 px-4 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        Create new chat
                      </span>
                    </div>
                    <div className="relative group">
                      <button
                        className="p-1 md:p-2 bg-white rounded-full text-sm hover:bg-transparent group-hover:bg-gray-300"
                        onClick={() => setIsQuizPopupOpen(true)}
                      >
                        <BookOpen className="w-4 h-4 md:w-5 md:h-5" />
                      </button>
                      <span className="absolute left-1/2 transform -translate-x-1/2 top-10 bg-white text-black text-xs rounded py-1 px-4 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        Attempt a quiz
                      </span>
                    </div>
                  </div>
                  <h3 className="text-md md:text-xl font-semibold mx-2 md:mx-4 text-violet-800">
                    Your AI Chatbot
                  </h3>
                  <div className="flex items-center">
                    <button
                      className="p-1 md:p-2 text-gray-500 hover:text-gray-700"
                      onClick={() => setIsSharePopupOpen(true)}
                    >
                      <Share2 className="w-4 h-4 md:w-5 md:h-5" />
                    </button>
                    <button className="p-1 md:p-2 text-gray-500 hover:text-gray-700 ml-1 md:ml-2">
                      <Bell className="w-4 h-4 md:w-5 md:h-5" />
                    </button>
                  </div>
                </div>

                <div
                  className="flex-1 overflow-y-auto p-2 md:p-4 relative flex flex-col"
                  ref={chatContainerRef}
                >
                  {messages.map((message) => (
                    <div key={message.id} className="mb-4 md:mb-6 w-full flex">
                      {message.role === "assistant" && (
                        <div className="mb-2 md:mb-4 w-full md:w-1/2">
                          <div className="flex items-start">
                            <div className="bg-white p-2 md:p-4 rounded-lg w-full">
                              <p className="text-sm md:text-base text-gray-800">
                                {message.content}
                              </p>

                              {message.id === 1 && (
                                <div className="mt-4 md:mt-6">
                                  <div className="bg-gray-100 rounded-lg overflow-hidden">
                                    <div className="flex border-b">
                                      {["HTML", "CSS", "JS"].map((tab) => (
                                        <button
                                          key={tab}
                                          className={`px-2 md:px-4 py-1 md:py-2 text-xs md:text-sm ${
                                            activeTab === tab
                                              ? "text-blue-600"
                                              : "text-gray-600"
                                          }`}
                                          onClick={() => setActiveTab(tab)}
                                        >
                                          {tab}
                                        </button>
                                      ))}
                                      <div className="ml-auto px-2 md:px-4 py-1 md:py-2">
                                        <button className="text-gray-500 text-xs md:text-sm flex items-center">
                                          <Copy className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                                          Copy code
                                        </button>
                                      </div>
                                    </div>
                                    <div className="p-2 md:p-4 bg-gray-50 overflow-x-auto text-xs md:text-sm font-mono">
                                      {formatCode(codeExample)}
                                    </div>
                                  </div>
                                  <p className="mt-2 md:mt-4 text-xs md:text-sm text-gray-600">
                                    Note: This is just an example of a simple
                                    HTML form. In a real-world scenario, you
                                    would also want to include proper validation
                                    and handling of the form data on the server
                                    side.
                                  </p>
                                  <div className="mt-2 md:mt-4 p-2 md:p-4 bg-gray-100 rounded-lg">
                                    <p className="text-xs md:text-sm text-gray-800">
                                      I have created a project in your Codepen
                                      account
                                    </p>
                                    <div className="flex justify-end mt-1 md:mt-2">
                                      <button className="text-blue-600 flex items-center text-xs md:text-sm">
                                        View
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex mt-1 md:mt-2 ml-1 md:ml-2">
                            <button
                              className={`p-1 ${
                                likedMessages.has(message.id)
                                  ? "text-violet-600"
                                  : "text-gray-400"
                              } hover:text-${
                                likedMessages.has(message.id)
                                  ? "violet-700"
                                  : "gray-600"
                              }`}
                              onClick={() => toggleLike(message.id)}
                            >
                              <ThumbsUp className="w-4 h-4 md:w-5 md:h-5" />
                            </button>
                            <button
                              className={`p-1 ml-1 ${
                                dislikedMessages.has(message.id)
                                  ? "text-violet-600"
                                  : "text-gray-400"
                              } hover:text-${
                                dislikedMessages.has(message.id)
                                  ? "violet-700"
                                  : "gray-600"
                              }`}
                              onClick={() => toggleDislike(message.id)}
                            >
                              <ThumbsDown className="w-4 h-4 md:w-5 md:h-5" />
                            </button>
                            <button
                              className={`p-1 ml-1 ${
                                copiedMessages.has(message.id)
                                  ? "text-violet-600"
                                  : "text-gray-400"
                              } hover:text-violet-700`}
                              onClick={() => handleCopy(message.id)}
                            >
                              <Copy className="w-4 h-4 md:w-5 md:h-5" />
                            </button>
                          </div>
                        </div>
                      )}

                      {message.role === "user" && (
                        <div className="ml-auto w-full md:w-1/2 md:pl-6">
                          <div className="bg-blue-50 rounded-lg p-2 md:p-3">
                            <p className="text-sm md:text-base text-gray-800">
                              {message.content}
                            </p>
                            {message.files && message.files.length > 0 && (
                              <div className="text-xs md:text-sm text-gray-600 mt-1">
                                Files:{" "}
                                {message.files.map((file, index) => (
                                  <div key={index}>
                                    {file.name} ({file.type})
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
                </div>

                {/* Modified Input Area */}
                <div className="p-2 md:p-4">
                  <div className="flex flex-wrap md:flex-nowrap items-center rounded-xl md:rounded-4xl bg-white px-2 md:px-3 py-1 md:py-2 relative w-full">
                    <div className="flex items-center w-full md:w-auto mb-2 md:mb-0 order-1 md:order-none">
                      <button
                        className={`px-2 md:px-3 py-1 md:py-2 rounded-full text-xs md:text-sm ${
                          isCreateImageActive
                            ? "bg-violet-500 text-white"
                            : "bg-gray-200 text-gray-700"
                        } `}
                        onClick={() => {
                          setIsCreateImageActive(true);
                          handleSendMessage();
                        }}
                      >
                        <ImageIcon className="w-3 h-3 md:w-4 md:h-4 mr-1 inline" />{" "}
                        Create image
                      </button>
                      <button
                        className="text-gray-400 p-1 ml-1 md:ml-2"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                      >
                        <Plus className="w-4 h-4 md:w-5 md:h-5 hover:text-violet-600" />
                      </button>
                      {isMenuOpen && (
                        <div
                          ref={menuRef}
                          className="absolute left-10 top-[-85px] bg-gray-200 rounded-lg shadow-xl p-2 z-10"
                        >
                          <label className="block px-2 md:px-4 py-1 md:py-2 text-xs md:text-sm text-black hover:bg-gray-100 hover:rounded-md cursor-pointer">
                            Upload Image
                            <input
                              type="file"
                              accept="image/*"
                              multiple
                              onChange={(e) => handleFileUpload(e.target.files)}
                              className="hidden"
                            />
                          </label>
                          <label className="block px-2 md:px-4 py-1 md:py-2 text-xs md:text-sm text-black hover:bg-gray-100 hover:rounded-lg cursor-pointer">
                            Upload File
                            <input
                              type="file"
                              accept="application/pdf"
                              multiple
                              onChange={(e) => handleFileUpload(e.target.files)}
                              className="hidden"
                            />
                          </label>
                        </div>
                      )}
                    </div>
                    <div className="w-full flex-1 order-3 md:order-none">
                      <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Start typing"
                        className="w-full px-2 py-1 md:py-2 rounded-lg outline-none text-sm md:text-base text-gray-800"
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            handleSendMessage();
                          }
                        }}
                      />
                    </div>
                    {attachedFiles.length > 0 && (
                      <div className="flex flex-wrap gap-1 md:gap-2 mb-2 md:ml-2 w-full md:w-auto order-2 md:order-none">
                        {attachedFiles.map((file, index) => (
                          <div
                            key={index}
                            className="flex items-center bg-gray-200 rounded-full px-2 md:px-3 py-1"
                          >
                            <span className="text-xs md:text-sm text-gray-800 mr-1 md:mr-2 truncate max-w-24 md:max-w-32">
                              {file.name}
                            </span>
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
                      className="bg-violet-500 text-white p-2 md:p-3 rounded-md md:ml-2 order-4 md:order-none"
                      onClick={handleSendMessage}
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="pb-1 md:pb-2 text-xs text-gray-500 text-center">
                  Gyansetu - Personalized AI learning for Indian students.
                  Aligned with education boards for grades 5-12.
                </div>
              </div>
            }
          />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/notes" element={<NotesApp />} />
          <Route path="/chathistory" element={<ChatHistory />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/updates-faq" element={<UpdatesFAQ />} />
        </Routes>

        {/* History Panel */}
        <div className="hidden lg:flex w-64 xl:w-72 bg-white rounded-3xl lg:rounded-4xl m-3 mr-3 ml-4 overflow-hidden flex-col text-gray-900">
          <div className="p-3 md:p-4">
            <h2 className="font-semibold flex items-center justify-between">
              History
              <span className="text-xs text-gray-500">
                {historyItems.length}/50
              </span>
            </h2>
          </div>

          <div className="flex-1 overflow-y-auto rounded-3xl lg:rounded-4xl">
            {historyItems.map((item) => (
              <div
                key={item.id}
                className="p-3 md:p-4 hover:bg-gray-200 rounded-3xl lg:rounded-4xl m-2 cursor-pointer group"
              >
                <div className="flex items-start">
                  <button
                    className="p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => handleDeleteHistoryItem(item.id)}
                  >
                    <div className="bg-gray-100 rounded-full p-2 hover:bg-gray-200 mr-3 md:mr-4">
                      <Trash2 className="w-3 h-3 md:w-4 md:h-4 text-violet-400 hover:text-black" />
                    </div>
                  </button>
                  <div>
                    <h3 className="font-medium text-sm md:text-base">
                      {item.title}
                    </h3>
                    <p className="text-xs md:text-sm text-gray-500 mt-1">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Share Popup */}
      {isSharePopupOpen && (
        <div
          className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setIsSharePopupOpen(false)}
        >
          <div
            ref={sharePopupRef}
            className="bg-white p-4 md:p-6 rounded-lg shadow-lg relative m-4 w-11/12 md:w-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-base md:text-lg font-semibold mb-3 md:mb-4">
              Share Chat
            </h3>
            <p className="mb-3 md:mb-4 text-sm md:text-base">
              Link: <span className="text-blue-500">{handleShareChat()}</span>
            </p>
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={() => setIsSharePopupOpen(false)}
            >
              <X className="w-4 h-4 md:w-5 md:h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Quiz Popup */}
      {isQuizPopupOpen && (
        <div
          className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setIsQuizPopupOpen(false)}
        >
          <div
            ref={quizPopupRef}
            className="bg-white p-4 md:p-6 rounded-lg shadow-lg w-11/12 md:w-2/3 lg:w-1/2 h-3/4 md:h-1/2 relative overflow-y-auto m-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-base md:text-lg font-semibold mb-3 md:mb-4">
              Attempt a Quiz
            </h3>
            <p className="mb-3 md:mb-4 text-sm md:text-base">
              This is a placeholder for the quiz content. Add your quiz
              questions here!
            </p>
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={() => setIsQuizPopupOpen(false)}
            >
              <X className="w-4 h-4 md:w-5 md:h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MainChatbot;

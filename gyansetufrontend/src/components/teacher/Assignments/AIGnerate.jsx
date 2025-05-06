import React, { useState, useEffect } from "react";
import {
  Sparkles,
  Zap,
  Wand2,
  BrainCircuit,
  MessageSquarePlus,
  X,
  Check,
  Info,
  AlertCircle,
  PencilLine,
  ArrowLeft,
} from "lucide-react";
import {
  IoMoonOutline,
  IoSunnyOutline,
  IoPersonCircleOutline,
} from "react-icons/io5";
import Navbar from "../TeacherNavbar"; // Reusing the same Navbar component

export default function AIAssistantIntegration({
  onBack,
  onContinue,
  selectedTemplate,
  onAddContent,
}) {
  const [activeTab, setActiveTab] = useState("question-gen");
  const [showTooltip, setShowTooltip] = useState(false);

  // Navbar state (added for navbar integration)
  const [navExpanded, setNavExpanded] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [profileImage, setProfileImage] = useState(null);

  // Check for mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  // Handle navbar toggle (from TeacherDashboard)
  const handleNavToggle = (expanded) => {
    setNavExpanded(expanded);
  };

  // Toggle theme (from TeacherDashboard)
  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  // Handle profile click (from TeacherDashboard)
  const handleProfileClick = () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";
    fileInput.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          setProfileImage(event.target.result);
        };
        reader.readAsDataURL(file);
      }
    };
    fileInput.click();
  };

  // Utility Icons component (from TeacherDashboard)
  const UtilityIcons = () => (
    <div className="flex items-center space-x-3">
      <button
        className={`w-10 h-10 rounded-full ${
          darkMode ? "bg-black" : "bg-gray-300"
        } flex items-center justify-center shadow-lg hover:bg-gray-400 transition-colors`}
        onClick={toggleTheme}
      >
        {darkMode ? (
          <IoSunnyOutline className="text-white text-xl font-bold" />
        ) : (
          <IoMoonOutline className="text-gray-700 text-xl font-bold" />
        )}
      </button>
      <button
        className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center shadow-lg hover:bg-gray-400 transition-colors overflow-hidden"
        onClick={handleProfileClick}
      >
        {profileImage ? (
          <img
            src={profileImage}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        ) : (
          <IoPersonCircleOutline className="text-gray-700 text-xl font-bold" />
        )}
      </button>
    </div>
  );

  // Template-specific instructions for the AI
  const getTemplateInstructions = () => {
    switch (selectedTemplate) {
      case "quiz":
        return "Create quiz questions with clear answers based on curriculum standards.";
      case "written":
        return "Generate essay prompts and short-answer questions with sample responses.";
      case "interactive":
        return "Design engaging scenario-based questions with interactive elements.";
      case "project":
        return "Create project guidelines with milestones, objectives, and evaluation criteria.";
      default:
        return "Generate assessment content appropriate for your curriculum.";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex flex-col md:flex-row">
        {/* Navbar Integration */}
        <Navbar onNavToggle={handleNavToggle} />

        {/* Mobile Utility Icons */}
        {isMobile && (
          <div className="fixed top-3 right-16 z-50">
            <UtilityIcons />
          </div>
        )}

        {/* Main Content Area - adjusts based on navbar state */}
        <div
          className={`flex-1 transition-all duration-300 pt-[20px] md:pt-0 ${
            navExpanded ? "ml-0 md:ml-[330px]" : "ml-0 md:ml-[100px]"
          }`}
        >
          <div className="p-6 md:p-8">
            {/* Desktop Utility Icons */}
            {!isMobile && (
              <div className="flex justify-end mb-4">
                <UtilityIcons />
              </div>
            )}

            {/* AI Assistant Content */}
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-lg shadow-md border-t-4 border-purple-500 overflow-hidden">
                <div className="flex items-center justify-between p-4 bg-purple-50 border-b border-purple-100">
                  <div className="flex items-center">
                    <h2 className="text-xl font-bold text-purple-800 flex items-center">
                      <Sparkles className="text-purple-500 w-5 h-5 mr-2" />
                      AI Assistant
                    </h2>
                  </div>
                  <div className="relative">
                    <button
                      className="text-purple-700 hover:text-purple-900"
                      onMouseEnter={() => setShowTooltip(true)}
                      onMouseLeave={() => setShowTooltip(false)}
                    >
                      <Info className="w-5 h-5" />
                    </button>
                    {showTooltip && (
                      <div className="absolute right-0 w-64 p-3 bg-white rounded-md shadow-lg border border-gray-200 text-sm text-gray-700 z-10">
                        AI features are optional assistants that help with
                        content creation while keeping you in control. Toggle
                        features on/off as needed.
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-4 bg-purple-50 border-b border-purple-100">
                  <div className="p-3 bg-white rounded-lg border border-purple-200">
                    <div className="flex items-center text-purple-800 mb-2">
                      <BrainCircuit className="w-5 h-5 mr-2 text-purple-600" />
                      <h3 className="font-medium">AI Assistant Suggestion</h3>
                    </div>
                    <p className="text-sm text-gray-600">
                      {getTemplateInstructions()} Customize the parameters below
                      to get exactly what you need.
                    </p>
                  </div>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-gray-200">
                  <button
                    className={`flex-1 py-3 px-4 text-sm font-medium ${
                      activeTab === "question-gen"
                        ? "text-purple-700 border-b-2 border-purple-500"
                        : "text-gray-600 hover:text-gray-800"
                    }`}
                    onClick={() => setActiveTab("question-gen")}
                  >
                    <div className="flex items-center justify-center">
                      <Wand2 className="w-4 h-4 mr-2" />
                      Question Generation
                    </div>
                  </button>
                  <button
                    className={`flex-1 py-3 px-4 text-sm font-medium ${
                      activeTab === "content-enhance"
                        ? "text-purple-700 border-b-2 border-purple-500"
                        : "text-gray-600 hover:text-gray-800"
                    }`}
                    onClick={() => setActiveTab("content-enhance")}
                  >
                    <div className="flex items-center justify-center">
                      <Zap className="w-4 h-4 mr-2" />
                      Content Enhancement
                    </div>
                  </button>
                  <button
                    className={`flex-1 py-3 px-4 text-sm font-medium ${
                      activeTab === "natural-input"
                        ? "text-purple-700 border-b-2 border-purple-500"
                        : "text-gray-600 hover:text-gray-800"
                    }`}
                    onClick={() => setActiveTab("natural-input")}
                  >
                    <div className="flex items-center justify-center">
                      <MessageSquarePlus className="w-4 h-4 mr-2" />
                      Natural Language Input
                    </div>
                  </button>
                </div>

                {/* Content for Question Generation */}
                {activeTab === "question-gen" && (
                  <div className="p-6">
                    <div className="mb-4">
                      <div className="flex items-center mb-2">
                        <div className="bg-purple-100 rounded-full p-1 mr-2">
                          <Wand2 className="text-purple-700 w-4 h-4" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-800">
                          AI Question Generator
                        </h3>
                      </div>
                      <p className="text-sm text-gray-600 mb-4">
                        Quickly generate questions based on topic, learning
                        objectives, or standards.
                      </p>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4 mb-6">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">
                        Generation Parameters
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">
                            Topic/Learning Objective
                          </label>
                          <input
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                            placeholder="e.g. Photosynthesis process"
                            defaultValue="Quadratic equations and their real-world applications"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">
                            Question Type
                          </label>
                          <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500">
                            <option>Multiple Choice</option>
                            <option>Short Answer</option>
                            <option>True/False</option>
                            <option>Essay</option>
                          </select>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">
                            Difficulty Level
                          </label>
                          <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500">
                            <option>Easy</option>
                            <option>Medium</option>
                            <option>Hard</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">
                            Number of Questions
                          </label>
                          <input
                            type="number"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                            defaultValue="5"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">
                            Bloom's Level
                          </label>
                          <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500">
                            <option>Knowledge</option>
                            <option>Comprehension</option>
                            <option>Application</option>
                            <option>Analysis</option>
                            <option>Synthesis</option>
                            <option>Evaluation</option>
                          </select>
                        </div>
                      </div>
                      <button className="w-full px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors duration-200 flex items-center justify-center">
                        <Sparkles className="w-4 h-4 mr-2" />
                        Generate Questions
                      </button>
                    </div>

                    <div className="border border-gray-200 rounded-lg mb-2">
                      <div className="bg-purple-50 px-4 py-2 flex justify-between items-center border-b border-gray-200">
                        <h4 className="text-sm font-medium text-purple-800">
                          AI Generated Questions
                        </h4>
                        <div className="text-xs text-purple-600 bg-purple-100 px-2 py-1 rounded-full">
                          5 questions
                        </div>
                      </div>

                      <div className="divide-y divide-gray-200">
                        {/* Example of an AI-generated question */}
                        <div className="p-4">
                          <div className="flex items-start">
                            <div className="flex-grow">
                              <div className="flex items-center">
                                <div className="text-xs text-purple-600 bg-purple-100 px-2 py-0.5 rounded-full mr-2">
                                  AI Generated
                                </div>
                                <h5 className="text-sm font-medium text-gray-800">
                                  Question 1
                                </h5>
                              </div>
                              <p className="my-2 text-gray-700">
                                A ball is thrown upward from the top of a
                                64-foot tall building with an initial velocity
                                of 80 feet per second. The height h of the ball
                                t seconds after it is thrown is given by h =
                                -16t² + 80t + 64. How long will it take for the
                                ball to hit the ground?
                              </p>

                              <div className="pl-4 mt-3 space-y-2">
                                <div className="flex items-center">
                                  <input
                                    type="radio"
                                    name="q1"
                                    id="q1a"
                                    className="h-4 w-4 text-purple-600 focus:ring-purple-500"
                                  />
                                  <label
                                    htmlFor="q1a"
                                    className="ml-2 text-sm text-gray-700"
                                  >
                                    2 seconds
                                  </label>
                                </div>
                                <div className="flex items-center">
                                  <input
                                    type="radio"
                                    name="q1"
                                    id="q1b"
                                    className="h-4 w-4 text-purple-600 focus:ring-purple-500"
                                  />
                                  <label
                                    htmlFor="q1b"
                                    className="ml-2 text-sm text-gray-700"
                                  >
                                    4 seconds
                                  </label>
                                </div>
                                <div className="flex items-center">
                                  <input
                                    type="radio"
                                    name="q1"
                                    id="q1c"
                                    className="h-4 w-4 text-purple-600 focus:ring-purple-500"
                                    checked
                                  />
                                  <label
                                    htmlFor="q1c"
                                    className="ml-2 text-sm text-gray-700"
                                  >
                                    5 seconds
                                  </label>
                                </div>
                                <div className="flex items-center">
                                  <input
                                    type="radio"
                                    name="q1"
                                    id="q1d"
                                    className="h-4 w-4 text-purple-600 focus:ring-purple-500"
                                  />
                                  <label
                                    htmlFor="q1d"
                                    className="ml-2 text-sm text-gray-700"
                                  >
                                    8 seconds
                                  </label>
                                </div>
                              </div>
                            </div>

                            <div className="flex ml-4">
                              <button className="p-1 text-green-600 hover:text-green-800">
                                <Check className="w-5 h-5" />
                              </button>
                              <button className="p-1 text-red-600 hover:text-red-800">
                                <X className="w-5 h-5" />
                              </button>
                              <button className="p-1 text-purple-600 hover:text-purple-800">
                                <PencilLine className="w-5 h-5" />
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Just showing the second question in condensed form */}
                        <div className="p-4">
                          <div className="flex items-start">
                            <div className="flex-grow">
                              <div className="flex items-center">
                                <div className="text-xs text-purple-600 bg-purple-100 px-2 py-0.5 rounded-full mr-2">
                                  AI Generated
                                </div>
                                <h5 className="text-sm font-medium text-gray-800">
                                  Question 2
                                </h5>
                              </div>
                              <p className="my-2 text-gray-700">
                                Which of the following best represents the axis
                                of symmetry for the parabola described by the
                                equation y = 3x² - 12x + 7?
                              </p>
                              <div className="text-xs text-gray-500 italic">
                                + 4 answer options
                              </div>
                            </div>

                            <div className="flex ml-4">
                              <button className="p-1 text-green-600 hover:text-green-800">
                                <Check className="w-5 h-5" />
                              </button>
                              <button className="p-1 text-red-600 hover:text-red-800">
                                <X className="w-5 h-5" />
                              </button>
                              <button className="p-1 text-purple-600 hover:text-purple-800">
                                <PencilLine className="w-5 h-5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gray-50 p-4 flex justify-between items-center">
                        <span className="text-sm text-gray-600">
                          Showing 2 of 5 questions
                        </span>
                        <div className="flex space-x-2">
                          <button className="px-3 py-1 text-sm bg-white border border-gray-300 rounded text-gray-700 hover:bg-gray-50">
                            Reject All
                          </button>
                          <button className="px-3 py-1 text-sm bg-purple-600 text-white rounded hover:bg-purple-700">
                            Accept All
                          </button>
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-gray-500 italic">
                      AI-generated questions are suggestions. You maintain full
                      control to accept, reject, or modify each question.
                    </p>
                  </div>
                )}

                {/* Content for Content Enhancement */}
                {activeTab === "content-enhance" && (
                  <div className="p-6">
                    <div className="mb-4">
                      <div className="flex items-center mb-2">
                        <div className="bg-purple-100 rounded-full p-1 mr-2">
                          <Zap className="text-purple-700 w-4 h-4" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-800">
                          Content Enhancement
                        </h3>
                      </div>
                      <p className="text-sm text-gray-600 mb-4">
                        Analyze and improve your questions for clarity, reading
                        level, and quality.
                      </p>
                    </div>

                    <div className="border border-gray-200 rounded-lg mb-6">
                      <div className="bg-purple-50 px-4 py-2 border-b border-gray-200">
                        <h4 className="text-sm font-medium text-purple-800">
                          Content Analysis
                        </h4>
                      </div>

                      <div className="p-4">
                        <textarea
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500 mb-3"
                          rows="4"
                          defaultValue="Explain how air resistance effects projectile motion and why it causes the projectile to not follow a perfect parabola."
                        ></textarea>

                        <div className="flex flex-wrap gap-2 mb-3">
                          <button className="px-3 py-1 text-xs bg-purple-100 text-purple-700 rounded-full hover:bg-purple-200">
                            Check Clarity
                          </button>
                          <button className="px-3 py-1 text-xs bg-purple-100 text-purple-700 rounded-full hover:bg-purple-200">
                            Grade Level
                          </button>
                          <button className="px-3 py-1 text-xs bg-purple-100 text-purple-700 rounded-full hover:bg-purple-200">
                            Improve Options
                          </button>
                          <button className="px-3 py-1 text-xs bg-purple-100 text-purple-700 rounded-full hover:bg-purple-200">
                            Fix Grammar
                          </button>
                        </div>
                      </div>

                      <div className="border-t border-gray-200 px-4 py-3 bg-yellow-50">
                        <div className="flex items-start">
                          <AlertCircle className="w-5 h-5 text-yellow-600 mr-2 flex-shrink-0 mt-0.5" />
                          <div>
                            <h5 className="text-sm font-medium text-yellow-800">
                              Clarity Issues Found
                            </h5>
                            <p className="text-xs text-yellow-700 mt-1">
                              Spelling error: "effects" should be "affects"
                              (verb) instead of "effects" (noun).
                            </p>

                            <div className="mt-2 bg-white p-2 rounded border border-yellow-200">
                              <p className="text-sm text-gray-700">
                                <span className="bg-yellow-100 line-through">
                                  Explain how air resistance effects projectile
                                  motion
                                </span>{" "}
                                <span className="bg-green-100">
                                  Explain how air resistance affects projectile
                                  motion
                                </span>{" "}
                                and why it causes the projectile to not follow a
                                perfect parabola.
                              </p>
                            </div>

                            <div className="mt-2 flex space-x-2">
                              <button className="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700">
                                Apply Fix
                              </button>
                              <button className="px-3 py-1 text-xs bg-white border border-gray-300 rounded text-gray-700 hover:bg-gray-50">
                                Ignore
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="border border-gray-200 rounded-lg">
                      <div className="bg-purple-50 px-4 py-2 border-b border-gray-200">
                        <h4 className="text-sm font-medium text-purple-800">
                          Reading Level Analysis
                        </h4>
                      </div>

                      <div className="p-4">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <span className="text-sm font-medium text-gray-700">
                              Current Reading Level:
                            </span>
                            <span className="ml-2 text-sm bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                              Grade 10-11
                            </span>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-gray-700">
                              Target:
                            </span>
                            <span className="ml-2 text-sm bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                              Grade 10
                            </span>
                          </div>
                        </div>

                        <div className="bg-gray-50 p-3 rounded-lg mb-3">
                          <div className="w-full bg-gray-200 rounded-full h-1.5">
                            <div
                              className="bg-blue-600 h-1.5 rounded-full"
                              style={{ width: "95%" }}
                            ></div>
                          </div>
                          <div className="flex justify-between mt-1 text-xs text-gray-500">
                            <span>Grade 6</span>
                            <span>Grade 8</span>
                            <span>Grade 10</span>
                            <span>Grade 12</span>
                            <span>College</span>
                          </div>
                        </div>

                        <div className="border-t border-gray-200 pt-3 mt-3">
                          <h5 className="text-sm font-medium text-gray-700 mb-2">
                            Vocabulary Complexity
                          </h5>
                          <div className="space-y-2">
                            <div className="flex items-center">
                              <span className="text-sm text-gray-600 flex-grow">
                                projectile motion
                              </span>
                              <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                                Grade 10
                              </span>
                            </div>
                            <div className="flex items-center">
                              <span className="text-sm text-gray-600 flex-grow">
                                air resistance
                              </span>
                              <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                                Grade 8
                              </span>
                            </div>
                            <div className="flex items-center">
                              <span className="text-sm text-gray-600 flex-grow">
                                parabola
                              </span>
                              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                                Grade 10-11
                              </span>
                            </div>
                          </div>

                          <button className="mt-3 w-full px-3 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors duration-200 flex items-center justify-center">
                            <Wand2 className="w-4 h-4 mr-2" />
                            Adjust to Target Grade Level
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Content for Natural Language Input */}
                {activeTab === "natural-input" && (
                  <div className="p-6">
                    <div className="mb-4">
                      <div className="flex items-center mb-2">
                        <div className="bg-purple-100 rounded-full p-1 mr-2">
                          <MessageSquarePlus className="text-purple-700 w-4 h-4" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-800">
                          Natural Language Input
                        </h3>
                      </div>
                      <p className="text-sm text-gray-600 mb-4">
                        Create questions by typing instructions in natural
                        language or transform existing content.
                      </p>
                    </div>

                    <div className="bg-purple-50 p-4 rounded-lg mb-6">
                      <div className="flex items-center mb-2 text-purple-800">
                        <BrainCircuit className="w-5 h-5 mr-2" />
                        <h4 className="text-sm font-medium">
                          AI Teaching Assistant
                        </h4>
                      </div>
                      <p className="text-xs text-purple-700 mb-3">
                        Type instructions in natural language and I'll create
                        structured questions for your assignment.
                      </p>

                      <div className="bg-white rounded-lg p-4 border border-purple-200">
                        <textarea
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500 mb-3"
                          rows="3"
                          placeholder="e.g., 'Create 3 multiple choice questions about photosynthesis for 7th graders'"
                          defaultValue="Create 5 challenging multiple choice questions about quadratic equations that test application skills. Focus on real-world problems like projectile motion and optimization."
                        ></textarea>

                        <button className="w-full px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors duration-200 flex items-center justify-center">
                          <Sparkles className="w-4 h-4 mr-2" />
                          Generate Questions
                        </button>
                      </div>
                    </div>

                    <div className="border border-gray-200 rounded-lg mb-6">
                      <div className="bg-purple-50 px-4 py-2 border-b border-gray-200">
                        <h4 className="text-sm font-medium text-purple-800">
                          Content Transformation
                        </h4>
                      </div>

                      <div className="p-4">
                        <h5 className="text-sm font-medium text-gray-700 mb-2">
                          Transform Existing Content
                        </h5>
                        <p className="text-xs text-gray-600 mb-3">
                          Paste text from your materials, lectures, or textbooks
                          to transform into assessment questions.
                        </p>

                        <textarea
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500 mb-3"
                          rows="5"
                          placeholder="Paste your content here..."
                          defaultValue="The quadratic formula states that for any quadratic equation in the form ax² + bx + c = 0, the solutions are given by x = (-b ± √(b² - 4ac)) / 2a. The discriminant b² - 4ac determines the number and type of solutions: if positive, there are two real solutions; if zero, there is one real solution; if negative, there are two complex solutions."
                        ></textarea>

                        <div className="flex flex-wrap gap-2 mb-3">
                          <button className="px-3 py-1.5 text-sm bg-purple-600 text-white rounded hover:bg-purple-700 flex items-center">
                            <Wand2 className="w-3 h-3 mr-1" />
                            Create Multiple Choice
                          </button>
                          <button className="px-3 py-1.5 text-sm border border-gray-300 text-gray-700 rounded hover:bg-gray-50 flex items-center">
                            <Wand2 className="w-3 h-3 mr-1" />
                            Create True/False
                          </button>
                          <button className="px-3 py-1.5 text-sm border border-gray-300 text-gray-700 rounded hover:bg-gray-50 flex items-center">
                            <Wand2 className="w-3 h-3 mr-1" />
                            Create Short Answer
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="border border-gray-200 rounded-lg">
                      <div className="bg-green-50 px-4 py-2 border-b border-gray-200 flex items-center">
                        <Check className="w-4 h-4 text-green-600 mr-2" />
                        <h4 className="text-sm font-medium text-green-800">
                          Generated from Content
                        </h4>
                      </div>

                      <div className="p-4 border-b border-gray-200">
                        <h5 className="text-sm font-medium text-gray-800 mb-2">
                          Question 1
                        </h5>
                        <p className="text-sm text-gray-700 mb-3">
                          What information does the discriminant (b² - 4ac)
                          provide about a quadratic equation?
                        </p>

                        <div className="pl-4 space-y-2">
                          <div className="flex items-center">
                            <input
                              type="radio"
                              name="q1"
                              id="nq1a"
                              className="h-4 w-4 text-purple-600 focus:ring-purple-500"
                            />
                            <label
                              htmlFor="nq1a"
                              className="ml-2 text-sm text-gray-700"
                            >
                              The values of the solutions
                            </label>
                          </div>
                          <div className="flex items-center">
                            <input
                              type="radio"
                              name="q1"
                              id="nq1b"
                              className="h-4 w-4 text-purple-600 focus:ring-purple-500"
                              checked
                            />
                            <label
                              htmlFor="nq1b"
                              className="ml-2 text-sm text-gray-700"
                            >
                              The number and type of solutions
                            </label>
                          </div>
                          <div className="flex items-center">
                            <input
                              type="radio"
                              name="q1"
                              id="nq1c"
                              className="h-4 w-4 text-purple-600 focus:ring-purple-500"
                            />
                            <label
                              htmlFor="nq1c"
                              className="ml-2 text-sm text-gray-700"
                            >
                              The axis of symmetry of the parabola
                            </label>
                          </div>
                          <div className="flex items-center">
                            <input
                              type="radio"
                              name="q1"
                              id="nq1d"
                              className="h-4 w-4 text-purple-600 focus:ring-purple-500"
                            />
                            <label
                              htmlFor="nq1d"
                              className="ml-2 text-sm text-gray-700"
                            >
                              The y-intercept of the parabola
                            </label>
                          </div>
                        </div>
                      </div>

                      <div className="p-4">
                        <button
                          onClick={onContinue}
                          className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors duration-200 flex items-center justify-center"
                        >
                          <Check className="w-4 h-4 mr-2" />
                          Add Generated Questions to Assignment
                        </button>
                        <p className="text-xs text-gray-500 italic mt-2">
                          3 more questions available. You can edit any question
                          before adding to your assignment.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-between">
                  <button
                    onClick={onBack}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 transition-colors duration-200"
                  >
                    Back to Creation Method
                  </button>
                  <button
                    onClick={onContinue}
                    className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors duration-200"
                  >
                    Continue to Manual Editing
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Responsive Styles */}
      <style jsx>{`
        @media (max-width: 767px) {
          .p-6 {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            padding: 1rem;
          }
        }
        @media (min-width: 768px) and (max-width: 1023px) {
          .p-6,
          .md\\:p-8 {
            padding: 1.5rem;
            display: flex;
            flex-direction: column;
            align-items: stretch;
          }
          .flex-1 {
            margin-left: ${navExpanded ? "330px" : "100px"};
          }
          .flex.justify-end {
            justify-content: flex-end;
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}

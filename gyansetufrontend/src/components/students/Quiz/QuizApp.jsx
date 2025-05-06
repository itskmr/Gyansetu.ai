import { useState, useEffect } from 'react';
import { BookOpen, ChevronRight, Calendar, Bot, Star } from 'lucide-react';

// Main Quiz Application Component
export default function QuizApp() {
  const [quizzes, setQuizzes] = useState({
    mainQuizzes: [],
    upcomingQuizzes: [],
    aiQuizzes: []
  });
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasMoreMain, setHasMoreMain] = useState(false);
  const [hasMoreUpcoming, setHasMoreUpcoming] = useState(false);
  const [hasMoreAi, setHasMoreAi] = useState(false);
  
  // Fetch quizzes from API
  useEffect(() => {
    const fetchQuizzes = async () => {
      setLoading(true);
      try {
        // In a real app, replace with actual API endpoint
        const response = await mockFetchQuizzes();
        setQuizzes(response.quizzes);
        // Set whether there are more quizzes to load
        setHasMoreMain(response.hasMoreMain);
        setHasMoreUpcoming(response.hasMoreUpcoming);
        setHasMoreAi(response.hasMoreAi);
        setLoading(false);
      } catch (err) {
        setError('Failed to load quizzes. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchQuizzes();
  }, []);
  
  // Mock API function - replace with actual API call
  const mockFetchQuizzes = () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          quizzes: {
            mainQuizzes: [
              {
                id: 1,
                title: 'Physics',
                completion: 0,
                questions: [
                  {
                    id: 1,
                    text: 'What is the SI unit of force?',
                    type: 'multiple-choice',
                    options: ['Newton', 'Joule', 'Watt', 'Pascal'],
                    correctAnswer: 'Newton'
                  },
                  {
                    id: 2,
                    text: 'What is the formula for calculating work done?',
                    type: 'multiple-choice',
                    options: ['F × d', 'm × a', 'P × t', 'E × t'],
                    correctAnswer: 'F × d'
                  },
                  {
                    id: 3,
                    text: 'What is the acceleration due to gravity on Earth (in m/s²)?',
                    type: 'text-input',
                    correctAnswer: '9.8'
                  }
                ]
              },
              {
                id: 2,
                title: 'Chemistry',
                completion: 25,
                questions: [
                  {
                    id: 1,
                    text: 'What is the chemical symbol for gold?',
                    type: 'multiple-choice',
                    options: ['Au', 'Ag', 'Fe', 'Cu'],
                    correctAnswer: 'Au'
                  }
                ]
              },
              {
                id: 3,
                title: 'Biology',
                completion: 50,
                questions: [
                  {
                    id: 1,
                    text: 'What is the powerhouse of the cell?',
                    type: 'multiple-choice',
                    options: ['Mitochondria', 'Nucleus', 'Ribosome', 'Golgi apparatus'],
                    correctAnswer: 'Mitochondria'
                  }
                ]
              },
              {
                id: 4,
                title: 'English',
                completion: 75,
                questions: [
                  {
                    id: 1,
                    text: 'What is the past tense of "go"?',
                    type: 'text-input',
                    correctAnswer: 'went'
                  }
                ]
              }
            ],
            upcomingQuizzes: [
              {
                id: 201,
                title: 'Advanced Mathematics',
                scheduledDate: '2025-05-15',
                description: 'Covers calculus, algebra, and geometry',
                questions: [] // Empty until quiz is published
              },
              {
                id: 202,
                title: 'World History',
                scheduledDate: '2025-05-18',
                description: 'Major historical events from ancient to modern times',
                questions: []
              },
              {
                id: 203,
                title: 'Computer Science',
                scheduledDate: '2025-05-20',
                description: 'Programming fundamentals and algorithms',
                questions: []
              }
            ],
            aiQuizzes: [
              {
                id: 301,
                title: 'Personalized Biology',
                completion: 0,
                generatedOn: '2025-04-28',
                difficulty: 'Medium',
                questions: [
                  {
                    id: 1,
                    text: 'Which structure in a plant cell performs photosynthesis?',
                    type: 'multiple-choice',
                    options: ['Chloroplast', 'Mitochondria', 'Nucleus', 'Ribosome'],
                    correctAnswer: 'Chloroplast'
                  },
                  {
                    id: 2,
                    text: 'What is the primary function of DNA?',
                    type: 'multiple-choice',
                    options: ['Store genetic information', 'Protein synthesis', 'Cell division', 'Energy production'],
                    correctAnswer: 'Store genetic information'
                  }
                ]
              },
              {
                id: 302,
                title: 'Custom Math Practice',
                completion: 10,
                generatedOn: '2025-04-30',
                difficulty: 'Hard',
                questions: [
                  {
                    id: 1,
                    text: 'Solve for x: log₂(x) = 3',
                    type: 'text-input',
                    correctAnswer: '8'
                  }
                ]
              }
            ]
          },
          // Metadata about whether more quizzes are available
          hasMoreMain: true,
          hasMoreUpcoming: false,
          hasMoreAi: true
        });
      }, 1000);
    });
  };
  
  // Start quiz handler
  const handleStartQuiz = (quiz) => {
    // Only start quizzes that have questions
    if (quiz.questions && quiz.questions.length > 0) {
      setActiveQuiz(quiz);
      setCurrentQuestion(0);
      setUserAnswers({});
    } else {
      alert("This quiz is not available yet.");
    }
  };
  
  // Handle answer selection
  const handleAnswerSelect = (questionId, answer) => {
    setUserAnswers({
      ...userAnswers,
      [questionId]: answer
    });
  };
  
  // Handle text input answer
  const handleTextInputChange = (questionId, value) => {
    setUserAnswers({
      ...userAnswers,
      [questionId]: value
    });
  };
  
  // Move to next question
  const handleNextQuestion = () => {
    if (currentQuestion < activeQuiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Calculate score and update completion
      const score = calculateScore();
      updateQuizCompletion(activeQuiz.id, score);
      setActiveQuiz(null);
    }
  };
  
  // Calculate score based on answers
  const calculateScore = () => {
    let correctAnswers = 0;
    activeQuiz.questions.forEach(question => {
      const userAnswer = userAnswers[question.id];
      if (userAnswer && userAnswer === question.correctAnswer) {
        correctAnswers++;
      }
    });
    
    return (correctAnswers / activeQuiz.questions.length) * 100;
  };
  
  // Update quiz completion
  const updateQuizCompletion = (quizId, completion) => {
    setQuizzes(prevQuizzes => {
      const updatedMain = prevQuizzes.mainQuizzes.map(quiz => 
        quiz.id === quizId ? { ...quiz, completion } : quiz
      );
      
      const updatedAi = prevQuizzes.aiQuizzes.map(quiz => 
        quiz.id === quizId ? { ...quiz, completion } : quiz
      );
      
      return {
        ...prevQuizzes,
        mainQuizzes: updatedMain,
        aiQuizzes: updatedAi
      };
    });
  };
  
  // "View More" handler - In a real app, this would fetch more quizzes
  const handleViewMore = (type) => {
    alert(`Loading more ${type} quizzes...`);
    // In a real app, make API call to fetch more quizzes
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-purple-600 font-semibold">Loading quizzes...</div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-red-600 font-semibold">{error}</div>
      </div>
    );
  }
  
  // Display active quiz if one is selected
  if (activeQuiz) {
    const question = activeQuiz.questions[currentQuestion];
    
    return (
      <div className="max-w-4xl mx-auto p-4 bg-gray-50 rounded-lg shadow">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">{activeQuiz.title} Quiz</h2>
        
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <div className="mb-4 flex justify-between">
            <span className="text-gray-600">Question {currentQuestion + 1} of {activeQuiz.questions.length}</span>
            <span className="text-violet-600 font-medium">
              {Math.round((currentQuestion / activeQuiz.questions.length) * 100)}% Complete
            </span>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
            <div 
              className="bg-violet-600 h-2 rounded-full" 
              style={{ width: `${(currentQuestion / activeQuiz.questions.length) * 100}%` }}
            ></div>
          </div>
          
          <h3 className="text-xl font-semibold mb-4">{question.text}</h3>
          
          {question.type === 'multiple-choice' ? (
            <div className="space-y-3">
              {question.options.map((option, index) => (
                <div 
                  key={index}
                  onClick={() => handleAnswerSelect(question.id, option)}
                  className={`p-3 border rounded-lg cursor-pointer ${
                    userAnswers[question.id] === option 
                      ? 'bg-violet-400 border-violet-400 ' 
                      : 'hover:bg-gray-200'
                  }`}
                >
                  {option}
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-4">
              <input
                type="text"
                placeholder="Type your answer here"
                value={userAnswers[question.id] || ''}
                onChange={(e) => handleTextInputChange(question.id, e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>
          )}
          
          <button
            onClick={handleNextQuestion}
            className="mt-6 bg-violet-600 text-white py-2 px-6 rounded-lg hover:bg-violet-700 transition"
          >
            {currentQuestion < activeQuiz.questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
          </button>
        </div>
      </div>
    );
  }
  
  // Main quiz listing UI
  return (
    <div className="max-w-full min-h-screen p-10 bg-gradient-to-r from-violet-400 to-violet-200">
      <div className="max-w-6xl mx-auto flex flex-col space-y-16">
        {/* Upcoming Quizzes Section */}
        <section className="w-full">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-800 flex items-center">
              <Calendar className="w-6 h-6 text-violet-700 mr-2" />
              <span>Upcoming Quizzes</span>
            </h2>
          </div>
          
          <div className="bg-white bg-opacity-50 rounded-3xl shadow-lg p-6 overflow-hidden">
            <div className="flex overflow-x-auto pb-4 gap-6 snap-x">
              {quizzes.upcomingQuizzes.map((quiz) => (
                <div key={quiz.id} className="snap-start flex-shrink-0 w-64">
                  <UpcomingQuizCard quiz={quiz} />
                </div>
              ))}
            </div>
            
            {hasMoreUpcoming && (
              <div className="flex justify-center mt-4">
                <button 
                  onClick={() => handleViewMore('upcoming')}
                  className="flex items-center text-violet-800 hover:text-violet-700 font-medium"
                >
                  View More <ChevronRight className="w-4 h-4 ml-1" />
                </button>
              </div>
            )}
          </div>
        </section>
        
        {/* AI-Generated Quizzes Section */}
        <section className="w-full">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-800 flex items-center">
              <Bot className="w-6 h-6 text-violet-700 mr-2" />
              <span>AI-Generated Quizzes</span>
            </h2>
          </div>
          
          <div className="bg-white bg-opacity-50 rounded-3xl shadow-lg p-6 overflow-hidden">
            <div className="flex overflow-x-auto pb-4 gap-6 snap-x">
              {quizzes.aiQuizzes.map((quiz) => (
                <div key={quiz.id} className="snap-start flex-shrink-0 w-64">
                  <AiQuizCard quiz={quiz} onStartQuiz={handleStartQuiz} />
                </div>
              ))}
            </div>
            
            {hasMoreAi && (
              <div className="flex justify-center mt-4">
                <button 
                  onClick={() => handleViewMore('ai')}
                  className="flex items-center text-violet-800 hover:text-violet-700 font-medium"
                >
                  View More <ChevronRight className="w-4 h-4 ml-1" />
                </button>
              </div>
            )}
          </div>
        </section>
        
        {/* Main Quizzes Section */}
        <section className="w-full">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-800 flex items-center">
              <Star className="w-6 h-6 text-violet-700 mr-2" />
              <span>Main Quizzes</span>
            </h2>
          </div>
          
          <div className="bg-white bg-opacity-50 rounded-3xl shadow-lg p-6 overflow-hidden">
            <div className="flex overflow-x-auto pb-4 gap-6 snap-x">
              {quizzes.mainQuizzes.map((quiz) => (
                <div key={quiz.id} className="snap-start flex-shrink-0 w-64">
                  <QuizCard quiz={quiz} onStartQuiz={handleStartQuiz} />
                </div>
              ))}
            </div>
            
            {hasMoreMain && (
              <div className="flex justify-center mt-4">
                <button 
                  onClick={() => handleViewMore('main')}
                  className="flex items-center text-violet-800 hover:text-violet-700 font-medium"
                >
                  View More <ChevronRight className="w-4 h-4 ml-1" />
                </button>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

// Regular Quiz Card Component
function QuizCard({ quiz, onStartQuiz }) {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow h-full">
      <div className="p-5">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">{quiz.title}</h3>
        
        <div className="mb-3">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-700 font-semibold">Progress</span>
            <span className="text-black font-medium">{quiz.completion}% Completed</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-violet-400 h-2 rounded-full" 
              style={{ width: `${quiz.completion}%` }}
            ></div>
          </div>
        </div>
        
        <button
          onClick={() => onStartQuiz(quiz)}
          className="w-full mt-3 bg-violet-400 text-white py-2 px-4 rounded-lg hover:bg-violet-500 transition"
        >
          Start
        </button>
      </div>
    </div>
  );
}

// AI-Generated Quiz Card Component
function AiQuizCard({ quiz, onStartQuiz }) {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow border-l-4 border-green-400 h-full">
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-800">{quiz.title}</h3>
          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">AI</span>
        </div>
        
        <div className="text-xs text-gray-600 mb-2">
          <p>Generated: {quiz.generatedOn}</p>
          <p>Difficulty: {quiz.difficulty}</p>
        </div>
        
        <div className="mb-2">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-700 font-semibold">Progress</span>
            <span className="text-black font-medium">{quiz.completion}% Completed</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-green-400 h-2 rounded-full" 
              style={{ width: `${quiz.completion}%` }}
            ></div>
          </div>
        </div>
        
        <button
          onClick={() => onStartQuiz(quiz)}
          className="w-full mt-3 bg-gradient-to-r from-green-400 to-blue-400 text-white py-2 px-4 rounded-lg hover:from-green-500 hover:to-blue-500 transition"
        >
          Start
        </button>
      </div>
    </div>
  );
}

// Upcoming Quiz Card Component
function UpcomingQuizCard({ quiz }) {
  // Format date to more readable format
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow border-l-4 border-yellow-400 h-full">
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-800">{quiz.title}</h3>
          <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">Coming Soon</span>
        </div>
        
        <div className="text-xs text-gray-600 mb-3">
          <p className="mb-1">Available from: {formatDate(quiz.scheduledDate)}</p>
          <p>{quiz.description}</p>
        </div>
        
        <button
          className="w-full mt-3 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg cursor-not-allowed"
          disabled
        >
          Coming Soon
        </button>
      </div>
    </div>
  );
}
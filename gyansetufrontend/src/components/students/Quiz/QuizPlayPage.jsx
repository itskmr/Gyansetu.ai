
// File: QuizPlayPage.jsx
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, X, AlertTriangle, ChevronRight, Award } from 'lucide-react';

const QuizPlayPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [quiz, setQuiz] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [isQuizSubmitted, setIsQuizSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [timerInterval, setTimerInterval] = useState(null);
  
  // On component mount, initialize the quiz and timer
  useEffect(() => {
    // Get quiz data from navigation state
    const quizData = location.state?.quiz;
    
    if (!quizData) {
      // If no quiz data, navigate back to quiz creation
      navigate('/quiz/create', { 
        state: { error: 'No quiz data found. Please create a new quiz.' }
      });
      return;
    }
    
    // Initialize quiz
    setQuiz(quizData);
    setSelectedAnswers(new Array(quizData.questions.length).fill(null));
    
    // Start timer
    const interval = setInterval(() => {
      setTimeElapsed(prev => prev + 1);
    }, 1000);
    
    setTimerInterval(interval);
    
    // Clean up
    return () => {
      clearInterval(interval);
    };
  }, [location, navigate]);
  
  // Handle answer selection
  const handleSelectAnswer = (answerIndex) => {
    if (isQuizSubmitted) return;
    
    const newSelectedAnswers = [...selectedAnswers];
    newSelectedAnswers[currentQuestionIndex] = answerIndex;
    setSelectedAnswers(newSelectedAnswers);
  };
  
  // Navigate to next question
  const handleNextQuestion = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };
  
  // Navigate to previous question
  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };
  
  // Submit the quiz and calculate score
  const handleSubmitQuiz = () => {
    // Check if all questions are answered
    const unansweredCount = selectedAnswers.filter(answer => answer === null).length;
    
    if (unansweredCount > 0) {
      if (!window.confirm(`You have ${unansweredCount} unanswered question${unansweredCount > 1 ? 's' : ''}. Do you want to submit anyway?`)) {
        return;
      }
    }
    
    // Calculate score
    let correctCount = 0;
    quiz.questions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correctAnswerIndex) {
        correctCount++;
      }
    });
    
    setScore(correctCount);
    setIsQuizSubmitted(true);
    clearInterval(timerInterval);
  };
  
  // Format time elapsed
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };
  
  // Restart quiz
  const handleRestartQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswers(new Array(quiz.questions.length).fill(null));
    setIsQuizSubmitted(false);
    setScore(0);
    setTimeElapsed(0);
    
    // Start timer again
    const interval = setInterval(() => {
      setTimeElapsed(prev => prev + 1);
    }, 1000);
    
    setTimerInterval(interval);
  };
  
  // Return to quiz creation
  const handleNewQuiz = () => {
    navigate('/quiz/create');
  };
  
  // Loading state
  if (!quiz) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-100 via-white to-violet-200 flex items-center justify-center">
        <div className="loader">
          <div className="w-3 h-3 bg-violet-500 rounded-full animate-bounce mx-1"></div>
          <div className="w-3 h-3 bg-violet-500 rounded-full animate-bounce mx-1" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-3 h-3 bg-violet-500 rounded-full animate-bounce mx-1" style={{ animationDelay: '0.4s' }}></div>
        </div>
      </div>
    );
  }
  
  const currentQuestion = quiz.questions[currentQuestionIndex];
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-100 via-white to-violet-200 pb-16">
      <div className="max-w-3xl mx-auto pt-8 px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <button 
              onClick={() => navigate(-1)} 
              className="mr-3 p-2 rounded-full hover:bg-gray-200"
              aria-label="Go back"
            >
              <ArrowLeft className="w-5 h-5 text-gray-700" />
            </button>
            <h1 className="text-xl md:text-2xl font-bold text-violet-900">{quiz.title}</h1>
          </div>
          <div className="text-gray-600">
            <span className="p-2 bg-white rounded-lg shadow-sm">
              Time: {formatTime(timeElapsed)}
            </span>
          </div>
        </div>
        
        {/* Quiz completion result */}
        {isQuizSubmitted && (
          <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8">
            <div className="flex flex-col items-center text-center mb-6">
              <Award className="w-16 h-16 text-violet-600 mb-4" />
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Quiz Completed!</h2>
              <p className="text-gray-600 mb-4">You scored {score} out of {quiz.questions.length}</p>
              <div className="w-full max-w-md bg-gray-200 rounded-full h-4 mb-2">
                <div 
                  className="bg-violet-600 h-4 rounded-full"
                  style={{ width: `${(score / quiz.questions.length) * 100}%` }}
                ></div>
              </div>
              <p className="text-gray-500 mb-6">
                {Math.round((score / quiz.questions.length) * 100)}% Correct • Completed in {formatTime(timeElapsed)}
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <button
                  onClick={handleRestartQuiz}
                  className="px-5 py-2 bg-violet-100 text-violet-700 rounded-lg hover:bg-violet-200 transition-colors"
                >
                  Try Again
                </button>
                <button
                  onClick={handleNewQuiz}
                  className="px-5 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
                >
                  New Quiz
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Progress bar */}
        <div className="bg-white rounded-xl shadow-lg p-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Question {currentQuestionIndex + 1} of {quiz.questions.length}
            </span>
            <span className="text-sm text-gray-500">
              {selectedAnswers.filter(answer => answer !== null).length} Answered
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-violet-600 h-2.5 rounded-full"
              style={{ width: `${((currentQuestionIndex + 1) / quiz.questions.length) * 100}%` }}
            ></div>
          </div>
        </div>
        
        {/* Question card */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Question */}
          <div className="p-6 md:p-8 border-b border-gray-100">
            <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-4">
              {currentQuestionIndex + 1}. {currentQuestion.question}
            </h2>
            
            {/* Answer options */}
            <div className="space-y-3">
              {currentQuestion.answers.map((answer, index) => (
                <div
                  key={index}
                  onClick={() => handleSelectAnswer(index)}
                  className={`p-4 rounded-lg border cursor-pointer transition-all 
                    ${isQuizSubmitted 
                      ? index === currentQuestion.correctAnswerIndex
                        ? 'bg-green-50 border-green-300' 
                        : selectedAnswers[currentQuestionIndex] === index
                          ? 'bg-red-50 border-red-300'
                          : 'border-gray-200 hover:border-gray-300'
                      : selectedAnswers[currentQuestionIndex] === index
                        ? 'bg-violet-50 border-violet-300'
                        : 'border-gray-200 hover:border-gray-300'
                    }
                  `}
                >
                  <div className="flex items-start">
                    <div className={`flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full mr-3 mt-0.5
                      ${isQuizSubmitted
                        ? index === currentQuestion.correctAnswerIndex
                          ? 'bg-green-500 text-white'
                          : selectedAnswers[currentQuestionIndex] === index
                            ? 'bg-red-500 text-white'
                            : 'bg-gray-200 text-gray-700'
                        : selectedAnswers[currentQuestionIndex] === index
                          ? 'bg-violet-500 text-white'
                          : 'bg-gray-200 text-gray-700'
                      }
                    `}>
                      {isQuizSubmitted ? (
                        index === currentQuestion.correctAnswerIndex ? (
                          <Check className="w-4 h-4" />
                        ) : selectedAnswers[currentQuestionIndex] === index ? (
                          <X className="w-4 h-4" />
                        ) : (
                          String.fromCharCode(65 + index)
                        )
                      ) : (
                        String.fromCharCode(65 + index)
                      )}
                    </div>
                    <span className="text-gray-800">{answer}</span>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Explanation (shown after submission) */}
            {isQuizSubmitted && (
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h3 className="font-medium text-blue-800 mb-2">Explanation:</h3>
                <p className="text-blue-700">{currentQuestion.explanation}</p>
              </div>
            )}
          </div>
          
          {/* Navigation buttons */}
          <div className="px-6 py-4 bg-gray-50 flex items-center justify-between">
            <button
              onClick={handlePreviousQuestion}
              disabled={currentQuestionIndex === 0}
              className={`px-4 py-2 rounded-lg flex items-center
                ${currentQuestionIndex === 0
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-700 hover:bg-gray-200'
                }
              `}
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Previous
            </button>
            
            <div className="flex-shrink-0">
              {!isQuizSubmitted && currentQuestionIndex === quiz.questions.length - 1 && (
                <button
                  onClick={handleSubmitQuiz}
                  className="px-5 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
                >
                  Submit Quiz
                </button>
              )}
            </div>
            
            <button
              onClick={handleNextQuestion}
              disabled={currentQuestionIndex === quiz.questions.length - 1}
              className={`px-4 py-2 rounded-lg flex items-center
                ${currentQuestionIndex === quiz.questions.length - 1
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-700 hover:bg-gray-200'
                }
              `}
            >
              Next
              <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        </div>
        
        {/* Question navigation buttons */}
        <div className="mt-8">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Jump to Question:</h3>
          <div className="flex flex-wrap gap-2">
            {quiz.questions.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentQuestionIndex(index)}
                className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm
                  ${selectedAnswers[index] !== null
                    ? isQuizSubmitted
                      ? selectedAnswers[index] === quiz.questions[index].correctAnswerIndex
                        ? 'bg-green-500 text-white'
                        : 'bg-red-500 text-white'
                      : 'bg-violet-500 text-white'
                    : 'bg-white text-gray-700 border border-gray-300'}
                  ${currentQuestionIndex === index ? 'ring-2 ring-offset-2 ring-violet-300' : ''}
                `}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
        
        {/* Submit button (fixed at bottom for mobile) */}
        {!isQuizSubmitted && (
          <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 md:hidden">
            <button
              onClick={handleSubmitQuiz}
              className="w-full py-3 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
            >
              Submit Quiz
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizPlayPage;

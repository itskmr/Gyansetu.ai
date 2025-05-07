
// File: QuizResultsPage.jsx
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Award, Check, X, BarChart, Download } from 'lucide-react';

const QuizResultsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get quiz results from navigation state
  const { quiz, selectedAnswers, score, timeElapsed } = location.state || {};
  
  // If no quiz data, navigate back to home
  if (!quiz) {
    navigate('/');
    return null;
  }
  
  // Format time elapsed
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };
  
  // Calculate percentage score
  const percentScore = Math.round((score / quiz.questions.length) * 100);
  
  // Get feedback based on score
  const getFeedback = () => {
    if (percentScore >= 90) return "Excellent! You've mastered this topic!";
    if (percentScore >= 75) return "Great job! You have a strong understanding of this topic.";
    if (percentScore >= 60) return "Good work! You understand most of the key concepts.";
    if (percentScore >= 40) return "You're making progress. Review the questions you missed.";
    return "Keep studying! Review the explanations for the questions you missed.";
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-100 via-white to-violet-200 pb-16">
      <div className="max-w-3xl mx-auto pt-8 px-4">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button 
            onClick={() => navigate(-1)} 
            className="mr-3 p-2 rounded-full hover:bg-gray-200"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
          <h1 className="text-2xl md:text-3xl font-bold text-violet-900">Quiz Results</h1>
        </div>
        
        {/* Results summary */}
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start mb-8">
            <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6">
              <div className="relative">
                <svg className="w-32 h-32" viewBox="0 0 36 36">
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#E0E0E0"
                    strokeWidth="3"
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#8B5CF6"
                    strokeWidth="3"
                    strokeDasharray={`${percentScore}, 100`}
                  />
                  <text x="18" y="20.5" textAnchor="middle" fill="#8B5CF6" fontSize="10" fontWeight="bold">
                    {percentScore}%
                  </text>
                </svg>
              </div>
            </div>
            <div className="text-center md:text-left">
              <h2 className="text-xl font-bold text-gray-800 mb-2">{quiz.title}</h2>
              <p className="text-violet-700 font-medium mb-4">{getFeedback()}</p>
              <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm">
                <div className="flex items-center">
                  <Award className="w-4 h-4 mr-1 text-violet-500" />
                  <span className="text-gray-600">Score: {score}/{quiz.questions.length}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1 text-violet-500" />
                  <span className="text-gray-600">Time: {formatTime(timeElapsed)}</span>
                </div>
                <div className="flex items-center">
                  <BarChart className="w-4 h-4 mr-1 text-violet-500" />
                  <span className="text-gray-600">
                    Correct: {score} ({percentScore}%)
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => navigate('/quiz/create')}
              className="px-5 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
            >
              New Quiz
            </button>
            <button
              onClick={() => navigate(-1)}
              className="px-5 py-2 bg-violet-100 text-violet-700 rounded-lg hover:bg-violet-200 transition-colors"
            >
              Review Answers
            </button>
            <button
              onClick={() => {/* TODO: Add download functionality */}}
              className="px-5 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center"
            >
              <Download className="w-4 h-4 mr-1" />
              Download Results
            </button>
          </div>
        </div>
        
        {/* Detailed question review */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-800">Question Review</h2>
          </div>
          
          {quiz.questions.map((question, index) => {
            const isCorrect = selectedAnswers[index] === question.correctAnswerIndex;
            
            return (
              <div 
                key={index} 
                className={`p-6 border-b border-gray-100 ${
                  isCorrect ? 'bg-green-50' : 'bg-red-50'
                }`}
              >
                <div className="flex items-start">
                  <div className={`flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full mr-3 ${
                    isCorrect ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                  }`}>
                    {isCorrect ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <X className="w-4 h-4" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800 mb-3">
                      {index + 1}. {question.question}
                    </h3>
                    
                    <div className="space-y-2 mb-4">
                      {question.answers.map((answer, answerIndex) => (
                        <div
                          key={answerIndex}
                          className={`p-3 rounded-lg ${
                            answerIndex === question.correctAnswerIndex
                              ? 'bg-green-100 border border-green-300'
                              : selectedAnswers[index] === answerIndex
                                ? 'bg-red-100 border border-red-300'
                                : 'bg-white border border-gray-200'
                          }`}
                        >
                          <div className="flex items-center">
                            <div className={`flex-shrink-0 w-5 h-5 flex items-center justify-center rounded-full mr-2 ${
                              answerIndex === question.correctAnswerIndex
                                ? 'bg-green-500 text-white'
                                : selectedAnswers[index] === answerIndex
                                  ? 'bg-red-500 text-white'
                                  : 'bg-gray-200 text-gray-700'
                            }`}>
                              {String.fromCharCode(65 + answerIndex)}
                            </div>
                            <span className={`${
                              answerIndex === question.correctAnswerIndex
                                ? 'text-green-800'
                                : selectedAnswers[index] === answerIndex
                                  ? 'text-red-800'
                                  : 'text-gray-800'
                            }`}>
                              {answer}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <h4 className="font-medium text-blue-800 mb-1">Explanation:</h4>
                      <p className="text-blue-700">{question.explanation}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default QuizResultsPage;

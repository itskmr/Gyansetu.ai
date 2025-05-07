// File: QuizHistoryPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Book, Calendar, BarChart2, Clock, Award, ChevronRight, Trash2 } from 'lucide-react';
import quizAPI from '../../../services/quizAPI';

const QuizHistoryPage = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const navigate = useNavigate();
  
  useEffect(() => {
    loadQuizzes();
  }, []);
  
  const loadQuizzes = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const quizzesData = await quizAPI.getQuizzes();
      setQuizzes(quizzesData);
    } catch (error) {
      console.error('Error loading quizzes:', error);
      setError('Failed to load quiz history. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const getDifficultyColor = (level) => {
    switch (level.toLowerCase()) {
      case 'beginner':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
        return 'bg-blue-100 text-blue-800';
      case 'advanced':
        return 'bg-purple-100 text-purple-800';
      case 'expert':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  const handleDeleteQuiz = async (e, quizId) => {
    e.stopPropagation();
    
    if (window.confirm('Are you sure you want to delete this quiz?')) {
      try {
        await quizAPI.deleteQuiz(quizId);
        loadQuizzes();
      } catch (error) {
        console.error('Error deleting quiz:', error);
        alert('Failed to delete quiz. Please try again.');
      }
    }
  };
  
  const handleQuizClick = async (quizId) => {
    try {
      setIsLoading(true);
      const quizData = await quizAPI.getQuiz(quizId);
      navigate('/quiz/play', { state: { quiz: quizData } });
    } catch (error) {
      console.error('Error loading quiz:', error);
      alert('Failed to load quiz. Please try again.');
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-100 via-white to-violet-200">
      <div className="max-w-4xl mx-auto pt-8 px-4 pb-16">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <button 
              onClick={() => navigate(-1)} 
              className="mr-3 p-2 rounded-full hover:bg-gray-200"
              aria-label="Go back"
            >
              <ArrowLeft className="w-5 h-5 text-gray-700" />
            </button>
            <h1 className="text-2xl md:text-3xl font-bold text-violet-900 flex items-center">
              <Book className="w-6 h-6 md:w-7 md:h-7 mr-2 text-violet-700" />
              Quiz History
            </h1>
          </div>
          
          <button
            onClick={() => navigate('/quiz/create')}
            className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
          >
            Create New Quiz
          </button>
        </div>
        
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
            <p>{error}</p>
            <button 
              className="mt-2 text-sm text-red-600 underline"
              onClick={loadQuizzes}
            >
              Try again
            </button>
          </div>
        )}
        
        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <div className="loader">
              <div className="w-3 h-3 bg-violet-500 rounded-full animate-bounce mx-1"></div>
              <div className="w-3 h-3 bg-violet-500 rounded-full animate-bounce mx-1" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-3 h-3 bg-violet-500 rounded-full animate-bounce mx-1" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </div>
        ) : quizzes.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <Book className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-700 mb-2">No Quizzes Found</h2>
            <p className="text-gray-500 mb-6">You haven't created any quizzes yet.</p>
            <button
              onClick={() => navigate('/quiz/create')}
              className="px-5 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
            >
              Create Your First Quiz
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quizzes.map((quiz) => (
              <div 
                key={quiz.id}
                onClick={() => handleQuizClick(quiz.id)}
                className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
              >
                <div className="p-5">
                  <div className="flex justify-between items-start mb-3">
                    <h2 className="text-lg font-semibold text-gray-800 line-clamp-1">{quiz.title}</h2>
                    <button
                      onClick={(e) => handleDeleteQuiz(e, quiz.id)}
                      className="p-1 text-gray-400 hover:text-red-500"
                      aria-label="Delete quiz"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    Topic: {quiz.topic}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${getDifficultyColor(quiz.level)}`}>
                      {quiz.level.charAt(0).toUpperCase() + quiz.level.slice(1)}
                    </span>
                    
                    <div className="flex items-center text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                      <Award className="w-3 h-3 mr-1" />
                      {quiz.questionCount} Questions
                    </div>
                    
                    {quiz.hasResults && (
                      <div className="flex items-center text-xs bg-violet-100 text-violet-700 px-2 py-1 rounded-full">
                        <BarChart2 className="w-3 h-3 mr-1" />
                        Completed
                      </div>
                    )}
                  </div>
                  
                  <div className="flex justify-between items-center mt-auto">
                    <div className="flex items-center text-xs text-gray-500">
                      <Calendar className="w-3 h-3 mr-1" />
                      {formatDate(quiz.createdAt)}
                    </div>
                    
                    <div className="text-violet-600 flex items-center text-sm font-medium">
                      Play Again
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizHistoryPage;
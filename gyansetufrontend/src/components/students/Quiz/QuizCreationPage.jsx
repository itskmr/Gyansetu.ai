import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Book, ArrowLeft, Loader } from 'lucide-react';
import quizAPI from '../../../services/quizAPI';

const QuizCreationPage = () => {
  const [topic, setTopic] = useState('');
  const [level, setLevel] = useState('intermediate');
  const [questionCount, setQuestionCount] = useState(5);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const navigate = useNavigate();
  const location = useLocation();
  
  // Initialize topic with suggested topic if available
  useEffect(() => {
    const suggestedTopic = location.state?.suggestedTopic;
    if (suggestedTopic) {
      setTopic(suggestedTopic);
    }
  }, [location]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!topic.trim()) {
      setError('Please enter a topic for the quiz');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const quizData = await quizAPI.generateQuiz(topic, level, questionCount);
      
      // Navigate to the quiz page with the generated quiz data
      navigate('/quiz/play', { 
        state: { quiz: quizData }
      });
    } catch (error) {
      console.error('Error generating quiz:', error);
      setError('Failed to generate quiz. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-100 via-white to-violet-200">
      <div className="max-w-2xl mx-auto pt-8 px-4 pb-16">
        <div className="flex items-center mb-8">
          <button 
            onClick={() => navigate(-1)} 
            className="mr-3 p-2 rounded-full hover:bg-gray-200"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
          <h1 className="text-2xl md:text-3xl font-bold text-violet-900 flex items-center">
            <Book className="w-6 h-6 md:w-7 md:h-7 mr-2 text-violet-700" />
            Create Quiz
          </h1>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
          <p className="text-gray-600 mb-6">
            Generate an AI-powered educational quiz on any topic. The quiz will include multiple-choice questions with explanations for correct answers.
          </p>
          
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
              <p>{error}</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="topic" className="block text-gray-700 font-medium mb-2">
                Quiz Topic *
              </label>
              <input
                type="text"
                id="topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. Photosynthesis, World War II, Algebra, Solar System"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                required
              />
              <p className="text-sm text-gray-500 mt-1">
                Be specific for better results
              </p>
            </div>
            
            <div className="mb-6">
              <label htmlFor="level" className="block text-gray-700 font-medium mb-2">
                Difficulty Level
              </label>
              <select
                id="level"
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
                <option value="expert">Expert</option>
              </select>
            </div>
            
            <div className="mb-8">
              <label htmlFor="questionCount" className="block text-gray-700 font-medium mb-2">
                Number of Questions
              </label>
              <div className="flex items-center">
                <button
                  type="button"
                  onClick={() => setQuestionCount(Math.max(3, questionCount - 1))}
                  className="px-3 py-2 bg-gray-200 rounded-l-lg text-gray-700 hover:bg-gray-300"
                  aria-label="Decrease question count"
                >
                  -
                </button>
                <input
                  type="number"
                  id="questionCount"
                  value={questionCount}
                  onChange={(e) => setQuestionCount(Math.max(3, Math.min(20, parseInt(e.target.value) || 5)))}
                  min="3"
                  max="20"
                  className="w-20 text-center py-2 border-t border-b border-gray-300 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setQuestionCount(Math.min(20, questionCount + 1))}
                  className="px-3 py-2 bg-gray-200 rounded-r-lg text-gray-700 hover:bg-gray-300"
                  aria-label="Increase question count"
                >
                  +
                </button>
                <span className="ml-3 text-gray-500">
                  (3-20 questions)
                </span>
              </div>
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 px-6 rounded-lg text-white font-medium text-lg
                ${isLoading 
                  ? 'bg-violet-400 cursor-not-allowed' 
                  : 'bg-violet-600 hover:bg-violet-700 active:bg-violet-800'}
                transition-colors duration-200 flex items-center justify-center
              `}
            >
              {isLoading ? (
                <>
                  <Loader className="w-5 h-5 mr-2 animate-spin" />
                  Generating Quiz...
                </>
              ) : (
                'Create Quiz'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default QuizCreationPage;
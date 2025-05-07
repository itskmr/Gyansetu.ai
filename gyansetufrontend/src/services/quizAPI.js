// File: quizAPI.js
import axios from 'axios';

// Set base URL based on environment
const BASE_URL = process.env.NODE_ENV === 'production' 
  ? '/api' 
  : 'http://localhost:5000/api';

// Create axios instance with common config
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

/**
 * Generate a quiz
 * @param {string} topic - The quiz topic
 * @param {string} level - Difficulty level
 * @param {number} questionCount - Number of questions
 * @returns {Promise} - Generated quiz data
 */
export const generateQuiz = async (topic, level, questionCount) => {
  try {
    const response = await api.post('/quiz/generate', {
      topic,
      level,
      questionCount
    });
    
    return response.data;
  } catch (error) {
    console.error('Error generating quiz:', error);
    
    // If we can't connect to the API, generate a client-side mock quiz
    if (error.message.includes('Network Error')) {
      console.log('Network error, generating client-side mock quiz');
      return generateClientMockQuiz(topic, level, questionCount);
    }
    
    throw error;
  }
};

/**
 * Get a quiz by ID
 * @param {string} quizId - The quiz ID
 * @returns {Promise} - Quiz data
 */
export const getQuiz = async (quizId) => {
  try {
    const response = await api.get(`/quiz/${quizId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching quiz:', error);
    throw error;
  }
};

/**
 * Save quiz results
 * @param {string} quizId - The quiz ID
 * @param {Array} selectedAnswers - Array of selected answer indices
 * @param {number} score - The quiz score
 * @param {number} timeElapsed - Time taken to complete quiz (seconds)
 * @returns {Promise} - Result data
 */
export const saveQuizResults = async (quizId, selectedAnswers, score, timeElapsed) => {
  try {
    const response = await api.post('/quiz/results', {
      quizId,
      selectedAnswers,
      score,
      timeElapsed
    });
    
    return response.data;
  } catch (error) {
    console.error('Error saving quiz results:', error);
    throw error;
  }
};

/**
 * Get all quizzes (for history)
 * @returns {Promise} - Quiz history data
 */
export const getQuizzes = async () => {
  try {
    const response = await api.get('/quiz');
    return response.data;
  } catch (error) {
    console.error('Error fetching quizzes:', error);
    throw error;
  }
};

/**
 * Delete a quiz
 * @param {string} quizId - The quiz ID to delete
 * @returns {Promise} - Delete confirmation
 */
export const deleteQuiz = async (quizId) => {
  try {
    const response = await api.delete(`/quiz/${quizId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting quiz:', error);
    throw error;
  }
};

/**
 * Generate a basic mock quiz on the client side for fallback
 * @param {string} topic - The quiz topic
 * @param {string} level - Difficulty level
 * @param {number} questionCount - Number of questions
 * @returns {Object} - A simple mock quiz
 */
function generateClientMockQuiz(topic, level, questionCount) {
  const questions = [];
  
  for (let i = 0; i < questionCount; i++) {
    // Generate a random correct answer index (0-3)
    const correctAnswerIndex = Math.floor(Math.random() * 4);
    
    questions.push({
      question: `Sample question ${i + 1} about ${topic}?`,
      answers: [
        `Option A for question ${i + 1}`,
        `Option B for question ${i + 1}`,
        `Option C for question ${i + 1}`,
        `Option D for question ${i + 1}`
      ],
      correctAnswerIndex: correctAnswerIndex,
      explanation: `This is why option ${String.fromCharCode(65 + correctAnswerIndex)} is correct.`
    });
  }
  
  return {
    id: 'mock-' + Date.now(),
    title: `${level.charAt(0).toUpperCase() + level.slice(1)} Quiz on ${topic}`,
    topic: topic,
    level: level,
    questions: questions,
    createdAt: new Date().toISOString()
  };
}

export default {
  generateQuiz,
  getQuiz,
  saveQuizResults,
  getQuizzes,
  deleteQuiz
};
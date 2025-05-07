// File: quizController.js
const quizService = require('../services/quizService');
const { v4: uuidv4 } = require('uuid');

// In-memory storage (replace with database in production)
let quizzes = [];

/**
 * Generate a new quiz based on topic, level, and question count
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function generateQuiz(req, res) {
  try {
    const { topic, level, questionCount } = req.body;
    
    // Validate input
    if (!topic || !level || !questionCount) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }
    
    // Validate limits
    if (questionCount < 3 || questionCount > 20) {
      return res.status(400).json({ error: 'Question count must be between 3 and 20' });
    }
    
    // Generate quiz using the service
    const quiz = await quizService.generateQuiz(topic, level, parseInt(questionCount));
    
    // Add timestamp and ID
    quiz.id = uuidv4();
    quiz.createdAt = new Date().toISOString();
    
    // Store the quiz
    quizzes.push(quiz);
    
    res.status(200).json(quiz);
  } catch (error) {
    console.error('Error generating quiz:', error);
    res.status(500).json({ error: 'Failed to generate quiz', message: error.message });
  }
}

/**
 * Get a quiz by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
function getQuiz(req, res) {
  try {
    const { quizId } = req.params;
    
    // Find the quiz
    const quiz = quizzes.find(q => q.id === quizId);
    
    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }
    
    res.status(200).json(quiz);
  } catch (error) {
    console.error('Error fetching quiz:', error);
    res.status(500).json({ error: 'Failed to fetch quiz', message: error.message });
  }
}

/**
 * Save quiz results
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
function saveQuizResults(req, res) {
  try {
    const { quizId, selectedAnswers, score, timeElapsed } = req.body;
    
    // Find the quiz
    const quiz = quizzes.find(q => q.id === quizId);
    
    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }
    
    // Add the results to the quiz
    if (!quiz.results) {
      quiz.results = [];
    }
    
    const resultId = uuidv4();
    
    quiz.results.push({
      id: resultId,
      selectedAnswers,
      score,
      timeElapsed,
      timestamp: new Date().toISOString()
    });
    
    res.status(200).json({ 
      success: true,
      resultId: resultId
    });
  } catch (error) {
    console.error('Error saving quiz results:', error);
    res.status(500).json({ error: 'Failed to save quiz results', message: error.message });
  }
}

/**
 * Get all quizzes (for history)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
function getQuizzes(req, res) {
  try {
    // Return basic info without questions
    const quizSummaries = quizzes.map(quiz => ({
      id: quiz.id,
      title: quiz.title,
      topic: quiz.topic,
      level: quiz.level,
      questionCount: quiz.questions.length,
      createdAt: quiz.createdAt,
      hasResults: Array.isArray(quiz.results) && quiz.results.length > 0
    }));
    
    // Sort by creation date (newest first)
    quizSummaries.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    res.status(200).json(quizSummaries);
  } catch (error) {
    console.error('Error fetching quizzes:', error);
    res.status(500).json({ error: 'Failed to fetch quizzes', message: error.message });
  }
}

/**
 * Delete a quiz
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
function deleteQuiz(req, res) {
  try {
    const { quizId } = req.params;
    
    // Find the quiz
    const quizIndex = quizzes.findIndex(q => q.id === quizId);
    
    if (quizIndex === -1) {
      return res.status(404).json({ error: 'Quiz not found' });
    }
    
    // Remove the quiz
    quizzes.splice(quizIndex, 1);
    
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error deleting quiz:', error);
    res.status(500).json({ error: 'Failed to delete quiz', message: error.message });
  }
}

module.exports = {
  generateQuiz,
  getQuiz,
  saveQuizResults,
  getQuizzes,
  deleteQuiz
};
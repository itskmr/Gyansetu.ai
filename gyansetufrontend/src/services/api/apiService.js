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
 * Send a message to the chatbot
 * @param {string} message - User's message
 * @param {File[]} files - Array of files to upload (optional)
 * @param {boolean} generateImage - Whether to generate an image (optional)
 * @param {string} chatId - Existing chat ID (optional)
 * @returns {Promise} - API response with formatted content
 */
export const sendMessage = async (message, files = [], generateImage = false, chatId = null) => {
  try {
    // Create form data for file uploads
    const formData = new FormData();
    formData.append('message', message);
    formData.append('generateImage', generateImage);
    
    if (chatId) {
      formData.append('chatId', chatId);
    }
    
    // Append files if any
    files.forEach(file => {
      formData.append('files', file);
    });
    
    // Send request
    const response = await api.post('/chat/message', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

/**
 * Request simplified version of a response
 * @param {string} messageId - ID of the message to simplify
 * @returns {Promise} - API response with simplified content
 */
export const simplifyResponse = async (messageId) => {
  try {
    const response = await api.post('/chat/simplify', { messageId });
    return response.data;
  } catch (error) {
    console.error('Error simplifying message:', error);
    throw error;
  }
};

/**
 * Get chat history
 * @returns {Promise} - API response with chat history
 */
export const getChatHistory = async () => {
  try {
    const response = await api.get('/chat/history');
    return response.data;
  } catch (error) {
    console.error('Error fetching chat history:', error);
    throw error;
  }
};

/**
 * Get a specific chat by ID
 * @param {string} chatId - ID of the chat to retrieve
 * @returns {Promise} - API response with chat data and messages
 */
export const getChat = async (chatId) => {
  try {
    const response = await api.get(`/chat/${chatId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching chat:', error);
    throw error;
  }
};

/**
 * Delete a chat
 * @param {string} chatId - ID of the chat to delete
 * @returns {Promise} - API response
 */
export const deleteChat = async (chatId) => {
  try {
    const response = await api.delete(`/chat/${chatId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting chat:', error);
    throw error;
  }
};

/**
 * Submit feedback for a message
 * @param {string} messageId - ID of the message
 * @param {string} feedbackType - Type of feedback ('like' or 'dislike')
 * @returns {Promise} - API response
 */
export const submitFeedback = async (messageId, feedbackType) => {
  try {
    const response = await api.post('/chat/feedback', { messageId, feedbackType });
    return response.data;
  } catch (error) {
    console.error('Error submitting feedback:', error);
    throw error;
  }
};

export default {
  sendMessage,
  simplifyResponse,
  getChatHistory,
  getChat,
  deleteChat,
  submitFeedback
};
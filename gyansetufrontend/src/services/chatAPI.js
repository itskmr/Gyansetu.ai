// chatAPI.js - Updated with improved error handling, debugging, and marks support
import axios from 'axios';

// Get API base URL with proper detection of frontend origin
const API_BASE_URL = 'http://localhost:5000/api';

console.log('Frontend connecting to API at:', API_BASE_URL);

// Create axios instance with common config and longer timeout
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  // Include credentials if your API requires them (cookies, auth headers)
  withCredentials: true,
  // Increase timeout to handle larger file uploads and image generation
  timeout: 120000 // 2 minutes
});

/**
 * ChatAPI - Client for interacting with the chatbot backend
 * Handles all chat-related API requests
 */
const ChatAPI = {
  /**
   * Send a message to the chatbot
   * @param {string} message - The message text
   * @param {Array} files - Array of file objects to upload
   * @param {boolean} generateImage - Whether to request image generation
   * @param {string} chatId - Optional chat ID for continuing a conversation
   * @param {number} marks - Optional marks value (2, 5, or 7) for answer context
   * @returns {Promise} - Response with message content and optional image
   */
  sendMessage: async (message, files = [], generateImage = false, chatId = null, marks = null) => {
    try {
      console.log('Sending message to API:', { 
        message, 
        generateImage, 
        chatId,
        marks,
        filesCount: files.length,
        fileDetails: files.map(f => `${f.name} (${f.type}, ${f.size} bytes)`)
      });
      
      // Create FormData for handling file uploads
      const formData = new FormData();
      formData.append('message', message);
      formData.append('generateImage', generateImage.toString());
      
      if (chatId) {
        formData.append('chatId', chatId);
      }
      
      // Add marks value if specified
      if (marks) {
        formData.append('marks', marks.toString());
      }
      
      // Add any files to the request - this is critical for file processing
      if (files && files.length > 0) {
        files.forEach((file, index) => {
          console.log(`Appending file ${index + 1}/${files.length} to FormData:`, file.name);
          formData.append('files', file);
        });
        
        // Log the FormData structure for debugging (only in development)
        console.log('FormData entries:');
        for (let [key, value] of formData.entries()) {
          console.log(`- ${key}: ${value instanceof File ? `${value.name} (${value.type})` : value}`);
        }
      }
      
      // Make the API request with proper headers for multipart/form-data
      const response = await apiClient.post('/chat/message', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });
      
      // Process the response
      let processedResponse = { ...response.data };
      
      // Fix the image URL if it exists
      if (processedResponse.imageUrl) {
        console.log('Original image URL:', processedResponse.imageUrl);
        
        // If it's a relative path without a leading slash, add one
        if (!processedResponse.imageUrl.startsWith('/') && !processedResponse.imageUrl.startsWith('http')) {
          processedResponse.imageUrl = '/' + processedResponse.imageUrl;
        }
        
        // For relative paths with leading slash, prepend the backend base URL
        if (processedResponse.imageUrl.startsWith('/') && !processedResponse.imageUrl.startsWith('//')) {
          // Extract the base URL without the /api path
          const backendBaseUrl = API_BASE_URL.replace(/\/api$/, '');
          processedResponse.imageUrl = backendBaseUrl + processedResponse.imageUrl;
        }
        
        console.log('Fixed image URL:', processedResponse.imageUrl);
      } else {
        console.log('No image URL in response');
      }
      
      console.log('Processed API response:', processedResponse);
      return processedResponse;
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Enhanced error handling
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Server error response:', {
          status: error.response.status,
          data: error.response.data,
          headers: error.response.headers
        });
      } else if (error.request) {
        // The request was made but no response was received
        console.error('No response received from server. The server may be down or not responding.');
        console.error('Request:', error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Error setting up request:', error.message);
      }
      
      // Rethrow with more context
      throw {
        message: 'Failed to send message to the server. Please check server connection.',
        originalError: error,
        isConnectionError: !error.response
      };
    }
  },
  
  /**
   * Request a simplified version of a message
   * @param {string} messageId - ID of the message to simplify 
   * @returns {Promise} - Response with simplified content
   */
  simplifyMessage: async (messageId) => {
    try {
      console.log('Requesting simplification for message ID:', messageId);
      const response = await apiClient.post('/chat/simplify', { messageId });
      console.log('Simplification response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error simplifying message:', error.response || error);
      throw error;
    }
  },
  
  /**
   * Submit feedback for a message (like/dislike)
   * @param {string} messageId - ID of the message
   * @param {string} feedbackType - Type of feedback ('like' or 'dislike') 
   * @returns {Promise} - Response with confirmation
   */
  submitFeedback: async (messageId, feedbackType) => {
    try {
      console.log('Submitting feedback:', { messageId, feedbackType });
      const response = await apiClient.post('/chat/feedback', {
        messageId,
        feedbackType
      });
      return response.data;
    } catch (error) {
      console.error('Error submitting feedback:', error.response || error);
      throw error;
    }
  },
  
  /**
   * Get chat history
   * @param {Object} filters - Optional filters (date, search query)
   * @returns {Promise} - Response with chat history items
   */
  getChatHistory: async (filters = {}) => {
    try {
      // Build query parameters from filters
      const params = new URLSearchParams();
      
      if (filters.query) {
        params.append('query', filters.query);
      }
      
      if (filters.dateFilter) {
        params.append('dateFilter', filters.dateFilter);
      }
      
      // Make the API request
      const response = await apiClient.get('/chat/history', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching chat history:', error.response || error);
      throw error;
    }
  },
  
  /**
   * Get a specific chat by ID with all messages
   * @param {string} chatId - ID of the chat to retrieve
   * @returns {Promise} - Response with chat data and messages
   */
  getChat: async (chatId) => {
    try {
      const response = await apiClient.get(`/chat/${chatId}`);
      
      // Process messages to ensure image URLs are correct
      if (response.data && response.data.messages) {
        response.data.messages = response.data.messages.map(message => {
          if (message.imageUrl) {
            // Fix the image URL
            if (!message.imageUrl.startsWith('/') && !message.imageUrl.startsWith('http')) {
              message.imageUrl = '/' + message.imageUrl;
            }
            
            if (message.imageUrl.startsWith('/') && !message.imageUrl.startsWith('//')) {
              const backendBaseUrl = API_BASE_URL.replace(/\/api$/, '');
              message.imageUrl = backendBaseUrl + message.imageUrl;
            }
          }
          return message;
        });
      }
      
      return response.data;
    } catch (error) {
      console.error('Error fetching chat:', error.response || error);
      throw error;
    }
  },
  
  /**
   * Delete a chat
   * @param {string} chatId - ID of the chat to delete
   * @returns {Promise} - Response with confirmation
   */
  deleteChat: async (chatId) => {
    try {
      const response = await apiClient.delete(`/chat/${chatId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting chat:', error.response || error);
      throw error;
    }
  },
  
  /**
   * Health check endpoint to verify API connectivity
   * @returns {Promise} - Response with API status
   */
  checkHealth: async () => {
    try {
      console.log('Checking API health at:', `${API_BASE_URL}/health`);
      const response = await apiClient.get('/health');
      console.log('Health check response:', response.data);
      return response.data;
    } catch (error) {
      console.error('API health check failed:', error.response || error);
      // More detailed error info
      if (!error.response) {
        console.error('Cannot connect to backend server. Please check if the server is running.');
      }
      throw error;
    }
  }
};

export default ChatAPI;
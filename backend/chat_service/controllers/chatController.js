const chatService = require('../services/chatService');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs');

// In-memory storage (replace with database in production)
let chats = [];
let messages = [];

/**
 * Process a new message from the user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function sendMessage(req, res) {
  try {
    const { message } = req.body;
    const generateImage = req.body.generateImage === 'true';
    const files = req.files || [];
    const marks = req.body.marks ? parseInt(req.body.marks) : null; // Parse marks parameter
    
    // Log incoming request details
    console.log('Received message request:', {
      message: message ? message.substring(0, 50) + (message.length > 50 ? '...' : '') : null,
      generateImage,
      marks,
      filesCount: files.length,
      fileTypes: files.map(f => f.mimetype)
    });
    
    // Validate input
    if (!message && files.length === 0) {
      return res.status(400).json({ error: 'Message or files are required' });
    }
    
    // Validate marks parameter if provided
    if (marks && ![2, 5, 7].includes(marks)) {
      return res.status(400).json({ error: 'Marks value must be 2, 5, or 7' });
    }
    
    // Process message with OpenAI, passing the marks parameter
    const response = await chatService.processMessage(message, files, generateImage, marks);
    
    // Generate a unique ID for this message
    const messageId = uuidv4();
    const timestamp = new Date().toISOString();
    
    // Get or create chat ID
    let chatId = req.body.chatId;
    if (!chatId) {
      chatId = uuidv4();
      
      // Create a new chat entry
      chats.push({
        id: chatId,
        title: extractChatTitle(message),
        createdAt: timestamp,
        updatedAt: timestamp
      });
    } else {
      // Update existing chat timestamp
      const chat = chats.find(c => c.id === chatId);
      if (chat) {
        chat.updatedAt = timestamp;
      }
    }
    
    // Store user message
    messages.push({
      id: uuidv4(),
      chatId: chatId,
      content: message,
      role: 'user',
      marks: marks, // Store marks value with the message
      files: files.map(file => ({
        name: file.originalname,
        path: file.path,
        type: file.mimetype
      })),
      timestamp: timestamp
    });
    
    // Store assistant message
    messages.push({
      id: messageId,
      chatId: chatId,
      content: response.content,
      imageUrl: response.imageUrl,
      role: 'assistant',
      timestamp: timestamp
    });
    
    // Return the response
    res.status(200).json({
      messageId: messageId,
      chatId: chatId,
      content: response.content,
      imageUrl: response.imageUrl,
      timestamp: timestamp
    });
  } catch (error) {
    console.error('Error in sendMessage:', error);
    res.status(500).json({ error: 'Failed to process message', message: error.message });
  }
}

/**
 * Simplify an assistant response
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function simplifyResponse(req, res) {
  try {
    const { messageId } = req.body;
    
    // Find the original message
    const originalMessage = messages.find(
      m => m.id === messageId && m.role === 'assistant'
    );
    
    if (!originalMessage) {
      return res.status(404).json({ error: 'Message not found' });
    }
    
    // Process the simplification
    const response = await chatService.simplifyResponse(originalMessage.content);
    
    // Store the simplified version
    const simplifiedId = uuidv4();
    const timestamp = new Date().toISOString();
    
    // Add simplified version to the original message or create a new one
    if (!originalMessage.simplifiedVersions) {
      originalMessage.simplifiedVersions = [];
    }
    
    originalMessage.simplifiedVersions.push({
      id: simplifiedId,
      content: response.content,
      timestamp: timestamp
    });
    
    // Return the simplified content
    res.status(200).json({
      messageId: messageId,
      simplifiedId: simplifiedId,
      content: response.content,
      timestamp: timestamp
    });
  } catch (error) {
    console.error('Error in simplifyResponse:', error);
    res.status(500).json({ error: 'Failed to simplify response', message: error.message });
  }
}

/**
 * Get chat history
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
function getChatHistory(req, res) {
  try {
    // Get filters from query parameters
    const { query, dateFilter } = req.query;
    
    // Start with all chats
    let filteredChats = [...chats];
    
    // Apply date filtering if specified
    if (dateFilter) {
      const now = new Date();
      let cutoffDate = new Date();
      
      // Set cutoff date based on filter
      switch (dateFilter) {
        case 'today':
          cutoffDate.setHours(0, 0, 0, 0); // Start of today
          break;
        case 'yesterday':
          cutoffDate.setDate(now.getDate() - 1);
          cutoffDate.setHours(0, 0, 0, 0); // Start of yesterday
          break;
        case 'week':
          cutoffDate.setDate(now.getDate() - 7); // 7 days ago
          break;
        case 'month':
          cutoffDate.setMonth(now.getMonth() - 1); // 1 month ago
          break;
        default:
          // No date filtering
          break;
      }
      
      // Filter chats by date
      filteredChats = filteredChats.filter(chat => {
        const chatDate = new Date(chat.updatedAt);
        return chatDate >= cutoffDate;
      });
    }
    
    // Apply search query filtering if specified
    if (query) {
      const lowerQuery = query.toLowerCase();
      
      filteredChats = filteredChats.filter(chat => {
        // Check if title contains query
        if (chat.title.toLowerCase().includes(lowerQuery)) {
          return true;
        }
        
        // Check if any message in this chat contains query
        const chatMessages = messages.filter(m => m.chatId === chat.id);
        return chatMessages.some(message => 
          message.content.toLowerCase().includes(lowerQuery)
        );
      });
    }
    
    // Sort by timestamp (newest first)
    filteredChats.sort((a, b) => 
      new Date(b.updatedAt) - new Date(a.updatedAt)
    );
    
    // Add a preview message to each chat
    const chatsWithPreview = filteredChats.map(chat => {
      // Find the first user message for this chat
      const firstUserMessage = messages
        .filter(m => m.chatId === chat.id && m.role === 'user')
        .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))[0];
      
      // Calculate a human-readable time description
      const timeDescription = getTimeDescription(chat.updatedAt);
      
      return {
        id: chat.id,
        title: chat.title,
        lastMessage: timeDescription,
        preview: firstUserMessage ? firstUserMessage.content : ''
      };
    });
    
    res.status(200).json(chatsWithPreview);
  } catch (error) {
    console.error('Error in getChatHistory:', error);
    res.status(500).json({ error: 'Failed to retrieve chat history', message: error.message });
  }
}

/**
 * Get a specific chat by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
function getChat(req, res) {
  try {
    const { chatId } = req.params;
    
    // Find the chat
    const chat = chats.find(c => c.id === chatId);
    
    if (!chat) {
      return res.status(404).json({ error: 'Chat not found' });
    }
    
    // Get all messages for this chat
    const chatMessages = messages
      .filter(m => m.chatId === chatId)
      .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    
    res.status(200).json({
      id: chat.id,
      title: chat.title,
      createdAt: chat.createdAt,
      updatedAt: chat.updatedAt,
      messages: chatMessages
    });
  } catch (error) {
    console.error('Error in getChat:', error);
    res.status(500).json({ error: 'Failed to retrieve chat', message: error.message });
  }
}

/**
 * Delete a chat
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
function deleteChat(req, res) {
  try {
    const { chatId } = req.params;
    
    // Find the chat
    const chatIndex = chats.findIndex(c => c.id === chatId);
    
    if (chatIndex === -1) {
      return res.status(404).json({ error: 'Chat not found' });
    }
    
    // Remove the chat
    chats.splice(chatIndex, 1);
    
    // Remove all messages for this chat
    messages = messages.filter(m => m.chatId !== chatId);
    
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error in deleteChat:', error);
    res.status(500).json({ error: 'Failed to delete chat', message: error.message });
  }
}

/**
 * Submit feedback for a message (like/dislike)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
function submitFeedback(req, res) {
  try {
    const { messageId, feedbackType } = req.body;
    
    // Validate input
    if (!messageId || !['like', 'dislike'].includes(feedbackType)) {
      return res.status(400).json({ error: 'Invalid feedback parameters' });
    }
    
    // Find the message
    const message = messages.find(m => m.id === messageId);
    
    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }
    
    // Initialize feedback object if it doesn't exist
    if (!message.feedback) {
      message.feedback = { liked: false, disliked: false };
    }
    
    // Update feedback
    if (feedbackType === 'like') {
      message.feedback.liked = !message.feedback.liked;
      // If liking, remove dislike if present
      if (message.feedback.liked) {
        message.feedback.disliked = false;
      }
    } else {
      message.feedback.disliked = !message.feedback.disliked;
      // If disliking, remove like if present
      if (message.feedback.disliked) {
        message.feedback.liked = false;
      }
    }
    
    res.status(200).json({ 
      success: true,
      messageId,
      feedback: message.feedback
    });
  } catch (error) {
    console.error('Error in submitFeedback:', error);
    res.status(500).json({ error: 'Failed to submit feedback', message: error.message });
  }
}

/**
 * Extract a title from the user's first message
 * @param {string} message - The user's message
 * @returns {string} - A generated title
 */
function extractChatTitle(message) {
  // Take the first 30 characters of the message, cut at the last space
  if (message.length <= 30) {
    return message;
  }
  
  const truncated = message.substring(0, 30);
  const lastSpaceIndex = truncated.lastIndexOf(' ');
  
  if (lastSpaceIndex === -1) {
    return truncated + '...';
  }
  
  return truncated.substring(0, lastSpaceIndex) + '...';
}

/**
 * Get a human-readable time description
 * @param {string} timestamp - ISO timestamp
 * @returns {string} - Human-readable time description
 */
function getTimeDescription(timestamp) {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now - date;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);
  
  if (diffMin < 1) {
    return 'Just now';
  } else if (diffMin < 60) {
    return `${diffMin} minute${diffMin === 1 ? '' : 's'} ago`;
  } else if (diffHour < 24) {
    return `${diffHour} hour${diffHour === 1 ? '' : 's'} ago`;
  } else if (diffDay < 7) {
    return `${diffDay} day${diffDay === 1 ? '' : 's'} ago`;
  } else {
    // Format date as MM/DD/YYYY
    return date.toLocaleDateString();
  }
}

module.exports = {
  sendMessage,
  simplifyResponse,
  getChatHistory,
  getChat,
  deleteChat,
  submitFeedback
};
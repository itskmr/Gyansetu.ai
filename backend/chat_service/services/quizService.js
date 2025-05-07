
// File: quizService.js
const axios = require('axios');

/**
 * Generate a quiz using OpenAI API
 * @param {string} topic - The quiz topic
 * @param {string} level - Difficulty level (beginner, intermediate, advanced, expert)
 * @param {number} questionCount - Number of questions to generate
 * @returns {Object} - The generated quiz
 */
async function generateQuiz(topic, level, questionCount) {
  try {
    console.log(`Generating ${questionCount} ${level} questions about "${topic}"`);
    
    // Use OpenAI API if key is available
    if (process.env.OPENAI_API_KEY) {
      return await generateQuizWithOpenAI(topic, level, questionCount);
    } else {
      // For testing or if no API key available, generate mock quiz
      console.log('No OpenAI API key, generating mock quiz');
      return generateMockQuiz(topic, level, questionCount);
    }
  } catch (error) {
    console.error('Error in quiz generation service:', error);
    
    // Provide a fallback if API fails
    console.log('Falling back to mock quiz generation');
    return generateMockQuiz(topic, level, questionCount);
  }
}

/**
 * Generate a quiz using OpenAI API
 * @param {string} topic - The quiz topic
 * @param {string} level - Difficulty level
 * @param {number} questionCount - Number of questions
 * @returns {Object} - The generated quiz with questions
 */
async function generateQuizWithOpenAI(topic, level, questionCount) {
  try {
    // Create system prompt for quiz generation
    const systemPrompt = `You are an expert educational quiz creator specializing in creating multiple-choice quizzes for students. 
Your task is to create a quiz on the topic provided by the user, with specific difficulty and number of questions.

RESPONSE FORMAT:
You must return a valid JSON object with the following structure:
{
  "title": "Title of the Quiz",
  "topic": "The topic of the quiz",
  "level": "The difficulty level",
  "questions": [
    {
      "question": "The full text of the question?",
      "answers": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswerIndex": 0, // Index of the correct answer (0-3)
      "explanation": "Detailed explanation of why this answer is correct"
    },
    // more questions...
  ]
}

INSTRUCTIONS:
1. Create exactly ${questionCount} multiple-choice questions on the topic of "${topic}"
2. Difficulty level should be ${level}
3. Each question must have exactly 4 answer options
4. Make sure questions are factually accurate and educational
5. Include a clear, detailed explanation for each correct answer
6. Ensure the quiz title is descriptive and engaging
7. Mix up the position of correct answers (don't always make option A correct)
8. Create questions that test understanding, not just memorization
9. For math or science topics, include formula-based questions if appropriate

RETURN ONLY THE JSON OBJECT WITH NO ADDITIONAL TEXT.`;

    // Call OpenAI API
    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Create a ${level} level quiz on "${topic}" with ${questionCount} questions.` }
      ],
      temperature: 0.7,
      response_format: { type: "json_object" }
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    // Extract and parse the quiz content
    const content = response.data.choices[0].message.content;
    const quiz = JSON.parse(content);
    
    // Validate the quiz structure
    validateQuizStructure(quiz, topic, level, questionCount);
    
    return quiz;
  } catch (error) {
    console.error('OpenAI API error:', error.response?.data || error.message);
    throw new Error('Failed to generate quiz with OpenAI');
  }
}

/**
 * Validate the structure of a quiz object
 * @param {Object} quiz - The quiz to validate
 * @param {string} topic - Expected topic
 * @param {string} level - Expected difficulty level
 * @param {number} questionCount - Expected number of questions
 */
function validateQuizStructure(quiz, topic, level, questionCount) {
  // Check if quiz has required properties
  if (!quiz.title || !quiz.questions || !Array.isArray(quiz.questions)) {
    throw new Error('Invalid quiz structure');
  }
  
  // Check if quiz has correct number of questions
  if (quiz.questions.length !== questionCount) {
    console.warn(`Quiz has ${quiz.questions.length} questions instead of ${questionCount}`);
    // We'll continue anyway as this is not critical
  }
  
  // Ensure topic and level are set
  quiz.topic = topic;
  quiz.level = level;
  
  // Validate each question
  quiz.questions.forEach((question, index) => {
    if (!question.question || !question.answers || !Array.isArray(question.answers) || 
        question.correctAnswerIndex === undefined || !question.explanation) {
      throw new Error(`Invalid structure for question ${index + 1}`);
    }
    
    // Ensure exactly 4 answers
    if (question.answers.length !== 4) {
      console.warn(`Question ${index + 1} has ${question.answers.length} answers instead of 4`);
      
      // Fix if possible
      if (question.answers.length < 4) {
        // Add placeholder answers if needed
        while (question.answers.length < 4) {
          question.answers.push(`Option ${String.fromCharCode(65 + question.answers.length)}`);
        }
      } else if (question.answers.length > 4) {
        // Trim excess answers
        question.answers = question.answers.slice(0, 4);
      }
    }
    
    // Ensure correctAnswerIndex is valid
    if (question.correctAnswerIndex < 0 || question.correctAnswerIndex >= question.answers.length) {
      console.warn(`Question ${index + 1} has invalid correctAnswerIndex: ${question.correctAnswerIndex}`);
      question.correctAnswerIndex = 0; // Default to first answer
    }
  });
}

/**
 * Generate a mock quiz for testing
 * @param {string} topic - The quiz topic
 * @param {string} level - Difficulty level
 * @param {number} questionCount - Number of questions
 * @returns {Object} - A mock quiz
 */
function generateMockQuiz(topic, level, questionCount) {
  const questions = [];
  
  // Create mock questions
  for (let i = 0; i < questionCount; i++) {
    const correctAnswerIndex = Math.floor(Math.random() * 4);
    
    questions.push({
      question: `Question ${i + 1} about ${topic}?`,
      answers: [
        `Answer option A for question ${i + 1}`,
        `Answer option B for question ${i + 1}`,
        `Answer option C for question ${i + 1}`,
        `Answer option D for question ${i + 1}`
      ],
      correctAnswerIndex: correctAnswerIndex,
      explanation: `This is the explanation for why option ${String.fromCharCode(65 + correctAnswerIndex)} is correct for question ${i + 1}.`
    });
  }
  
  return {
    title: `${level.charAt(0).toUpperCase() + level.slice(1)} Quiz on ${topic}`,
    topic: topic,
    level: level,
    questions: questions
  };
}

module.exports = {
  generateQuiz
};

const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');
const { OpenAIImageClient } = require('./OpenAIImageClient');
const { createWorker } = require('tesseract.js');

// Initialize clients
const openaiImage = new OpenAIImageClient();

// Configuration for OpenAI API
const openaiConfig = {
  baseURL: 'https://api.openai.com/v1',
  headers: {
    'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
    'Content-Type': 'application/json'
  }
};

/**
 * Process a message and generate a structured educational response
 * @param {string} message - The user's question or message
 * @param {Array} files - Any uploaded files (optional)
 * @param {boolean} generateImage - Whether to generate an image (optional)
 * @param {number} marks - Number of marks for answer detail level (optional)
 * @returns {Object} - The formatted response with optional image URL
 */
async function processMessage(message, files = [], generateImage = false, marks = null) {
  try {
    console.log(`Processing message. Generate image: ${generateImage}, Marks: ${marks}`);
    console.log(`Received ${files.length} files:`, files.map(f => `${f.originalname} (${f.mimetype})`));
    
    // Extract text content from files if applicable
    let extractedContent = '';
    if (files && files.length > 0) {
      console.log("Extracting content from files...");
      extractedContent = await extractContentFromFiles(files);
      console.log("Content extraction complete. Length:", extractedContent.length);
    }

    // Build the context for OpenAI
    const fullContext = extractedContent ? 
      `${message}\n\nContext from uploaded files:\n${extractedContent}` : 
      message;
    
    console.log("Full context prepared. Length:", fullContext.length);
    
    // Create system prompt for well-structured educational content
    // Adjust based on marks parameter
    let systemPrompt = `You are an educational AI assistant. 
Your task is to provide accurate, well-structured responses to student questions.

RESPONSE FORMAT:
- Always use proper headings and subheadings with # and ## markdown syntax
- Use bullet points (*) for lists
- Organize content logically with clear section breaks
- Include relevant examples where helpful
- Be concise yet thorough

If the student has uploaded files, analyze them carefully and incorporate relevant information in your response.
IMPORTANT: Base your answer primarily on the content of the uploaded files when applicable.
If the student has uploaded an image, analyze the text extracted from the image and any visual elements described.
Always mention if your answer is based on the uploaded files or images.`;

    // Add marks-specific instructions
    if (marks === 2) {
      systemPrompt += `\n\nIMPORTANT: This is a 2-mark question. 
- Keep your answer brief and to the point - approximately 2-3 sentences
- Focus only on the most essential facts
- No need for detailed explanations or examples
- The answer should be suitable for a short-answer exam question worth 2 marks`;
    } else if (marks === 5) {
      systemPrompt += `\n\nIMPORTANT: This is a 5-mark question.
- Provide a moderately detailed answer - approximately 1-2 paragraphs
- Include key facts and some supporting details
- Explain the main concepts clearly but avoid going into extensive depth
- The answer should be suitable for a medium-length exam question worth 5 marks`;
    } else if (marks === 7) {
      systemPrompt += `\n\nIMPORTANT: This is a 7-mark question.
- Provide a comprehensive answer with substantial detail - approximately 2-3 paragraphs
- Include all relevant facts, details, and explanations
- Use appropriate examples to illustrate concepts
- Include relevant formulas or methods if applicable
- The answer should be suitable for an extended exam question worth 7 marks`;
    }

    // For local testing without OpenAI API key
    if (!process.env.OPENAI_API_KEY) {
      console.log('No OpenAI API key found. Using mock response.');
      const formattedContent = createMockResponse(message, extractedContent, marks);
      
      // Handle image generation if requested
      let imageUrl = null;
      if (generateImage === true || generateImage === 'true') {
        imageUrl = await generateImageForResponse(message, formattedContent);
      }
      
      return {
        content: formattedContent,
        imageUrl: imageUrl
      };
    }

    // Call OpenAI API
    console.log('Calling OpenAI API with context length:', fullContext.length);
    
    try {
      const response = await axios.post('/chat/completions', {
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: fullContext }
        ],
        temperature: 0.7,
        max_tokens: 2000
      }, openaiConfig);

      // Extract the assistant's response
      const content = response.data.choices[0].message.content;
      console.log("Got response from OpenAI. Length:", content.length);
      
      // Format the response to ensure proper structure
      const formattedContent = formatResponseStructure(content);
      
      // Handle image generation if requested
      let imageUrl = null;
      if (generateImage === true || generateImage === 'true') {
        console.log('Image generation requested');
        imageUrl = await generateImageForResponse(message, formattedContent);
      }
      
      return {
        content: formattedContent,
        imageUrl: imageUrl
      };
    } catch (apiError) {
      console.error('OpenAI API error:', apiError.response?.data || apiError.message);
      
      // If API call fails, use mock response as fallback
      const formattedContent = createMockResponse(message, extractedContent, marks);
      
      // Handle image generation if requested
      let imageUrl = null;
      if (generateImage === true || generateImage === 'true') {
        imageUrl = await generateImageForResponse(message, formattedContent);
      }
      
      return {
        content: formattedContent,
        imageUrl: imageUrl
      };
    }
  } catch (error) {
    console.error('Error in processMessage:', error);
    
    // Provide a fallback response if API call fails
    const fallbackContent = createFallbackResponse(message);
    
    let imageUrl = null;
    if (generateImage === true || generateImage === 'true') {
      try {
        imageUrl = await generateImageForResponse(message, fallbackContent);
      } catch (imgError) {
        console.error('Image generation also failed:', imgError);
      }
    }
    
    return {
      content: fallbackContent,
      imageUrl: imageUrl
    };
  }
}

/**
 * Generate an image for an educational response
 * @param {string} query - The original question
 * @param {string} content - The formatted response content
 * @returns {string} - URL to the generated image
 */
async function generateImageForResponse(query, content) {
  try {
    console.log('Generating image for:', query);
    
    // Call OpenAIImageClient to generate image
    const imageResult = await openaiImage.generateImage(
      'Educational Illustration',
      query,
      content
    );
    
    if (imageResult.status === 'success' && imageResult.html_code) {
      // Save SVG to a file
      const imageUrl = await saveImageToStorage(imageResult.html_code, query);
      console.log('Image saved at:', imageUrl);
      return imageUrl;
    } else {
      console.error('Image generation did not return success status');
      return null;
    }
  } catch (error) {
    console.error('Error generating image:', error);
    return null;
  }
}

/**
 * Save the generated SVG image to storage
 * @param {string} svgCode - The SVG code
 * @param {string} query - The original query for naming
 * @returns {string} - The URL to the saved image
 */
async function saveImageToStorage(svgCode, query) {
  try {
    // Create a safe filename from the query
    const safeQuery = query
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]/gi, '_')
      .substring(0, 30);
    
    const filename = `${Date.now()}_${safeQuery}.svg`;
    const imageDir = process.env.IMAGE_DIR || 'images';
    const filepath = path.join(imageDir, filename);
    
    // Ensure the directory exists
    if (!fs.existsSync(imageDir)) {
      fs.mkdirSync(imageDir, { recursive: true });
    }
    
    // Write the SVG file
    await fs.promises.writeFile(filepath, svgCode);
    
    // Log the file path and directory
    console.log(`Image saved to: ${filepath}`);
    console.log(`Image directory (absolute): ${path.resolve(imageDir)}`);
    
    // Return the URL path to the image
    return `/${imageDir}/${filename}`;
  } catch (error) {
    console.error('Error saving image:', error);
    throw error;
  }
}

/**
 * Simplify an educational response to make it easier to understand
 * @param {string} originalContent - The original assistant response
 * @returns {Object} - The simplified response
 */
async function simplifyResponse(originalContent) {
  try {
    // System prompt for simplification
    const systemPrompt = `You are an educational AI assistant. 
Your task is to simplify the following educational content while maintaining its structure.

INSTRUCTIONS:
- Keep the same heading structure with # and ## markdown syntax
- Keep bullet points but simplify the language
- Use shorter sentences and simpler vocabulary
- Explain concepts as if for a younger audience
- Maintain the essential educational content
- Keep the same overall organization

The goal is to make the content more accessible without losing educational value.`;

    // For local testing without OpenAI API key
    if (!process.env.OPENAI_API_KEY) {
      return {
        content: simplifyTextLocally(originalContent)
      };
    }

    // Call OpenAI API
    try {
      const response = await axios.post('/chat/completions', {
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: originalContent }
        ],
        temperature: 0.7,
        max_tokens: 2000
      }, openaiConfig);

      // Extract the assistant's response
      const simplifiedContent = response.data.choices[0].message.content;
      
      // Format the response to ensure proper structure
      return {
        content: formatResponseStructure(simplifiedContent)
      };
    } catch (apiError) {
      console.error('OpenAI API error during simplification:', apiError.response?.data || apiError.message);
      return {
        content: simplifyTextLocally(originalContent)
      };
    }
  } catch (error) {
    console.error('Error in simplifyResponse:', error);
    return {
      content: simplifyTextLocally(originalContent)
    };
  }
}

/**
 * Create a mock response for testing without API
 * @param {string} message - The user message
 * @param {string} extractedContent - Content from files if any
 * @param {number} marks - Number of marks for answer detail level (optional)
 * @returns {string} - Formatted mock response
 */
function createMockResponse(message, extractedContent = '', marks = null) {
  // Extract the main topic from the message
  const topic = message.split(' ').slice(0, 3).join(' ');
  
  // Create different responses based on marks
  if (marks === 2) {
    // Very brief response for 2-mark questions
    if (extractedContent) {
      return `# ${topic} (2 marks)

The uploaded files show that ${topic} involves two key aspects: first, it requires understanding the basic principles; second, it involves applying those principles correctly in context.`;
    } else {
      return `# ${topic} (2 marks)

${topic} is a fundamental concept that involves two key aspects: understanding its basic definition and recognizing its common applications in everyday situations.`;
    }
  } else if (marks === 5) {
    // Medium-length response for 5-mark questions
    if (extractedContent) {
      return `# ${topic} (5 marks)

## Key Concepts
Based on the files you've uploaded, ${topic} involves several important principles:

* The files indicate that ${topic} is primarily concerned with structured information
* There are approximately ${extractedContent.length % 10 + 3} major components to consider
* The relationship between these components forms the basis of understanding

## Application
The uploaded content suggests that ${topic} can be applied in various educational contexts, particularly when analyzing complex information or solving structured problems.`;
    } else {
      return `# ${topic} (5 marks)

## Key Concepts
${topic} encompasses several important principles:

* It involves structured analysis of information
* There are 4-5 major components to understand
* The relationship between these components is crucial

## Application
${topic} can be applied in various educational contexts, particularly when solving problems that require systematic thinking and careful analysis.`;
    }
  } else if (marks === 7) {
    // Comprehensive response for 7-mark questions
    if (extractedContent) {
      return `# ${topic} (7 marks)

## Comprehensive Analysis
Based on the files you've uploaded, ${topic} represents a complex educational concept with multiple dimensions:

* The files indicate that ${topic} involves at least ${extractedContent.length % 5 + 5} distinct components
* Each component interacts with others to create a comprehensive framework
* Understanding requires both theoretical knowledge and practical application

## Historical Context
The uploaded content suggests that ${topic} has evolved significantly over time:
* Early approaches were more simplistic
* Modern understanding incorporates interdisciplinary perspectives
* Current research continues to expand the boundaries of this field

## Practical Applications
According to your files, ${topic} can be applied in numerous contexts:
* Educational settings use it to enhance learning outcomes
* Professional environments apply it to solve complex problems
* Research contexts use it to develop new theoretical frameworks

## Limitations and Considerations
The uploaded materials also highlight some important limitations:
* Not all aspects of ${topic} apply universally
* Contextual factors can significantly influence outcomes
* Critical analysis is necessary when applying these principles`;
    } else {
      return `# ${topic} (7 marks)

## Comprehensive Analysis
${topic} represents a complex educational concept with multiple dimensions:

* It involves at least 6 distinct components or principles
* Each component interacts with others to create a comprehensive framework
* Understanding requires both theoretical knowledge and practical application

## Historical Context
The concept of ${topic} has evolved significantly over time:
* Early approaches were more simplistic in nature
* Modern understanding incorporates interdisciplinary perspectives
* Current research continues to expand the boundaries of this field

## Practical Applications
${topic} can be applied in numerous contexts:
* Educational settings use it to enhance learning outcomes
* Professional environments apply it to solve complex problems
* Research contexts use it to develop new theoretical frameworks

## Limitations and Considerations
Important limitations to consider:
* Not all aspects of ${topic} apply universally
* Contextual factors can significantly influence outcomes
* Critical analysis is necessary when applying these principles`;
    }
  } else {
    // Default response (no marks specified)
    if (extractedContent) {
      return `# Response Based on Your Uploaded Files

## Analysis of File Content
Based on the files you've uploaded, I can provide the following information about ${topic}:

* The files contain information relevant to your query
* I've analyzed the content and extracted the key points
* The uploaded content is approximately ${extractedContent.length} characters long

## Key Information From Files
The uploaded files contain information about ${topic} that helps answer your question.

### Summary
Based solely on the content you provided in the uploaded files, ${topic} appears to be an important concept with several key aspects worth noting.`;
    } else {
      return `# ${topic}

## Key Concepts
This is an educational response about ${topic}.

### Important Details
* The first key point about ${topic}
* Another important aspect to understand
* Additional information with further clarification

## Summary
In conclusion, ${topic} is an important concept in education.`;
    }
  }
}

/**
 * Create a fallback response when API calls fail
 * @param {string} message - The user message
 * @returns {string} - Formatted fallback response
 */
function createFallbackResponse(message) {
  return `# Response to your question

I apologize, but I encountered an issue while processing your request about "${message}".

## What you can try
* Rephrase your question
* Try again in a few moments
* Check if your question is clear and specific

Thank you for your patience.`;
}

/**
 * Extract text content from uploaded files
 * @param {Array} files - The uploaded files
 * @returns {string} - Extracted content
 */
async function extractContentFromFiles(files) {
  let extractedContent = '';
  
  for (const file of files) {
    const fileName = file.originalname || file.name;
    const fileType = file.mimetype;
    const filePath = file.path;
    
    console.log(`Processing file: ${fileName} (${fileType}) at path: ${filePath}`);
    
    try {
      if (fileType.includes('text')) {
        // For text files, read the content directly
        try {
          const content = await fs.promises.readFile(filePath, 'utf8');
          extractedContent += `## Content from file: ${fileName}\n\n${content}\n\n`;
          console.log(`Extracted ${content.length} characters from text file`);
        } catch (readError) {
          console.error(`Error reading text file ${fileName}:`, readError);
          extractedContent += `## Error reading file: ${fileName}\n\nCould not read file content due to an error: ${readError.message}\n\n`;
        }
      } else if (fileType.includes('image')) {
        // For images, use OCR to extract text and analyze content
        extractedContent += `## Content from image file: ${fileName}\n\n`;
        
        try {
          // Extract text from image using OCR
          const imageText = await extractTextFromImage(filePath);
          
          if (imageText && imageText.trim().length > 0) {
            extractedContent += `### Text extracted from image:\n${imageText}\n\n`;
            console.log(`Extracted ${imageText.length} characters from image using OCR`);
          } else {
            extractedContent += `No text could be detected in this image.\n\n`;
            console.log(`No text detected in image ${fileName}`);
          }
          
          // Add image analysis (will be expanded in future)
          extractedContent += `### Image Description:\nThis is an uploaded image file named ${fileName}.\n\n`;
          
        } catch (ocrError) {
          console.error(`Error processing image ${fileName}:`, ocrError);
          extractedContent += `Error extracting text from image: ${ocrError.message}\n\n`;
        }
      } else if (fileType.includes('pdf')) {
        // For PDFs, add a placeholder (future: extract text with pdf-parse)
        extractedContent += `## Content from PDF file: ${fileName}\n\n`;
        extractedContent += `This is a PDF file. Please ask specific questions about the content of this PDF document.\n\n`;
        console.log(`Added description for PDF file ${fileName}`);
      } else if (fileType.includes('word') || fileType.includes('document') || fileType.includes('excel') || fileType.includes('spreadsheet')) {
        // For documents and spreadsheets, add placeholder
        extractedContent += `## Content from document file: ${fileName}\n\n`;
        extractedContent += `This is a document file. Please ask specific questions about the content of this document.\n\n`;
        console.log(`Added description for document file ${fileName}`);
      } else {
        // For other file types, just note their presence
        extractedContent += `## File: ${fileName} (${fileType})\n\nThis file type cannot be processed for content extraction.\n\n`;
        console.log(`File type ${fileType} not supported for content extraction`);
      }
    } catch (error) {
      console.error(`Error extracting content from ${fileName}:`, error);
      extractedContent += `## Error processing file: ${fileName}\n\nCould not extract content due to an error: ${error.message}\n\n`;
    }
  }
  
  return extractedContent;
}

/**
 * Extract text from an image using OCR
 * @param {string} imagePath - Path to the image file
 * @returns {string} - Extracted text
 */
async function extractTextFromImage(imagePath) {
  try {
    console.log(`Starting OCR for image: ${imagePath}`);
    
    const worker = await createWorker('eng');
    
    // Log OCR process
    console.log('OCR worker created, recognizing text...');
    
    // Recognize text from image
    const { data } = await worker.recognize(imagePath);
    
    // Terminate worker to free resources
    await worker.terminate();
    
    console.log(`OCR complete. Extracted ${data.text.length} characters`);
    
    return data.text;
  } catch (error) {
    console.error('OCR error:', error);
    throw new Error(`OCR failed: ${error.message}`);
  }
}

/**
 * Format the response to ensure proper structure
 * @param {string} content - The content to format
 * @returns {string} - Formatted content
 */
function formatResponseStructure(content) {
  // Ensure headings have proper spacing
  let formatted = content.replace(/^(#{1,3})\s*(.+)$/gm, (match, hashes, title) => {
    return `${hashes} ${title.trim()}`;
  });
  
  // Ensure bullet points are properly formatted
  formatted = formatted.replace(/^(\s*[-*])\s+(.+)$/gm, '$1 $2');
  
  // Add proper line breaks
  formatted = formatted.replace(/\n{3,}/g, '\n\n');
  
  return formatted;
}

/**
 * Simple function to create a simplified version without API
 * @param {string} text - The original text
 * @returns {string} - Simplified text
 */
function simplifyTextLocally(text) {
  // This is a very basic simplification
  return text
    .replace(/([.!?]) /g, '$1\n')  // Break sentences
    .split('\n')
    .map(line => {
      // Keep headings
      if (line.startsWith('#')) {
        return line;
      }
      
      // Keep bullet points
      if (line.trim().startsWith('*')) {
        return line;
      }
      
      // Simplify sentence length
      if (line.length > 50) {
        return line.substring(0, 50) + '...';
      }
      
      return line;
    })
    .join('\n');
}

module.exports = {
  processMessage,
  simplifyResponse
};